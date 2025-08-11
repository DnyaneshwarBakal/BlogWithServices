// File: server.js

import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Explicitly tell dotenv to load the .env.local file
dotenv.config({ path: './.env.local' });

const app = express();
const port = 3001;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("The GEMINI_API_KEY environment variable is not configured. Make sure it is set in your .env.local file.");
}
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/api/generateBlog', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    // ==========================================================
    // --- THIS IS THE FIX ---
    // Switched to the 'flash' model, which is faster and has a higher free tier rate limit.
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    // ==========================================================
    
    const prompt = `Write a short, engaging blog post about the following topic: "${title}". The tone should be informative and easy to read. Do not include a title in the response, just the body of the post.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return res.status(200).json({ content: text });
  } catch (error) {
    // This will catch errors from the Google AI API call itself, like the rate limit error.
    console.error('Error in generateBlog API:', error);
    // Send a more user-friendly error message back to the frontend
    const errorMessage = error.message.includes('quota') 
      ? 'You have made too many requests. Please wait a minute and try again.' 
      : 'Failed to generate content from the AI service.';
    return res.status(500).json({ error: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend server listening on http://localhost:${port}`);
});