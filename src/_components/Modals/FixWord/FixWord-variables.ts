import { reactive, ref } from "vue";

export const cachedImages = reactive({
    value : Array<{docRef : string, page : number, offset: number, image: string }>(),
    add(value: { docRef : string, page : number, offset : number, image : string }) { this.value.push(value)},
    find(docRef : string, page : number, offset : number) {
        const result = this.value.filter(obj => obj.docRef === docRef && obj.page === page && obj.offset === offset)
        return (result.length) ? result[0] : undefined
    }
})

export const fixWordVisible = reactive({
    value: false,
    true() { this.value = true },
    false() { this.value = false },
    toggle() { this.value = !this.value }
})

export const fixWordOffset = reactive({
    value: 0,
    set(value: number) { this.value = value }
})

export const wordImage = reactive({
    value: '',
    set(value: string) { this.value = value }
})

export const word = ref<string>('')

export const wordOffset = reactive({
    value: 0,
    set(value: number) { this.value = value}
})

export const docRef = reactive({
    value: '',
    set(value: string) { this.value = value}
})