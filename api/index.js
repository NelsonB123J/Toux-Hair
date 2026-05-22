import express from "express";
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDeg51XonQUKuq72ojOdEAelF_Qljxdw5k",
  authDomain: "web-builder-test.firebaseapp.com",
  databaseURL: "https://web-builder-test-default-rtdb.firebaseio.com",
  projectId: "web-builder-test",
  storageBucket: "web-builder-test.firebasestorage.app",
  messagingSenderId: "727232763731",
  appId: "1:727232763731:web:e83fc59695a72c6e98b3a6",
};

// Prevent re-initializing Firebase on hot reloads (serverless environment)
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(firebaseApp);

const app = express();

app.get("*", async (req, res) => {
  try {
    const snapshot = await get(ref(db, "pages/user_site_01/htmlCode"));

    if (!snapshot.exists()) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Not Found</title></head>
          <body style="font-family:sans-serif;text-align:center;padding:60px;">
            <h1>404 — Page Not Found</h1>
            <p>No HTML content found in the database.</p>
          </body>
        </html>
      `);
    }

    const html = snapshot.val();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("Firebase fetch error:", err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Error</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:60px;">
          <h1>500 — Server Error</h1>
          <p>Something went wrong while loading the page.</p>
        </body>
      </html>
    `);
  }
});

export default app;
