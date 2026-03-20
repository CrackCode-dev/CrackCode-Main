// This function handles json fromat from gemini that safely

/*
Parse JSON safely, trying multiple formats Gemini might return
rawText - raw response text from Gemini
returns {object|null} - parsed JSON or null if parsing fails
 */
export const safeParseJSON = (rawText) => {
  // Try 1: Direct JSON parse (cleanest case)
  try {
    return JSON.parse(rawText);
  } catch {
    // Continue to next attempts
  }

  // Try 2: Extract from code block (```json ... ```)
  const jsonBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1]);
    } catch {
      // Continue to next attempt
    }
  }

  // Try 3: Extract first JSON object found in text
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Could not parse anything
    }
  }

  // All attempts failed
  return null;
};
