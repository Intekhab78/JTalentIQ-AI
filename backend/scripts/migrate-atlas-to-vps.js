const mongoose = require('mongoose');
require('dotenv').config();

// Connection URIs
const ATLAS_URI = process.env.ATLAS_URI || 'mongodb+srv://Admin:AtlasPass2026@cluster0.es4xou2.mongodb.net/resume_screening_db';

// VPS URI - auto detect if VPS_URI passed in env or fallback to local tunnel / VPS standard
let VPS_URI = process.env.VPS_URI || process.env.MONGODB_URI || 'mongodb://jtalentiq_user:jtalentq%402026%23Secure@127.0.0.1:27017/JTalentIQ?authSource=JTalentIQ';

// If running locally with SSH tunnel (-L 27018:127.0.0.1:27017), override port to 27018 if 27017 fails
if (process.argv.includes('--tunnel')) {
  VPS_URI = VPS_URI.replace(':27017/', ':27018/');
}

async function migrateData() {
  console.log('🚀 Starting MongoDB Migration from Atlas to VPS...');
  console.log(`Using VPS Mongo URI: ${VPS_URI.replace(/:([^@]+)@/, ':****@')}`);
  
  let atlasConn, vpsConn;
  
  try {
    // 1. Connect to Mongo Atlas
    console.log('📡 Connecting to MongoDB Atlas...');
    atlasConn = await mongoose.createConnection(ATLAS_URI, { serverSelectionTimeoutMS: 10000 }).asPromise();
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // 2. Connect to VPS MongoDB
    console.log('📡 Connecting to VPS MongoDB...');
    try {
      vpsConn = await mongoose.createConnection(VPS_URI, { serverSelectionTimeoutMS: 10000 }).asPromise();
    } catch (vpsErr) {
      if (!process.argv.includes('--tunnel') && VPS_URI.includes(':27017/')) {
        console.log('⚠️ Failed on port 27017, trying local SSH tunnel port 27018...');
        const tunnelUri = VPS_URI.replace(':27017/', ':27018/');
        vpsConn = await mongoose.createConnection(tunnelUri, { serverSelectionTimeoutMS: 10000 }).asPromise();
        console.log('✅ Connected via SSH tunnel port 27018!');
      } else {
        throw vpsErr;
      }
    }
    console.log('✅ Connected to VPS MongoDB successfully!');

    const atlasDb = atlasConn.db;
    const vpsDb = vpsConn.db;

    // Get all collection names from Atlas database (resume_screening_db)
    const collections = await atlasDb.listCollections().toArray();
    console.log(`\n📦 Found ${collections.length} collections in Atlas database.`);

    let totalMigrated = 0;
    let totalSkipped = 0;

    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith('system.')) continue;

      console.log(`\n🔄 Processing collection: [${colName}]`);

      const atlasCol = atlasDb.collection(colName);
      const vpsCol = vpsDb.collection(colName);

      const documents = await atlasCol.find({}).toArray();
      console.log(`   📄 Found ${documents.length} documents in Atlas [${colName}]`);

      if (documents.length === 0) {
        console.log(`   ⏭️ Skipping empty collection: ${colName}`);
        continue;
      }

      // $setOnInsert ensures existing documents with the same _id are NOT modified or deleted,
      // and only missing documents are added to the VPS MongoDB.
      const bulkOps = documents.map(doc => ({
        updateOne: {
          filter: { _id: doc._id },
          update: { $setOnInsert: doc },
          upsert: true
        }
      }));

      const result = await vpsCol.bulkWrite(bulkOps, { ordered: false });
      const insertedCount = result.upsertedCount || 0;
      const matchedCount = result.matchedCount || 0;

      totalMigrated += insertedCount;
      totalSkipped += matchedCount;

      console.log(`   ✅ Collection [${colName}] processed:`);
      console.log(`      - Inserted (New records added): ${insertedCount}`);
      console.log(`      - Kept intact (Already existed): ${matchedCount}`);
    }

    console.log('\n======================================================');
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log(`📊 Summary: ${totalMigrated} new records inserted, ${totalSkipped} existing records kept.`);
    console.log('🔒 NO DATA WAS DELETED OR OVERWRITTEN ON VPS MONGO.');
    console.log('======================================================\n');

  } catch (error) {
    console.error('❌ Migration Error:', error.message);
  } finally {
    if (atlasConn) await atlasConn.close();
    if (vpsConn) await vpsConn.close();
    console.log('🔌 Connections closed.');
    process.exit(0);
  }
}

migrateData();
