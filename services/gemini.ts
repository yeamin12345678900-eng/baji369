
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the Baji369 AI Assistant. Your goal is to help users with:
- Login issues (forgot password, account locked)
- Registration questions
- Promotion and bonus details
- General gaming inquiries on Baji369.

Be professional, helpful, and gaming-enthusiastic. If a user asks about something unrelated, politely steer them back to Baji369 support. Keep answers concise as they are displayed on a mobile screen.`;

export const startChat = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });
};
