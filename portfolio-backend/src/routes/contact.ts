import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Message from '../models/Message';
import Profile from '../models/Profile';

const router = express.Router();

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m] as string));
}

interface ThemeColors {
  bg: string;
  shadowLight: string;
  shadowDark: string;
  accent: string;
  accent3: string;
  text: string;
  textDim: string;
}

const THEMES: Record<string, ThemeColors> = {
  lavender: {
    bg: '#E7ECF3',
    shadowLight: '#FFFFFF',
    shadowDark: '#C3CADA',
    accent: '#6C7CE0',
    accent3: '#8E97F2',
    text: '#3A4256',
    textDim: '#8790A6'
  },
  sage: {
    bg: '#E7EDE6',
    shadowLight: '#FFFFFF',
    shadowDark: '#C4D0C2',
    accent: '#5B8C5A',
    accent3: '#7BAA6E',
    text: '#2E3B2C',
    textDim: '#7C8C78'
  },
  sand: {
    bg: '#F0E9DE',
    shadowLight: '#FFFFFF',
    shadowDark: '#D2C4AE',
    accent: '#C97B4A',
    accent3: '#B8905F',
    text: '#3A2E22',
    textDim: '#8C7B68'
  },
  rose: {
    bg: '#F2E7EC',
    shadowLight: '#FFFFFF',
    shadowDark: '#D6C0CB',
    accent: '#B85C7A',
    accent3: '#C97F98',
    text: '#3A2530',
    textDim: '#8C6E7A'
  },
  sky: {
    bg: '#E3ECF5',
    shadowLight: '#FFFFFF',
    shadowDark: '#BFCEDE',
    accent: '#3D7EBF',
    accent3: '#5B9BD5',
    text: '#1E2E3D',
    textDim: '#6C7F91'
  }
};

// POST /api/contact - Public contact form submission
router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    // 1. Save message to MongoDB
    const newMessage = await Message.create({ name, email, message });

    // 2. Fetch owner's email from Profile (or fall back to SMTP_USER)
    const profile = await Profile.findOne();
    const recipientEmail = profile?.email || process.env.SMTP_USER;

    // Resolve color theme based on Profile design setting
    const design = profile?.design || 'lavender';
    const themeColors = THEMES[design] || THEMES.lavender;

    // 3. Send email using Nodemailer if SMTP details are configured
    const hasSmtpConfig =
      process.env.SMTP_USER &&
      process.env.SMTP_USER !== 'your-email@gmail.com' &&
      process.env.SMTP_PASS &&
      process.env.SMTP_PASS !== 'your-gmail-app-password';

    if (hasSmtpConfig && recipientEmail) {
      // Send email in background — never block the response
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Portfolio Message</title>
          <style>
            body {
              background-color: ${themeColors.bg};
              color: ${themeColors.text};
              font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
            }
            .email-wrapper {
              width: 100%;
              background-color: ${themeColors.bg};
              padding: 30px 0;
            }
            .email-container {
              width: 95%;
              max-width: 500px;
              margin: 0 auto;
              background-color: ${themeColors.bg};
              border-radius: 26px;
              border: 1px solid rgba(255, 255, 255, 0.8);
              box-shadow: 9px 9px 18px ${themeColors.shadowDark}, -9px -9px 18px ${themeColors.shadowLight};
              padding: 28px;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid ${themeColors.shadowDark};
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .header-title {
              font-size: 22px;
              font-weight: 700;
              color: ${themeColors.text};
              letter-spacing: 0.5px;
            }
            .header-title span {
              color: ${themeColors.accent};
            }
            .header-subtitle {
              font-size: 11px;
              font-weight: 600;
              color: ${themeColors.textDim};
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-top: 4px;
            }
            .label {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: ${themeColors.textDim};
              font-weight: 700;
              margin-bottom: 4px;
            }
            .value {
              font-size: 15px;
              color: ${themeColors.text};
              margin-bottom: 20px;
              font-weight: 600;
            }
            .message-box {
              background: ${themeColors.bg};
              border-radius: 18px;
              box-shadow: inset 4px 4px 8px ${themeColors.shadowDark}, inset -4px -4px 8px ${themeColors.shadowLight};
              padding: 20px;
              font-size: 14px;
              color: ${themeColors.text};
              margin-top: 10px;
              margin-bottom: 28px;
              white-space: pre-wrap;
              border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .btn-container {
              text-align: center;
              margin-bottom: 24px;
            }
            .btn {
              background: linear-gradient(135deg, ${themeColors.accent}, ${themeColors.accent3});
              color: #FFFFFF !important;
              padding: 12px 28px;
              border-radius: 100px;
              font-weight: 700;
              font-size: 14px;
              text-decoration: none;
              display: inline-block;
              box-shadow: 4px 4px 8px ${themeColors.shadowDark}, -4px -4px 8px ${themeColors.shadowLight};
            }
            .footer {
              font-size: 11px;
              color: ${themeColors.textDim};
              text-align: center;
              border-top: 1px solid rgba(200, 208, 224, 0.4);
              padding-top: 16px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="email-container">
              <div class="header">
                <div class="header-title">mahidhar<span>.</span>dev</div>
                <div class="header-subtitle">contact notification</div>
              </div>
              
              <div class="label">Sender Name</div>
              <div class="value">${escapeHtml(name)}</div>
              
              <div class="label">Email Address</div>
              <div class="value">
                <a href="mailto:${escapeHtml(email)}" style="color: ${themeColors.accent}; text-decoration: none; border-bottom: 1px dashed ${themeColors.accent};">${escapeHtml(email)}</a>
              </div>
              
              <div class="label">Message</div>
              <div class="message-box">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
              
              <div class="btn-container">
                <a href="mailto:${escapeHtml(email)}?subject=Re: Portfolio contact" class="btn">Reply to Recruiter</a>
              </div>
              
              <div class="footer">
                This email was automatically generated and sent from your portfolio site backend.
              </div>
            </div>
          </div>
        </body>
        </html>
        `;

        const mailOptions = {
          from: `"${name}" <${process.env.SMTP_USER}>`,
          to: recipientEmail,
          replyTo: email,
          subject: `[mahidhar] New Message from ${name}`,
          text: `You received a new message from your portfolio contact form:\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}\n\n` +
            `—\nThis email was sent automatically from your portfolio site backend.`,
          html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email notification sent successfully to ${recipientEmail}`);
      } catch (emailError) {
        // Log the error but DON'T fail the request — message is already saved in DB
        console.error('Email sending failed (message saved in DB):', emailError);
      }
    } else {
      console.log('SMTP is not configured; saved message in database only.');
    }

    res.status(201).json({
      message: 'Message sent successfully!',
      id: newMessage._id
    });
  } catch (error) {
    console.error('Error saving contact form submission:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

export default router;
