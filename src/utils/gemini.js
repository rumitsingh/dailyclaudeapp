import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Get a motivational quote from Gemini.
 */
export async function getQuoteFromGemini(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `Give me one short, meaningful motivational quote for today.
Format your response as JSON exactly like this:
{"text": "the quote here", "author": "Author Name"}
Just the JSON, nothing else.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid response format')
  return JSON.parse(jsonMatch[0])
}

/**
 * Get dinner suggestions based on fridge items.
 */
export async function getDinnerSuggestionsFromGemini(apiKey, fridgeItems) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const itemsList = fridgeItems.join(', ')
  const prompt = `I have these ingredients: ${itemsList}

Suggest 3 dinner recipes I can make. For each recipe, respond with JSON:
[
  {
    "name": "Recipe Name",
    "description": "One sentence description of the dish",
    "usedIngredients": ["ingredient1", "ingredient2"],
    "additionalNeeded": ["any ingredient not in my list"]
  }
]
Just the JSON array, nothing else.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Invalid response format')
  return JSON.parse(jsonMatch[0])
}

/**
 * Get a time-appropriate encouragement from Gemini.
 */
export async function getEncouragementFromGemini(apiKey, timeOfDay = 'morning') {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `Write a short, warm ${timeOfDay} encouragement message (1-2 sentences max).
Be genuine and uplifting. No hashtags, no emojis. Just the message text.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
