import { createPopover } from './popover.js'

interface TooltipOptions {
    trigger: HTMLElement
    text: string
}

export const createTooltip = (options: TooltipOptions) => {
    const { trigger, text } = options
    const tooltip = document.createElement('div')
    tooltip.className = 'tt-tooltip'
    console.log('trigger', trigger);
    tooltip.innerHTML = `<div>${text}</div>`

    createPopover({
        trigger,
        content: tooltip,
        triggerMode: 'hover',
        placement: 'top',
        align: 'center'
    })
}
