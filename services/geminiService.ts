import { GoogleGenAI } from "@google/genai";
import { WORK_IDS, getPromptForId } from '../constants';
import { CategoryId } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCategoryBatch(
  base64Image: string,
  categoryId: CategoryId
): Promise<Record<string, string>> {
  
  // Determine targets
  let targetIds: string[] = [];
  if (categoryId === 'WORK') targetIds = WORK_IDS;
  
  if (targetIds.length === 0) throw new Error("No roles defined for this category");

  // Remove data URL prefix
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  // Helper function to generate a single role
  const generateSingleRole = async (id: string): Promise<{ id: string, data: string | null }> => {
    try {
      const prompt = getPromptForId(id);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg', // Assuming jpeg/png input is handled as standard image
                data: base64Data,
              },
            },
          ],
        },
      });

      const candidate = response.candidates?.[0];
      if (candidate && candidate.content && candidate.content.parts) {
        // Find the first image part
        const imagePart = candidate.content.parts.find(p => p.inlineData && p.inlineData.data);
        if (imagePart && imagePart.inlineData) {
           const mimeType = imagePart.inlineData.mimeType || 'image/png';
           return { 
             id, 
             data: `data:${mimeType};base64,${imagePart.inlineData.data}` 
           };
        }
      }
      console.warn(`No image generated for role: ${id}`);
      return { id, data: null };
      
    } catch (error) {
      console.error(`Error generating role ${id}:`, error);
      // We return null to allow other generations to succeed even if one fails
      return { id, data: null };
    }
  };

  // Execute all requests in parallel
  const promises = targetIds.map(id => generateSingleRole(id));
  const resultsArray = await Promise.all(promises);

  // Aggregate results
  const results: Record<string, string> = {};
  let successCount = 0;

  resultsArray.forEach(result => {
    if (result.data) {
      results[result.id] = result.data;
      successCount++;
    }
  });

  if (successCount === 0) {
    throw new Error("Failed to generate any images. Please try again.");
  }

  return results;
}