const pdfParse = require('pdf-parse');
const https = require('https');

/**
 * Parses raw text from PDF buffer
 */
async function parseResumePdf(buffer) {
  try {
    const u8 = Buffer.isBuffer(buffer) ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) : buffer;
    const data = await pdfParse(u8);
    return data.text || '';
  } catch (error) {
    console.error('PDF Parse Error:', error.message);
    return typeof buffer === 'string' ? buffer : buffer.toString('utf-8');
  }
}

/**
 * Technical & soft skills dictionary for extraction
 */
const COMMON_SKILLS = [
  'javascript', 'typescript', 'react', 'reactjs', 'node', 'nodejs', 'express', 'expressjs', 'mongodb', 
  'python', 'django', 'flask', 'java', 'spring', 'springboot', 'c++', 'c#', '.net', 
  'html', 'css', 'tailwind', 'bootstrap', 'sql', 'postgresql', 'mysql', 'redis', 
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'github', 'agile', 'scrum', 
  'rest api', 'restful apis', 'graphql', 'jest', 'cypress', 'testing', 'microservices', 'devops',
  'machine learning', 'ai', 'nlp', 'data analysis', 'pandas', 'numpy', 'ui/ux',
  'communication', 'leadership', 'problem solving', 'project management'
];

/**
 * Synonym map to unify variations like reactjs -> React, nodejs -> Node.js
 */
const SKILL_SYNONYMS = {
  'reactjs': 'React',
  'react': 'React',
  'nodejs': 'Node.js',
  'node': 'Node.js',
  'expressjs': 'Express',
  'express': 'Express',
  'mongodb': 'MongoDB',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'python': 'Python',
  'aws': 'AWS',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'rest api': 'REST API',
  'restful apis': 'REST API',
  'graphql': 'GraphQL',
  'postgresql': 'PostgreSQL',
  'mysql': 'MySQL',
  'tailwind': 'Tailwind CSS',
  'html': 'HTML5',
  'css': 'CSS3'
};

function normalizeSkill(skill) {
  const lower = skill.toLowerCase().trim();
  return SKILL_SYNONYMS[lower] || skill.trim();
}

/**
 * Extract matched skills from text
 */
function extractSkills(text) {
  const lowerText = text.toLowerCase();
  const found = new Set();

  COMMON_SKILLS.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#])(${escaped})(?:$|[^a-zA-Z0-9_#])`, 'i');
    if (regex.test(lowerText)) {
      found.add(normalizeSkill(skill));
    }
  });

  return Array.from(found);
}

/**
 * Calculate ATS Structural Compatibility score
 */
function calculateAtsScore(resumeText) {
  let score = 55;
  const lower = resumeText.toLowerCase();

  const sections = ['experience', 'education', 'skills', 'projects', 'summary', 'work history', 'objective', 'certifications'];
  let foundSections = 0;
  sections.forEach(sec => {
    if (lower.includes(sec)) foundSections++;
  });
  
  score += Math.round((foundSections / sections.length) * 30);

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 250 && wordCount <= 2000) {
    score += 10;
  } else if (wordCount < 100) {
    score -= 20;
  }

  if (/@/.test(resumeText)) score += 3;
  if (/\b\d{10}\b|\+\d{1,3}/.test(resumeText)) score += 2;

  return Math.min(Math.max(Math.round(score), 30), 98);
}

/**
 * Try Google Gemini API Call if API key is provided
 */
