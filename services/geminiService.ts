import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const draftTextWithAI = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const systemInstruction = `
      You are a helpful writing assistant. 
      Your goal is to write natural, human-sounding text based on the user's request. 
      The text will be used to generate a handwritten note.
      Keep the output concise (under 200 words) unless requested otherwise.
      Do not include markdown formatting (like **bold** or *italics*) as the handwriting engine cannot render them.
      Just return the raw text body.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate text. Please check your API key.");
  }
};
