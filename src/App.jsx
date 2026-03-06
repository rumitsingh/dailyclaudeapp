import { useState, createContext, useContext } from 'react'
import { useStore } from './hooks/useStore.js'
import { useNotifications } from './hooks/useNotifications.js'
import { useOnline } from './hooks/useOnline.js'

import BottomNav from './components/BottomNav.jsx'
import Banner from './components/Banner.jsx'

import Home     from './pages/Home.jsx'
import Todos    from './pages/Todos.jsx'
import Dinner   from './pages/Dinner.jsx'
import Schedule from './pages/Schedule.jsx'
import Settings from './pages/Settings.jsx'

// Global app context
export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const isOnline = useOnline()

  const store = useStore()
  const notifications = useNotifications(store.todos)

  const navigate = (tab) => setActiveTab(tab)

  const renderPage = () => {
    const key = activeTab
    switch (activeTab) {
      case 'home':
        return (
          <Home
            todos={store.todos}
            settings={store.settings}
            dinnerHistory={store.dinnerHistory}
            onNavigate={navigate}
          />
        )
      case 'todos':
        return (
          <Todos
            todos={store.todos}
            addTodo={store.addTodo}
            toggleTodo={store.toggleTodo}
            deleteTodo={store.deleteTodo}
            updateTodo={store.updateTodo}
          />
        )
      case 'dinner':
        return (
          <Dinner
            fridge={store.fridge}
            toggleFridgeItem={store.toggleFridgeItem}
            addFridgeItem={store.addFridgeItem}
            removeFridgeItem={store.removeFridgeItem}
            saveDinnerItem={store.saveDinnerItem}
            settings={store.settings}
          />
        )
      case 'schedule':
        return (
          <Schedule
            schedule={store.schedule}
            updateSchedule={store.updateSchedule}
            addScheduleEvent={store.addScheduleEvent}
            removeScheduleEvent={store.removeScheduleEvent}
          />
        )
      case 'settings':
        return (
          <Settings
            settings={store.settings}
            updateSettings={store.updateSettings}
            fridge={store.fridge}
            addFridgeItem={store.addFridgeItem}
            removeFridgeItem={store.removeFridgeItem}
            updateFridgeItem={store.updateFridgeItem}
            notifications={notifications}
          />
        )
      default:
        return null
    }
  }

  return (
    <AppContext.Provider value={{ store, notifications, isOnline, navigate }}>
      {/* In-app notification banners */}
      <Banner banners={notifications.banners} onDismiss={notifications.dismissBanner} />

      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-mist-warm text-white text-center text-[11px] font-inter py-1 safe-top">
          Offline — using cached content
        </div>
      )}

      {/* Main scrollable content area */}
      <main
        className="overflow-y-auto px-4 pb-24"
        style={{
          minHeight: '100dvh',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)',
        }}
      >
        <div key={activeTab} className="page-enter max-w-lg mx-auto py-2">
          {renderPage()}
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </AppContext.Provider>
  )
}