async function callGeminiApi(resumeText, jobDescription, targetSkills) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey.trim() === '') return null;

  const promptText = `
You are an expert AI Resume Screener and Applicant Tracking System (ATS) Evaluator.
Analyze the following resume against the target job description and required skills.

JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS:
${targetSkills.join(', ')}

RESUME CONTENT:
${resumeText}

Respond ONLY with valid JSON (no markdown formatting, no code block backticks) matching this exact schema:
{
  "matchScore": <integer 0-100 representing true job alignment & qualification>,
  "atsCompatibilityScore": <integer 0-100 representing resume formatting, structure, and readability>,
  "matchingSkills": ["<skill1>", "<skill2>"],
  "missingSkills": ["<skill1>", "<skill2>"],
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>"],
  "aiSummary": "<2-3 sentence overview of candidate qualification for this position>"
}
`;

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { response_mime_type: "application/json" }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const responseText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const jsonClean = responseText.replace(/```json|```/g, '').trim();
            const aiData = JSON.parse(jsonClean);
            return resolve(aiData);
          }
        } catch (e) {
          console.warn('Gemini response parse fallback:', e.message);
        }
        resolve(null);
      });
    });

    req.on('error', (err) => {
      console.warn('Gemini API call failed, falling back to local AI engine:', err.message);
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Advanced Local Semantic AI Engine (Fallback when API Key is not set or network fails)
 */
function analyzeResumeLocalNLP(resumeText, jobDescription, targetSkills = []) {
  const cleanResume = resumeText.toLowerCase();
  const cleanJd = jobDescription.toLowerCase();

  const extractedResumeSkills = extractSkills(resumeText);
  const extractedJdSkills = extractSkills(jobDescription);

  // Combine provided target skills with skills detected in JD
  const allRequiredSkills = Array.from(new Set([
    ...targetSkills.map(normalizeSkill),
    ...extractedJdSkills
  ]));

  const matchingSkills = [];
  const missingSkills = [];

  if (allRequiredSkills.length > 0) {
    allRequiredSkills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      const escaped = lowerSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#])(${escaped})(?:$|[^a-zA-Z0-9_#])`, 'i');
      if (regex.test(cleanResume)) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
  } else {
    // If no explicit skills provided, use extracted resume skills
    matchingSkills.push(...extractedResumeSkills.slice(0, 5));
  }

  // 1. Skill Match Weighting (60% of total score)
  let skillRatio = 0.5;
  if (allRequiredSkills.length > 0) {
    skillRatio = matchingSkills.length / allRequiredSkills.length;
  } else if (extractedResumeSkills.length > 0) {
    skillRatio = Math.min(extractedResumeSkills.length / 6, 0.95);
  }

  // 2. Technical Context & Keyword Overlap (25% of total score)
  const stopWords = new Set(['and', 'the', 'with', 'for', 'that', 'this', 'from', 'have', 'were', 'will', 'your', 'their', 'work', 'experience', 'using']);
  const jdKeywords = cleanJd.split(/\W+/).filter(w => w.length > 3 && !stopWords.has(w));
  let matchedKeywordCount = 0;
  jdKeywords.forEach(word => {
    if (cleanResume.includes(word)) matchedKeywordCount++;
  });
  const keywordRatio = jdKeywords.length > 0 ? (matchedKeywordCount / jdKeywords.length) : 0.5;

  // 3. Seniority & Experience Indicators (15% of total score)
  let experienceScore = 0.5;
  if (/senior|lead|principal|architect|5\+|6\+|7\+|8\+/i.test(cleanResume)) {
    experienceScore = 0.9;
  } else if (/mid-level|3\+|4\+|intermediate/i.test(cleanResume)) {
    experienceScore = 0.75;
  } else if (/junior|entry|intern|1\+|2\+/i.test(cleanResume)) {
    experienceScore = 0.6;
  }

  // Calculate final dynamic match score
  const rawScore = (skillRatio * 60) + (keywordRatio * 25) + (experienceScore * 15);
  const matchScore = Math.min(Math.max(Math.round(rawScore), 20), 98);

  const atsCompatibilityScore = calculateAtsScore(resumeText);

  // Generate Strengths, Weaknesses, and Suggestions
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (matchingSkills.length > 0) {
    strengths.push(`Proven skills in core required tech stack: ${matchingSkills.slice(0, 5).join(', ')}.`);
  }
  if (atsCompatibilityScore >= 80) {
    strengths.push('Clean structural section headers boosting ATS readability.');
  }
  if (experienceScore >= 0.8) {
    strengths.push('Strong indication of senior-level leadership and project complexity.');
  }

  if (missingSkills.length > 0) {
    weaknesses.push(`Skill gap detected in target requirements: ${missingSkills.slice(0, 4).join(', ')}.`);
    suggestions.push(`Highlight any practical experience or projects involving: ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  if (resumeText.split(/\s+/).length < 250) {
    weaknesses.push('Resume content appears brief with minimal detailed project achievements.');
    suggestions.push('Expand work experience bullet points with quantitative metric outcomes (e.g. "Increased API throughput by 40%").');
  }

  if (suggestions.length === 0) {
    suggestions.push('Include direct links to portfolio projects, live demos, or GitHub repositories.');
  }

  const aiSummary = `Candidate demonstrates a ${matchScore >= 80 ? 'strong' : matchScore >= 60 ? 'moderate' : 'basic'} match (${matchScore}%) for the position. ${matchingSkills.length} out of ${allRequiredSkills.length || matchingSkills.length} key required skills were identified in the resume.`;

  return {
    parsedText: resumeText,
    matchScore,
    atsCompatibilityScore,
    matchingSkills,
    missingSkills,
    strengths,
    weaknesses,
    suggestions,
    aiSummary
  };
}

/**
 * Main AI Screening & Job Matching Function
 */
async function analyzeResume(resumeBuffer, jobDescription, targetSkills = []) {
  let resumeText = '';
  if (Buffer.isBuffer(resumeBuffer)) {
    resumeText = await parseResumePdf(resumeBuffer);
  } else if (typeof resumeBuffer === 'string') {
    resumeText = resumeBuffer;
  }

  // 1. Try Gemini API first if configured
  const geminiResult = await callGeminiApi(resumeText, jobDescription, targetSkills);
  if (geminiResult && geminiResult.matchScore !== undefined) {
    return {
      parsedText: resumeText,
      matchScore: Math.min(Math.max(Math.round(geminiResult.matchScore), 0), 100),
      atsCompatibilityScore: Math.min(Math.max(Math.round(geminiResult.atsCompatibilityScore || 85), 0), 100),
      matchingSkills: Array.isArray(geminiResult.matchingSkills) ? geminiResult.matchingSkills : [],
      missingSkills: Array.isArray(geminiResult.missingSkills) ? geminiResult.missingSkills : [],
      strengths: Array.isArray(geminiResult.strengths) ? geminiResult.strengths : [],
      weaknesses: Array.isArray(geminiResult.weaknesses) ? geminiResult.weaknesses : [],
      suggestions: Array.isArray(geminiResult.suggestions) ? geminiResult.suggestions : [],
      aiSummary: geminiResult.aiSummary || 'AI screening evaluation completed.'
    };
  }

  // 2. Fallback to advanced local AI engine
  return analyzeResumeLocalNLP(resumeText, jobDescription, targetSkills);
}

module.exports = {
  parseResumePdf,
  analyzeResume
};
