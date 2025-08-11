// File: /api/index.js

// --- Imports ---
// Use CommonJS 'require' syntax for a Node.js environment
const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- Initializations ---
dotenv.config();
const app = express();

// --- Middleware ---
// This is crucial for Express to be able to parse JSON bodies from POST requests
app.use(express.json());

// --- Gemini AI Configuration ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  // This will cause an error during deployment if the key is missing
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
// ---                VERCEL EXPORT                       ---
// ==========================================================
// This is the crucial part that replaces 'app.listen()'.
// It allows Vercel to take your Express app and run it as a serverless function.
module.exports = app;