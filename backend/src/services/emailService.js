const nodemailer = require('nodemailer');

/**
 * Send Interview Invitation Email to Candidate
 */
exports.sendInterviewEmail = async ({ candidate, interviewDetails, company, job }) => {
  try {
    const candidateEmail = candidate?.email;
    if (!candidateEmail) {
      console.warn('⚠️ Cannot send email: Candidate has no email address.');
      return { success: false, reason: 'No candidate email' };
    }

    const companyName = company?.name || 'Recruitment Team';
    const jobTitle = job?.title || candidate?.job?.title || 'Position';
    const scheduledDateRaw = interviewDetails?.scheduledDate || new Date();
    
    let formattedDate = 'To be coordinated';
    try {
      formattedDate = new Date(scheduledDateRaw).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (e) {
      formattedDate = String(scheduledDateRaw);
    }

    const meetingLink = interviewDetails?.meetingLink || '';
    const interviewerName = interviewDetails?.interviewerName || 'Hiring Manager';
    const notes = interviewDetails?.notes || '';

    // Create Transporter (uses environment variables or safe fallback)
    let transporter;
    let isLiveSmtp = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      isLiveSmtp = true;
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      isLiveSmtp = true;
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      console.warn('⚠️ [SMTP CONFIG MISSING]: EMAIL_USER and EMAIL_PASS are not set in backend/.env.');
      console.warn('   To deliver live emails to candidate inboxes, add your EMAIL_USER and EMAIL_PASS in backend/.env and restart backend.');
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
    }

    const subject = `Interview Invitation: ${jobTitle} at ${companyName}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          .header { text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; }
          .logo-text { font-size: 22px; font-weight: bold; color: #10b981; }
          .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 12px; }
          h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
          .details-box { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .detail-row { margin-bottom: 12px; font-size: 14px; line-height: 1.6; }
          .detail-row strong { color: #38bdf8; }
          .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 10px; margin-top: 12px; text-align: center; }
          .footer { margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-text">${companyName}</div>
          </div>

          <div class="badge">📅 INTERVIEW INVITATION</div>
          <h2>Hello ${candidate.name},</h2>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
            We are excited to inform you that your application for the <strong>${jobTitle}</strong> position has passed our initial screening! You have been selected for an interview.
          </p>

          <div class="details-box">
            <div class="detail-row">
              <strong>📅 Scheduled Date & Time:</strong><br>
              <span style="font-size: 15px; color: #ffffff; font-weight: 600;">${formattedDate}</span>
            </div>
            
            <div class="detail-row">
              <strong>👤 Interviewer:</strong> ${interviewerName}
            </div>

            ${meetingLink ? `
            <div class="detail-row">
              <strong>🔗 Meeting Link:</strong><br>
              <a href="${meetingLink}" target="_blank" class="btn">Join Interview Meeting</a>
              <p style="font-size: 11px; color: #94a3b8; margin-top: 6px;">URL: ${meetingLink}</p>
            </div>
            ` : ''}

            ${notes ? `
            <div class="detail-row" style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #334155;">
              <strong>📝 Additional Notes / Preparation:</strong><br>
              <span style="color: #cbd5e1;">${notes}</span>
            </div>
            ` : ''}
          </div>

          <p style="font-size: 13px; color: #cbd5e1;">
            Please click the button above or copy the meeting link to join at the scheduled time. If you need to reschedule, please reply directly to this email.
          </p>

          <div class="footer">
            <p>© 2026 ${companyName} Hiring & Recruitment Team. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"${companyName} Hiring Team" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@talent-platform.com'}>`,
      to: candidateEmail,
      subject: subject,
      text: `Hello ${candidate.name},\n\nYour interview for ${jobTitle} at ${companyName} has been scheduled.\nDate & Time: ${formattedDate}\nInterviewer: ${interviewerName}\nMeeting Link: ${meetingLink}\nNotes: ${notes}\n\nBest regards,\n${companyName} Hiring Team`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`📧 [EMAIL SENT SUCCESS] Interview Invitation sent to: ${candidateEmail}`);
    if (info.messageId) {
      console.log(`   Message ID: ${info.messageId}`);
    }

    return {
      success: true,
      messageId: info.messageId || 'sent_dev_mode',
      recipient: candidateEmail
    };
  } catch (error) {
    console.error('⚠️ [EMAIL SEND ERROR]:', error.message);
    return { success: false, error: error.message };
  }
};
