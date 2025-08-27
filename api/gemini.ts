import { GoogleGenAI, Type } from "@google/genai";

// This function is a Vercel Serverless Function
// It runs on the server, not in the browser
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query, items } = request.body;
    
    if (!process.env.API_KEY) {
        return response.status(500).json({ error: 'API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `You are an expert deal finder for a campus marketplace. Below is a list of items available for sale in JSON format.

    Items:
    ${JSON.stringify(items.map(({ id, title, description, price, category, condition }) => ({ id, title, description, price, category, condition })))}
    
    The user is looking for: "${query}"
    
    Based on the user's request and the available items, determine the single best item for them. Consider the price, condition, and how well the title and description match the request.
    
    If no suitable item is found, respond with { "id": null }.`;

    const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    id: {
                        type: Type.STRING,
                        description: "The ID of the best matching item, or null if no match is found.",
                        nullable: true,
                    }
                }
            }
        }
    });
    
    const jsonString = geminiResponse.text.trim();
    const result = JSON.parse(jsonString);

    return response.status(200).json(result);

  } catch (error) {
    console.error("Error in serverless function:", error);
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}
