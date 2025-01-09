import { defineStore } from 'pinia'

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: [],
  }),
  
  actions: {
    addItem(item) {
      this.items.unshift(item)
      this.saveToLocalStorage()
    },
    
    removeItem(index) {
      this.items.splice(index, 1)
      this.saveToLocalStorage()
    },
    
    loadFromLocalStorage() {
      const savedItems = localStorage.getItem('wonderfulItems')
      if (savedItems) {
        this.items = JSON.parse(savedItems)
      }
    },
    
    saveToLocalStorage() {
      localStorage.setItem('wonderfulItems', JSON.stringify(this.items))
    }
  }
})
