import { db } from "../firebase.js";

// CREATE
export const createInquiry = async (req, res) => {
  try {
    await db.collection("inquiries").add({
      ...req.body,
      createdAt: new Date(),
    });

    res.json({ message: "Inquiry sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET FOR BUYER
export const getBuyerInquiries = async (req, res) => {
  try {
    const snapshot = await db
      .collection("inquiries")
      .where("buyerEmail", "==", req.params.email)
      .get();

    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET FOR SELLER
export const getSellerInquiries = async (req, res) => {
  try {
    const snapshot = await db
      .collection("inquiries")
      .where("sellerId", "==", req.params.email)
      .get();

    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
