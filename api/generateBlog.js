 // File: /api/generateBlog.js

// You need to have run: npm install @google/generative-ai
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- THE FIX IS HERE ---
// Use the standard, non-prefixed variable for the backend.
const apiKey = process.env.GEMINI_API_KEY;

// This is a crucial check. If the key is not set, the function will stop.
if (!apiKey) {
  throw new Error("The GEMINI_API_KEY environment variable is not configured on the server.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { title } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Write a short, engaging blog post about the following topic: "${title}". The tone should be informative and easy to read. Do not include a title in the response, just the body of the post.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return res.status(200).json({ content: text });

  } catch (error) {
    console.error('Error in generateBlog API:', error);
    return res.status(500).json({ error: 'Failed to generate content from the AI service.' });
  }
}