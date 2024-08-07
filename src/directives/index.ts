import type { App } from 'vue'
import toolTipDirective from './ToolTip'
// import { modalOpen, modalClose } from './VModal'

// register all directives
const directives = (app: App<Element>) => {
  toolTipDirective(app)
  // modalOpen(app)
  // modalClose(app)
}

export default directives
