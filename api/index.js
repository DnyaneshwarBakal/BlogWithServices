 // File: /api/index.js

// --- Imports ---
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- THIS IS THE CRITICAL FIX ---
// Explicitly tell dotenv which file to load for local development.
dotenv.config({ path: './.env.local' });

const app = express();

// --- Middleware ---
app.use(express.json());

// --- Gemini AI Configuration ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  // This check will now pass because dotenv has loaded the key.
  throw new Error("FATAL ERROR: The GEMINI_API_KEY environment variable is not configured.");
}
const genAI = new GoogleGenerativeAI(apiKey);


// ==========================================================
// ---                YOUR API ROUTE                      ---
// ==========================================================

// --- Blog Generation Route ---
app.post('/api/generateBlog', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `Write a short, engaging blog post about the following topic: "${title}". The tone should be informative and easy to read. Do not include a title in the response, just the body of the post.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return res.status(200).json({ content: text });
  } catch (error) {
    console.error('Error in /api/generateBlog route:', error);
    const errorMessage = error.message.includes('quota') 
      ? 'You have made too many requests. Please wait a minute and try again.' 
      : 'Failed to generate content from the AI service.';
    return res.status(500).json({ error: errorMessage });
  }
});


// ==========================================================
// ---          LOCAL DEVELOPMENT & VERCEL EXPORT         ---
// ==========================================================

// This line is used by Vercel to run the file as a serverless function
export default app;

// This block is for local development only. It will be ignored by Vercel.
if (process.env.NODE_ENV !== 'production') {
  const port = 3001;
  app.listen(port, () => {
    console.log(`✅ API server ready on http://localhost:${port}`);
  });
}