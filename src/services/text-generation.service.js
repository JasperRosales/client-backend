import { GoogleGenAI } from '@google/genai';
import config from '../config/env.js';

const ai = new GoogleGenAI({ apiKey: config.gemini.apiKey });

export const sendMessageToGemini = async (message, history = []) => {
  try {
    const contents = [];

    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: config.gemini.model,
      contents: contents,
      config: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1000,
      },
    });

    if (response.text) {
      return {
        success: true,
        response: response.text,
      };
    } else {
      return {
        success: false,
        error: 'No response text from Gemini',
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate response',
    };
  }
};

