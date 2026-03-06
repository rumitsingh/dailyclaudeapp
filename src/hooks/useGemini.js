import { useState, useCallback } from 'react'
import { useOnline } from './useOnline.js'
import { storageGet, storageSet } from '../utils/storage.js'
import {
  getQuoteFromGemini,
  getDinnerSuggestionsFromGemini,
  getEncouragementFromGemini,
} from '../utils/gemini.js'
import { getDailyQuote } from '../data/quotes.js'
import { getTimeBasedEncouragement } from '../data/encouragements.js'
import { matchRecipes } from '../data/recipes.js'

/**
 * Wraps all Gemini API calls with online check + offline fallback.
 */
export function useGemini(apiKey) {
  const isOnline = useOnline()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const canUseGemini = isOnline && Boolean(apiKey)

  // --- Daily Quote ---
  const fetchQuote = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10)
    const cached = storageGet('quoteCache', null)

    // Return cached if same day
    if (cached && cached.date === today) {
      return { data: cached, fromCache: true, offline: false }
    }

    if (!canUseGemini) {
      const fallback = getDailyQuote(today)
      return { data: { ...fallback, date: today }, fromCache: false, offline: true }
    }

    setLoading(true)
    setError(null)
    try {
      const quote = await getQuoteFromGemini(apiKey)
      const result = { ...quote, date: today }
      storageSet('quoteCache', result)
      return { data: result, fromCache: false, offline: false }
    } catch (err) {
      setError(err.message)
      const fallback = getDailyQuote(today)
      return { data: { ...fallback, date: today }, fromCache: false, offline: true }
    } finally {
      setLoading(false)
    }
  }, [apiKey, canUseGemini])

  // --- Dinner Suggestions ---
  const fetchDinnerSuggestions = useCallback(async (fridgeItems) => {
    const cacheKey = 'dinnerCache'
    const cached = storageGet(cacheKey, null)
    const now = Date.now()

    // Cache valid for 4 hours
    if (cached && (now - cached.timestamp) < 4 * 60 * 60 * 1000) {
      return { data: cached.suggestions, fromCache: true, offline: false }
    }

    if (!canUseGemini) {
      const matched = matchRecipes(fridgeItems)
      const fallback = matched.map(r => ({
        name: r.name,
        description: r.description,
        usedIngredients: r.matched,
        additionalNeeded: r.ingredients.filter(i => !r.matched.includes(i)),
        matchScore: r.score,
        matchText: `${r.matched.length}/${r.ingredients.length} ingredients`,
      }))
      return { data: fallback, fromCache: false, offline: true }
    }

    setLoading(true)
    setError(null)
    try {
      const suggestions = await getDinnerSuggestionsFromGemini(apiKey, fridgeItems)
      storageSet(cacheKey, { suggestions, timestamp: now })
      return { data: suggestions, fromCache: false, offline: false }
    } catch (err) {
      setError(err.message)
      const matched = matchRecipes(fridgeItems)
      const fallback = matched.map(r => ({
        name: r.name,
        description: r.description,
        usedIngredients: r.matched,
        additionalNeeded: r.ingredients.filter(i => !r.matched.includes(i)),
        matchScore: r.score,
        matchText: `${r.matched.length}/${r.ingredients.length} ingredients`,
      }))
      return { data: fallback, fromCache: false, offline: true }
    } finally {
      setLoading(false)
    }
  }, [apiKey, canUseGemini])

  // --- Encouragement ---
  const fetchEncouragement = useCallback(async () => {
    const hour = new Date().getHours()
    let timeOfDay = 'morning'
    if (hour >= 12 && hour < 17) timeOfDay = 'midday'
    else if (hour >= 17) timeOfDay = 'evening'

    if (!canUseGemini) {
      return { data: getTimeBasedEncouragement(hour), offline: true }
    }

    setLoading(true)
    setError(null)
    try {
      const msg = await getEncouragementFromGemini(apiKey, timeOfDay)
      return { data: msg, offline: false }
    } catch (err) {
      setError(err.message)
      return { data: getTimeBasedEncouragement(hour), offline: true }
    } finally {
      setLoading(false)
    }
  }, [apiKey, canUseGemini])

  return {
    loading,
    error,
    isOnline,
    canUseGemini,
    fetchQuote,
    fetchDinnerSuggestions,
    fetchEncouragement,
  }
}
