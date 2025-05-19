type TemplateType = "verification" | "registration";
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
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <div class="footer">
        &copy; Eventure | Bringing campus events to your fingertips.
      </div>
    </div>
  </body>
</html>
`,
    registration: ``,
  };
  return templates[type];
};
