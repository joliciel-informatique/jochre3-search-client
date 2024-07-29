import { ref } from "vue";

export let locale = 'en'
export const setLocale = (value: string) => (locale = value)
export const ltr: string = locale === 'yi' ? 'ltr' : ''

export const hasSearch = ref(false)
export const isBusy = ref(false)

export const showErrorNotification = ref(false)