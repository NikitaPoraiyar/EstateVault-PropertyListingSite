import admin from "firebase-admin";
import fs from "fs";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase.js";

export const upload = multer({
  storage: multer.memoryStorage(),
});

// CREATE PROPERTY
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      price,
      city,
      address,
      bedrooms,
      bathrooms,
      area_sqft,
      description,
      sellerId,
      type
    } = req.body;

    const file = req.file;

    let imageUrl = "";

    // Upload image to S3 if exists
    if (file) {
      const fileName = `${uuidv4()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    const newProperty = {
      title,
      price,
      city,
      address,
      bedrooms,
      bathrooms,
      area_sqft,
      description,
      sellerId,
      type,
      imageUrl,
      createdAt: new Date(),
    };

    const docRef = await db.collection("properties").add(newProperty);

    res.status(201).json({
      id: docRef.id,
      ...newProperty,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PROPERTIES
export const getProperties = async (req, res) => {
  try {
    const snapshot = await db.collection("properties").get();

    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const similarity = JSON.parse(
  fs.readFileSync(new URL("../similarity.json", import.meta.url))
);

export const getSimilarProperties = async (req, res) => {
  try {
    const { id } = req.params;

    if (!similarity[id]) {
      return res.json([]);
    }

    const similarIds = similarity[id].slice(0, 25);

    let propertiesMap = {};

    // Firestore IN query batching
    for (let i = 0; i < similarIds.length; i += 10) {
      const batch = similarIds.slice(i, i + 10);

      const snapshot = await db
        .collection("properties")
        .where(admin.firestore.FieldPath.documentId(), "in", batch)
        .get();

      snapshot.docs.forEach(doc => {
        propertiesMap[doc.id] = {
          id: doc.id,
          ...doc.data()
        };
      });
    }

    // 🔥 Reorder according to similarity.json
    const orderedProperties = similarIds
      .map(pid => propertiesMap[pid])
      .filter(Boolean);

    res.json(orderedProperties);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("properties").doc(id).delete();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

