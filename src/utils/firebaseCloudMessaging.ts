import admin from "firebase-admin";
import path from "path";
import fs from "fs";
const serviceAccountPath = require(path.join(
  __dirname,
  "../../firebase/serviceAccountKey.json"
));
// Check if the key file exists
if (!fs.existsSync(serviceAccountPath)) {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set");
  }

  const decoded = Buffer.from(base64, "base64").toString("utf-8");

  // Ensure directory exists
  fs.mkdirSync(path.dirname(serviceAccountPath), { recursive: true });

  // Write decoded content to the expected path
  fs.writeFileSync(serviceAccountPath, decoded);
}
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendBroadcastNotification = async (
  topic: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  const message: admin.messaging.Message = {
    topic,
    notification: {
      title,
      body,
    },
    data,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
