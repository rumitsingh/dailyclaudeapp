// Typed localStorage helpers

const PREFIX = 'daily_'

export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage write failed:', e)
  }
}

export function storageRemove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // ignore
  }
}

// Default fridge staples
export const DEFAULT_STAPLES = [
  { id: 's1',  name: 'eggs',         inFridge: true,  isStaple: true },
  { id: 's2',  name: 'olive oil',    inFridge: true,  isStaple: true },
  { id: 's3',  name: 'garlic',       inFridge: true,  isStaple: true },
  { id: 's4',  name: 'onion',        inFridge: true,  isStaple: true },
  { id: 's5',  name: 'salt',         inFridge: true,  isStaple: true },
  { id: 's6',  name: 'pepper',       inFridge: true,  isStaple: true },
  { id: 's7',  name: 'butter',       inFridge: true,  isStaple: true },
  { id: 's8',  name: 'pasta',        inFridge: true,  isStaple: true },
  { id: 's9',  name: 'rice',         inFridge: true,  isStaple: true },
  { id: 's10', name: 'soy sauce',    inFridge: true,  isStaple: true },
]

export const DEFAULT_SETTINGS = {
  geminiKey: '',
  workoutTime: '19:00',
  notificationsEnabled: false,
}
