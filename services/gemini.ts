
import { GoogleGenAI } from "@google/genai";

// Standard initialization with an API key check
// We wrap it in a function to ensure it's evaluated when needed
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_PROMPT = `You are the Baji369 AI Assistant. Your goal is to help users with:
- Login issues (forgot password, account locked)
- Registration questions
- Promotion and bonus details
- General gaming inquiries on Baji369.

Be professional, helpful, and gaming-enthusiastic. If a user asks about something unrelated, politely steer them back to Baji369 support. Keep answers concise as they are displayed on a mobile screen.`;

export const startChat = () => {
  const ai = getAIInstance();
  if (!ai) {
    throw new Error("API_KEY_MISSING");
  }
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });
};
