import { useState, useCallback } from 'react'
import { storageGet, storageSet, DEFAULT_STAPLES, DEFAULT_SETTINGS } from '../utils/storage.js'

/**
 * Central localStorage state hook.
 * All reads/writes to localStorage go through here.
 */
export function useStore() {
  const [settings, setSettingsState] = useState(() =>
    storageGet('settings', DEFAULT_SETTINGS)
  )

  const [todos, setTodosState] = useState(() =>
    storageGet('todos', [])
  )

  const [fridge, setFridgeState] = useState(() =>
    storageGet('fridge', DEFAULT_STAPLES)
  )

  const [schedule, setScheduleState] = useState(() =>
    storageGet('schedule', { weekStart: null, events: [], photoUrl: null })
  )

  const [dinnerHistory, setDinnerHistoryState] = useState(() =>
    storageGet('dinnerHistory', [])
  )

  // --- Settings ---
  const updateSettings = useCallback((patch) => {
    setSettingsState(prev => {
      const next = { ...prev, ...patch }
      storageSet('settings', next)
      return next
    })
  }, [])

  // --- Todos ---
  const addTodo = useCallback((text, deadline = null) => {
    const todo = {
      id: crypto.randomUUID(),
      text,
      deadline,
      done: false,
      createdAt: new Date().toISOString(),
    }
    setTodosState(prev => {
      const next = [todo, ...prev]
      storageSet('todos', next)
      return next
    })
    return todo
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodosState(prev => {
      const next = prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
      storageSet('todos', next)
      return next
    })
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodosState(prev => {
      const next = prev.filter(t => t.id !== id)
      storageSet('todos', next)
      return next
    })
  }, [])

  const updateTodo = useCallback((id, patch) => {
    setTodosState(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...patch } : t)
      storageSet('todos', next)
      return next
    })
  }, [])

  // --- Fridge ---
  const toggleFridgeItem = useCallback((id) => {
    setFridgeState(prev => {
      const next = prev.map(i => i.id === id ? { ...i, inFridge: !i.inFridge } : i)
      storageSet('fridge', next)
      return next
    })
  }, [])

  const addFridgeItem = useCallback((name) => {
    const item = {
      id: crypto.randomUUID(),
      name: name.toLowerCase().trim(),
      inFridge: true,
      isStaple: false,
    }
    setFridgeState(prev => {
      const next = [...prev, item]
      storageSet('fridge', next)
      return next
    })
    return item
  }, [])

  const removeFridgeItem = useCallback((id) => {
    setFridgeState(prev => {
      const next = prev.filter(i => i.id !== id)
      storageSet('fridge', next)
      return next
    })
  }, [])

  const updateFridgeItem = useCallback((id, patch) => {
    setFridgeState(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...patch } : i)
      storageSet('fridge', next)
      return next
    })
  }, [])

  // --- Schedule ---
  const updateSchedule = useCallback((patch) => {
    setScheduleState(prev => {
      const next = { ...prev, ...patch }
      storageSet('schedule', next)
      return next
    })
  }, [])

  const addScheduleEvent = useCallback((event) => {
    const newEvent = { ...event, id: crypto.randomUUID() }
    setScheduleState(prev => {
      const next = { ...prev, events: [...prev.events, newEvent] }
      storageSet('schedule', next)
      return next
    })
    return newEvent
  }, [])

  const removeScheduleEvent = useCallback((id) => {
    setScheduleState(prev => {
      const next = { ...prev, events: prev.events.filter(e => e.id !== id) }
      storageSet('schedule', next)
      return next
    })
  }, [])

  // --- Dinner History ---
  const saveDinnerItem = useCallback((item) => {
    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      ...item,
      saved: true,
    }
    setDinnerHistoryState(prev => {
      const next = [entry, ...prev].slice(0, 30) // keep last 30
      storageSet('dinnerHistory', next)
      return next
    })
    return entry
  }, [])

  const removeDinnerHistory = useCallback((id) => {
    setDinnerHistoryState(prev => {
      const next = prev.filter(d => d.id !== id)
      storageSet('dinnerHistory', next)
      return next
    })
  }, [])

  return {
    settings, updateSettings,
    todos, addTodo, toggleTodo, deleteTodo, updateTodo,
    fridge, toggleFridgeItem, addFridgeItem, removeFridgeItem, updateFridgeItem,
    schedule, updateSchedule, addScheduleEvent, removeScheduleEvent,
    dinnerHistory, saveDinnerItem, removeDinnerHistory,
  }
}
