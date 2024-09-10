import type { App } from 'vue'
import toolTipDirective from './ToolTip'

// register all directives
const directives = (app: App<Element>) => {
  toolTipDirective(app)
}

export default directives
