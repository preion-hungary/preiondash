"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const SECONDS_TO_KEEP = 120;
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
            const updates = {};
            let count = 0;
            oldReadingsSnapshot.forEach(child => {
                updates[child.key] = null;
                count++;
            });
            await parentRef.update(updates);
            console.log(`Trimmed ${count} old reading(s) for ${deviceId}.`);
        }
    }
});
//# sourceMappingURL=index.js.map