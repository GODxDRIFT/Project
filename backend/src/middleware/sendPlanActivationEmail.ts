import nodemailer from 'nodemailer';

export const sendPlanActivationEmail = async (
  email: string,
  businessName: string,
  planName: string
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
    subject: `Biziffy - Thank You for Purchasing the ${planName} Plan`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #007bff;">Thank You, ${businessName}!</h2>
        <p style="margin: 0;">We’re excited to welcome you to Biziffy Premium Services.</p>
        <p style="margin: 0;">You’ve successfully purchased the <strong>${planName}</strong> plan.</p>
        <p style="margin: 0;">Your plan is currently being processed and will be activated soon.</p>
        <p style="margin: 0;">We'll notify you as soon as it's live, and you can start enjoying the exclusive features and benefits.</p>
        <br/>
        <p style="margin: 0;">If you have any questions, feel free to contact us at <a href="mailto:support@biziffy.com">support@biziffy.com</a>.</p>
        <p>Stay connected with us on social media:</p>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://biziffy.com">🌐 www.biziffy.com</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://facebook.com/biziffy">📘 Facebook</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://twitter.com/biziffy">🐦 Twitter/X</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://instagram.com/biziffy">📸 Instagram</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://linkedin.com/company/biziffy">🔗 LinkedIn</a>
        </div>
        <hr />
        <p>Thanks again for trusting us,</p>
        <p>The Biziffy Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


// export const sendDownloadBillEmail = async (
//   plan: any,
//   businessName: string,
//   email: string,
//   message: string
// ): Promise<void> => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.MAIL_EMAIL_ID,
//       pass: process.env.MAIL_EMAIL_PASSWORD,
//     },
//   });

//   const pdfBuffer = await generatePDFBuffer(plan);

//   const mailOptions = {
//     from: `"Biziffy" <${process.env.MAIL_EMAIL_ID}>`,
//     to: email,
//     subject: `Biziffy - Your ${plan?.planDetails?.name} Plan is Being Processed`,
//     html: `
//       <div style="font-family: Arial, sans-serif;">
//         <h2 style="color: #007bff;">Hello ${businessName},</h2>
//         <p>🎉 Thank you for purchasing the <strong>${plan?.planDetails?.name}</strong> plan!</p>
//         <p>Your plan is being processed and will be activated shortly.</p>

//         ${message ? `<p><strong>Admin Message:</strong><br/>${message}</p>` : ""}

//         <p>If you have any questions, feel free to contact us at <a href="mailto:support@biziffy.com">support@biziffy.com</a>.</p>

//         <p>Regards,<br/>Biziffy Team</p>
//       </div>
//     `,
//     attachments: [
//       {
//         filename: `Invoice_${plan?.planDetails?.name}_${plan._id}.pdf`,
//         content: pdfBuffer,
//         contentType: 'application/pdf',
//       },
//     ],
//   };

//   await transporter.sendMail(mailOptions);
// };
