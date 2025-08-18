// File: /api/index.js

// --- Imports ---
import express from 'express';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: './.env.local' });

const app = express();
app.use(express.json());

// --- Firebase Admin SDK Initialization ---
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  throw new Error("FATAL ERROR: The FIREBASE_SERVICE_ACCOUNT_KEY is not configured correctly.");
}
const db = admin.firestore();


// --- Gemini AI Configuration ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("FATAL ERROR: The GEMINI_API_KEY is not configured.");
}
const genAI = new GoogleGenerativeAI(apiKey);


// ==========================================================
// ---                ALL YOUR API ROUTES                 ---
// ==========================================================
// Blog api logic
// Add this new route in your /api/index.js file

app.post('/api/generateBlog', async (req, res) => {
  try {
    const { title } = req.body; // 1. Expect a 'title' from the request

    if (!title) {
      return res.status(400).json({ error: 'A title is required to generate content.' });
    }

    // 2. Create a specific, simple prompt for the AI
    const prompt = `Write a blog post about the following topic: "${title}". The post should be engaging and well-structured.`;

    // 3. Call the AI model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(prompt);
    const blogContent = result.response.text();

    // 4. Send the generated content back to the client
    res.status(200).json({ content: blogContent });

  } catch (error) {
    console.error('Error in /api/generateBlog route:', error);
    res.status(500).json({ error: 'Failed to generate blog content from the AI service.' });
  }
});
// --- HDFCGPT Chat Route (DEFINITIVE CORRECT LOGIC) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, messages, conversationId } = req.body;

    if (!userId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'User ID and a messages array are required.' });
    }

    // --- AI LOGIC ---
    const latestUserMessage = messages[messages.length - 1].content;
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest', systemInstruction: { role: "system", parts: [{ text: "You are HDFCGPT..."}] } });
    const chat = model.startChat({ history: messages.slice(0, -1).map(m => ({ role: m.role, parts: [{ text: m.content }] })) });
    const result = await chat.sendMessage(latestUserMessage);
    const modelResponseText = result.response.text();
    const newUserMessage = { role: 'user', content: latestUserMessage };
    const newModelMessage = { role: 'model', content: modelResponseText };

    let docId = conversationId;

    if (docId) {
      // --- LOGIC FOR EXISTING CHAT: Only update messages, NOT the title ---
      const convRef = db.collection('conversations').doc(docId);
      await convRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(newUserMessage, newModelMessage)
      });
    } else {
      // --- LOGIC FOR NEW CHAT: Create document and set title ONLY here ---
      const newTitle = latestUserMessage.substring(0, 40) + (latestUserMessage.length > 40 ? "..." : "");
      const convRef = await db.collection('conversations').add({
        userId: userId,
        title: newTitle, // The title is set once and never touched again.
        createdAt: new Date().toISOString(),
        messages: [newUserMessage, newModelMessage]
      });
      docId = convRef.id;
    }

    res.status(200).json({ response: modelResponseText, conversationId: docId });

  } catch (error) {
    console.error('Error in /api/chat route:', error);
    if (error.toString().includes('429')) {
      return res.status(429).json({ error: "The AI is receiving too many requests. Please wait a moment and try again." });
    }
    res.status(500).json({ error: 'Failed to get a response from the AI service.' });
  }
});

// --- Delete All Conversations Route ---
app.delete('/api/conversations', async (req, res) => {
  // --- START OF ADDED LOGIC ---
  try {
    const { userId } = req.body;

    // 1. Validate that we received a userId
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required to delete conversations.' });
    }

    // 2. Query Firestore for all documents in the 'conversations' collection that match the userId
    const conversationsQuery = db.collection('conversations').where('userId', '==', userId);
    const querySnapshot = await conversationsQuery.get();

    // 3. If there are no documents, there's nothing to do, but it's a success.
    if (querySnapshot.empty) {
      return res.status(200).json({ message: 'No conversations found to delete.' });
    }

    // 4. Use a batch write to delete all the found documents efficiently
    const batch = db.batch();
    querySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 5. Commit the batch to execute all the delete operations
    await batch.commit();

    // 6. Send a success response back to the client
    res.status(200).json({ message: `Successfully deleted ${querySnapshot.size} conversations.` });

  } catch (error) {
    // 7. If anything goes wrong, log the error and send a server error response
    console.error('Error deleting conversations:', error);
    res.status(500).json({ error: 'An error occurred while deleting conversations.' });
  }
  // --- END OF ADDED LOGIC ---
});
app.delete('/api/conversations/:conversationId', async (req, res) => {
  try {
    // 1. Get the conversation ID from the URL parameters
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required.' });
    }

    // SECURITY NOTE: In a real-world app, you should verify the user's ID token here
    // and check that the document they are trying to delete actually belongs to them
    // before proceeding with the deletion.

    // 2. Get a reference to the specific document in Firestore
    const docRef = db.collection('conversations').doc(conversationId);

    // 3. Delete the document
    await docRef.delete();

    // 4. Send a success response
    res.status(200).json({ message: 'Conversation deleted successfully.' });

  } catch (error) {
    console.error(`Error deleting conversation ${req.params.conversationId}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the conversation.' });
  }
});


// ==========================================================
// ---          LOCAL DEVELOPMENT & VERCEL EXPORT         ---
// ==========================================================
export default app;

if (process.env.NODE_ENV !== 'production') {
  const port = 3001;
  app.listen(port, () => {
    console.log(`✅ API server ready on http://localhost:${port}`);
  });
}