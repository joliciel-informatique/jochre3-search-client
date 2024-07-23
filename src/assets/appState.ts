import { reactive } from "vue";

export let locale = 'en'
export const setLocale = (value: string) => (locale = value)
export const ltr: string = locale === 'yi' ? 'ltr' : ''

export const hasSearch = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false }
})

export const isBusy = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false }
})

export const showErrorNotification = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false }
})

export const showAdvancedSearchPanel = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false },
    toggle() { this.value = !this.value }
})