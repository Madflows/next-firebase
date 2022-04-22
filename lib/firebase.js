import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAc62VNYjwq3QKahaR1PTYYPp65aod0zF8",
  authDomain: "dev-to-clone-eb417.firebaseapp.com",
  projectId: "dev-to-clone-eb417",
  storageBucket: "dev-to-clone-eb417.appspot.com",
  messagingSenderId: "206533167369",
  appId: "1:206533167369:web:c35444490bc3036bd72bd8",
  measurementId: "G-7XL9PFQEMB",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

/// Helper Functions

// Gets a users/{uid} document with the username
// @param {string} username
export const getUserWithUsername = async (username) => {
  const userDoc = await firestore
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get();
  return userDoc.docs[0];
};

export function postToJSON(post) {
  const data = post.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
