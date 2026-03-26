import nodemailer from 'nodemailer';

export const sendPlanAcourdingEmail = async (
  plan: string,
  businessName: string,
  email: string,
  message: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_EMAIL_ID,
      pass: process.env.MAIL_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Biziffy" <${process.env.MAIL_EMAIL_ID}>`,
    to: email,
    subject: `Biziffy - Your ${plan} Plan is Being Processed`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #007bff;">Hello ${businessName},</h2>
        <p>🎉 Thank you for purchasing the <strong>${plan}</strong> plan!</p>
        <p>Your plan is being processed and will be activated shortly.</p>

        ${
          message
            ? `<p style="margin-top: 10px;"><strong>Admin Message:</strong><br/>${message}</p>`
            : ''
        }

        <br />
        <p>If you have any questions, feel free to contact us at <a href="mailto:support@biziffy.com">support@biziffy.com</a>.</p>

        <p>Stay connected with us on:</p>
        <div>
            <a href="https://biziffy.com">🌐 Website</a> |
            <a href="https://facebook.com/biziffy">📘 Facebook</a> |
            <a href="https://twitter.com/biziffy">🐦 Twitter/X</a> |
            <a href="https://instagram.com/biziffy">📸 Instagram</a> |
            <a href="https://linkedin.com/company/biziffy">🔗 LinkedIn</a>
        </div>

        <hr />
        <p>Best regards,<br/>The Biziffy Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
