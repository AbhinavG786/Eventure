import admin from "firebase-admin";
import path from "path";
const serviceAccount = require(path.join(
  __dirname,
  "../../firebase/serviceAccountKey.json"
));

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
