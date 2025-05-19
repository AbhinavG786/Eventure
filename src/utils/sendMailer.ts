import transporter from "./nodemailer";
import { generateEmailTemplate } from "./emailTemplate";
import redisClient from "./redis";

class SendMailer {
  sendVerificationEmail = async (email: string, token: string) => {
    const options = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: generateEmailTemplate("verification", token),
    };
    try {
      const info = await transporter.sendMail(options);
      return info;
    } catch (err) {
      console.error("Error sending email:", err);
      throw new Error("Failed to send email");
    }
  };

}

export default new SendMailer();
