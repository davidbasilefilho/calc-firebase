import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const addUser = async () => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
