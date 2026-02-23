import { db } from "../firebase.js";

export const rateProperty = async (req, res) => {
    try {
        const { userId, propertyId, rating } = req.body;

        if (![1, -1].includes(rating)) {
            return res.status(400).json({ message: "Invalid rating" });
        }

        // Check existing rating
        const snapshot = await db
            .collection("ratings")
            .where("userId", "==", userId)
            .where("propertyId", "==", propertyId)
            .get();

        // If exists → update
        if (!snapshot.empty) {
            const docId = snapshot.docs[0].id;

            await db.collection("ratings").doc(docId).update({ rating, });

            return res.json({ message: "Rating updated" });
        }

        // Else → create new
        await db.collection("ratings").add({
        userId,
        propertyId,
        rating,
        createdAt: new Date(),
        });

        res.json({ message: "Rating saved" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPropertyRatings = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const snapshot = await db
        .collection("ratings")
        .where("propertyId", "==", propertyId)
        .get();

        let likes = 0;
        let dislikes = 0;

        snapshot.forEach((doc) => {
        if (doc.data().rating === 1) likes++;
        if (doc.data().rating === -1) dislikes++;
        });

        res.json({ likes, dislikes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};