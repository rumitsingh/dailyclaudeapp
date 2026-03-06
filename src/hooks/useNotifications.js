import { useState, useEffect, useCallback } from 'react'
import { checkMissedNotifications, checkTodoDeadlines } from '../utils/notify.js'
import { storageSet, storageGet } from '../utils/storage.js'

/**
 * Manages notification permissions and in-app banner queue.
 */
export function useNotifications(todos = []) {
  const [permission, setPermission] = useState(() => {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission
  })

  const [banners, setBanners] = useState([])

  // Check missed notifications on mount
  useEffect(() => {
    const missed = checkMissedNotifications()
    const dueTodos = checkTodoDeadlines(todos)

    const newBanners = []

    // Add missed scheduled notifications
    for (const notif of missed) {
      newBanners.push({
        id: crypto.randomUUID(),
        type: notif.type,
        message: notif.message,
      })
    }

    // Add overdue todo banners (max 3)
    const overdue = dueTodos.filter(t => t.deadline < new Date().toISOString().slice(0, 10))
    if (overdue.length > 0) {
      newBanners.push({
        id: crypto.randomUUID(),
        type: 'todos',
        message: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}.`,
      })
    }

    if (newBanners.length > 0) {
      setBanners(newBanners)
    }

    // Track last open time
    storageSet('lastOpen', Date.now())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setPermission('unsupported')
      return 'unsupported'
    }
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  const dismissBanner = useCallback((id) => {
    setBanners(prev => prev.filter(b => b.id !== id))
  }, [])

  const addBanner = useCallback((message, type = 'info') => {
    setBanners(prev => [
      ...prev,
      { id: crypto.randomUUID(), type, message }
    ])
  }, [])

  return {
    permission,
    requestPermission,
    banners,
    dismissBanner,
    addBanner,
  }
}
