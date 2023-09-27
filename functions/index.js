const functions = require("firebase-functions");
const fetch = require("node-fetch");

const cors = require("cors")({origin: true});

exports.fetchDocument = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const docId = req.query.docId; // The document ID or path

      // Construct the URL to fetch the document from Firebase Storage
      const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/documents%2F${docId}?alt=media`;

      const response = await fetch(storageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const text = await response.text();
      res.send(text);
    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to fetch document");
    }
  });
});
