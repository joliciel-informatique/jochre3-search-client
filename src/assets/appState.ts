import { ref } from 'vue'

export let locale = 'en'
export const setLocale = (value: string) => (locale = value)

export const hasSearch = ref(false)
export const isBusy = ref(false)
