import { reactive, ref } from 'vue'

export const authorText = ref('')

export const searchAuthors = reactive({ 
    value: true,
    true() { this.value = true },
    false() { this.value = false }
})

export const authorList = reactive({
    value: Array<{ label : string, count : number }>(),
    add(value: { label : string, count : number }) { this.value.push(value) },
    del(value: string) { this.value = this.value.filter(item => item.label !== value)},
    reset() { this.value = [] }
})

export const authorDropdownItems = reactive({
    value: new Array<{ label : string, count : number }>(),
    add(value: { label: string, count: number }) { this.value.push(value) },
    replace(value : Array<{ label : string, count : number}>) { this.value = value },
    reset() { this.value = [] }
})

export const showFindAuthorDropdown = reactive({
    value: true,
    true() { this.value = true },
    false() { this.value = false }
})