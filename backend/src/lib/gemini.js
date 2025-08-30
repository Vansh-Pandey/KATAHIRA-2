import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Initialize Gemini client once.
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a tutor response using Gemini.
 * @param {string} prompt - The prompt to send to Gemini.
 * @returns {Promise<string>} - The model's response text.
 */
export async function generateGeminiResponse(prompt) {
  try {
    // Use Gemini Pro (text generation model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    // Handle the response
    if (result?.response?.candidates?.length > 0) {
      return result.response.candidates[0].content.parts[0].text.trim();
    }

    console.warn("Gemini returned no candidates.");
    return "Hmm, I’m not sure how to respond. Could you try rephrasing?";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Sorry, I ran into an issue generating a response.";
  }
}
