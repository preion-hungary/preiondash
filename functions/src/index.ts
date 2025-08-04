import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const SECONDS_TO_KEEP = 2592000; // 30 days in seconds

exports.trimSensorData = functions.database
  .ref("/sensors/{deviceId}/{timestamp}")
  .onCreate(async (snapshot, context) => {
    const { deviceId } = context.params;
    const parentRef = snapshot.ref.parent;

    if (parentRef) {
      const newReading = snapshot.val();
      if (!newReading || !newReading.timestamp) {
        console.log(`New reading for ${deviceId} has no timestamp, skipping trim.`);
        return;
      }
      const newTimestamp = newReading.timestamp;
      const cutoff = newTimestamp - (SECONDS_TO_KEEP * 1000);

      const oldReadingsQuery = parentRef.orderByChild('timestamp').endAt(cutoff);
      
      const oldReadingsSnapshot = await oldReadingsQuery.once("value");

      if (oldReadingsSnapshot.exists()) {
        const updates: { [key: string]: null } = {};
        let count = 0;
        oldReadingsSnapshot.forEach(child => {
          if (child.key) {
            updates[child.key] = null;
            count++;
          }
        });

        await parentRef.update(updates);
        console.log(`Trimmed ${count} old reading(s) for ${deviceId}.`);
      }
    }
  });
