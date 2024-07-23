import { reactive, ref } from "vue"

export const FixMetaDataVisible = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false }
})

export const FixMetaDataDocRef = reactive({
    value: '',
    set(value: string) { this.value = value }
})

export const FixMetaDataField = reactive({
    value: '',
    set(value: string) { this.value = value },
    capital(): string { 
        return this.value.charAt(0).toUpperCase() + this.value.slice(1)
    }
})

export const FixMetaDataValue = ref<string>('')

export const isLeftToRight = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false }
})