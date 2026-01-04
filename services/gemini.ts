
import { GoogleGenAI } from "@google/genai";

// Standard initialization as per guidelines
// Using a fallback empty string to prevent constructor crash if process.env.API_KEY is briefly undefined
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const SYSTEM_PROMPT = `You are the Baji369 AI Assistant. Your goal is to help users with:
- Login issues (forgot password, account locked)
- Registration questions
- Promotion and bonus details
- General gaming inquiries on Baji369.

Be professional, helpful, and gaming-enthusiastic. If a user asks about something unrelated, politely steer them back to Baji369 support. Keep answers concise as they are displayed on a mobile screen.`;

export const createChatSession = () => {
  return ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [], // Initial state for chat can be handled by the caller or through generateContent
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });
};

// Re-implementing with proper chat interface if needed by AiSupportDrawer
export const startChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });
};
