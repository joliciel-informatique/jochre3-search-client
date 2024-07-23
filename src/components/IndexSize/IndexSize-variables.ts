import { reactive} from "vue"

export const indexSize = reactive({
    value: 0,
    set(value : number) { this.value = value }
})