import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const SIDEBAR_KEY = 'sidebarstatus'

interface SidebarStatus {
  collapsed: boolean
  showText: boolean
}

export const useSidebarStatusStore = defineStore('sidebarstatus', () => {
  const sidebarstatus = ref<SidebarStatus>({
    collapsed: false,
    showText: true,
  })

  // Load from localStorage
  function loadFromLocalStorage() {
    if (typeof window === 'undefined') return

    const status = localStorage.getItem(SIDEBAR_KEY)
    if (!status) return

    try {
      Object.assign(sidebarstatus.value, JSON.parse(status))
    } catch (error) {
      console.error('Error parsing sidebar status:', error)
    }
  }

  // Toggle actions
  function toggleSidebarCollapse() {
    sidebarstatus.value.collapsed = !sidebarstatus.value.collapsed
  }

  function toggleSidebarText() {
    sidebarstatus.value.showText = !sidebarstatus.value.showText
  }

  // Persist automatically when state changes
  watch(
    sidebarstatus,
    (value) => {
      localStorage.setItem(SIDEBAR_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  // Initialize immediately
  loadFromLocalStorage()

  return {
    sidebarstatus,
    toggleSidebarCollapse,
    toggleSidebarText,
  }
})
