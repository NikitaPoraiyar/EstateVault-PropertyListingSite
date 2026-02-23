import { db } from "./firebase.js";

async function test() {
  await db.collection("test").add({
    message: "Firebase connected!",
    time: new Date(),
  });

  console.log("Firebase working!");
}

test();
