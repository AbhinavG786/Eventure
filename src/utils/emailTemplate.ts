type TemplateType = "verification" | "registration" | "passwordReset";
export const generateEmailTemplate = (type: TemplateType, token: string) => {
  const templates = {
    verification: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        padding: 20px;
      }
      .container {
        max-width: 500px;
        margin: auto;
        background: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        background: #f0f0f0;
        padding: 10px 20px;
        display: inline-block;
        margin-top: 20px;
        border-radius: 5px;
        letter-spacing: 3px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Verify Your Email Address</h2>
      <p>Use the OTP below to complete your sign-up process.</p>
      <div class="otp">${token}</div>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <div class="footer">
        &copy; Eventure | Bringing campus events to your fingertips.
      </div>
    </div>
  </body>
</html>
`,
    registration: ``,
   passwordReset: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        padding: 30px;
      }
      h2 {
        color: #333333;
      }
      p {
        color: #555555;
        line-height: 1.5;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>
        We received a request to reset your password. Click the button below to
        choose a new password. This link is valid for 5 minutes.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
        <tr>
          <td align="center" bgcolor="#007bff" style="border-radius: 5px;">
            <a href="${token}" target="_blank" style="display: inline-block; padding: 12px 20px; font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </td>
        </tr>
      </table>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <div class="footer">
        <p>&copy; Eventure. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
  };
  return templates[type];
};
