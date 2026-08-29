import dotenv from "dotenv";
dotenv.config();

const CATEGORIES = ["Road", "Water", "Electricity", "Sanitation", "Public Safety", "Other"];

async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key") {
    return null;
  }
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function categorizeIssue(title, description) {
  const prompt = `Categorize this civic issue into one of: [${CATEGORIES.join(", ")}].
Title: ${title}
Description: ${description}
Reply with only the category name.`;

  const response = await callGemini(prompt);
  if (!response) {
    // fallback: keyword match
    const text = (title + " " + description).toLowerCase();
    if (text.includes("road") || text.includes("pothole")) return "Road";
    if (text.includes("water")) return "Water";
    if (text.includes("electric") || text.includes("light")) return "Electricity";
    if (text.includes("garbage") || text.includes("sanit")) return "Sanitation";
    if (text.includes("safety") || text.includes("crime")) return "Public Safety";
    return "Other";
  }
  return response;
}

export async function summarizeIssue(title, description) {
  const prompt = `Summarize this civic issue in one concise sentence.
Title: ${title}
Description: ${description}`;

  const response = await callGemini(prompt);
  return response || `${title} reported in the area.`;
}
