import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStatusStore = defineStore('sidebarstatus', () => {
  const sidebarstatus = ref({
    collapsed: false,
    showText: true,
  })
  function toggleSidebarCollapse() {
    sidebarstatus.value.collapsed = !sidebarstatus.value.collapsed;
  }
  function toggleSidebarText() {
    sidebarstatus.value.showText = !sidebarstatus.value.showText;
  }

  return { sidebarstatus, toggleSidebarCollapse, toggleSidebarText }
})
