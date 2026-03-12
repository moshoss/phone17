import {
  Popover,
  createPopover,
  type PopoverAlign,
  type PopoverOptions,
  type PopoverPlacement,
} from './popover.js';

export interface TooltipOptions {
  trigger: HTMLElement;
  content?: HTMLElement;
  text?: string;
  placement?: PopoverPlacement;
  align?: PopoverAlign;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  initialOpen?: boolean;
  interactive?: boolean;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

interface AttributeSnapshot {
  describedBy: string | null;
}

interface StyleSnapshot {
  pointerEvents: string;
  maxWidth: string;
  padding: string;
  borderRadius: string;
  background: string;
  color: string;
  fontSize: string;
  lineHeight: string;
  boxShadow: string;
}

interface ResolvedContent {
  element: HTMLElement;
  generated: boolean;
}

const DEFAULT_CLASS_NAME = 'tooltip-content';

function restoreAttribute(element: HTMLElement, name: string, value: string | null): void {
  if (value === null) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
}

function restoreStyle(style: CSSStyleDeclaration, name: keyof StyleSnapshot, value: string): void {
  style[name] = value;
}

function resolveContent(options: TooltipOptions): ResolvedContent {
  if (options.content) {
    return {
      element: options.content,
      generated: false,
    };
  }

  if (typeof options.text === 'string') {
    const element = document.createElement('div');
    element.textContent = options.text;

    return {
      element,
      generated: true,
    };
  }

  throw new Error('Tooltip requires either `content` or `text`.');
}

function buildPopoverOptions(options: TooltipOptions, content: HTMLElement): PopoverOptions {
  return {
    trigger: options.trigger,
    content,
    placement: options.placement ?? 'top',
    align: options.align ?? 'center',
    triggerMode: 'hover',
    offset: options.offset ?? 10,
    openDelay: options.openDelay ?? 120,
    closeDelay: options.closeDelay ?? 80,
    closeOnOutsideClick: false,
    closeOnEscape: true,
    matchTriggerWidth: false,
    initialOpen: options.initialOpen ?? false,
  };
}

export class Tooltip {
  private readonly trigger: HTMLElement;
  private readonly content: HTMLElement;
  private readonly popover: Popover;
  private readonly interactive: boolean;
  private readonly generatedContent: boolean;
  private readonly addedClassName?: string;
  private readonly originalAttributes: AttributeSnapshot;
  private readonly originalStyles: StyleSnapshot;

  private readonly handleTriggerFocusIn = (): void => {
    this.open();
  };

  private readonly handleTriggerFocusOut = (event: FocusEvent): void => {
    if (this.isMovingWithinTooltip(event.relatedTarget)) {
      return;
    }

    this.close();
  };

  private readonly handleContentFocusIn = (): void => {
    this.open();
  };

  private readonly handleContentFocusOut = (event: FocusEvent): void => {
    if (this.isMovingWithinTooltip(event.relatedTarget)) {
      return;
    }

    this.close();
  };

  constructor(options: TooltipOptions) {
    const { element, generated } = resolveContent(options);

    this.trigger = options.trigger;
    this.content = element;
    this.generatedContent = generated;
    this.interactive = options.interactive ?? false;
    this.addedClassName = options.className;
    this.originalAttributes = {
      describedBy: this.trigger.getAttribute('aria-describedby'),
    };
    this.originalStyles = {
      pointerEvents: this.content.style.pointerEvents,
      maxWidth: this.content.style.maxWidth,
      padding: this.content.style.padding,
      borderRadius: this.content.style.borderRadius,
      background: this.content.style.background,
      color: this.content.style.color,
      fontSize: this.content.style.fontSize,
      lineHeight: this.content.style.lineHeight,
      boxShadow: this.content.style.boxShadow,
    };

    this.decorateContent();

    this.popover = createPopover({
      ...buildPopoverOptions(options, this.content),
      onOpen: () => {
        this.applyTooltipSemantics();
        options.onOpen?.();
      },
      onClose: () => {
        this.applyTooltipSemantics();
        options.onClose?.();
      },
    });

    this.bindFocusEvents();
    this.applyTooltipSemantics();
  }

  get openState(): boolean {
    return this.popover.openState;
  }

  get contentElement(): HTMLElement {
    return this.content;
  }

  open(): void {
    this.popover.open();
    this.applyTooltipSemantics();
  }

  close(): void {
    this.popover.close();
    this.applyTooltipSemantics();
  }

  toggle(force?: boolean): void {
    this.popover.toggle(force);
    this.applyTooltipSemantics();
  }

  position(): void {
    this.popover.position();
  }

  destroy(): void {
    this.unbindFocusEvents();
    this.popover.destroy();

    restoreAttribute(this.trigger, 'aria-describedby', this.originalAttributes.describedBy);

    restoreStyle(this.content.style, 'pointerEvents', this.originalStyles.pointerEvents);
    restoreStyle(this.content.style, 'maxWidth', this.originalStyles.maxWidth);
    restoreStyle(this.content.style, 'padding', this.originalStyles.padding);
    restoreStyle(this.content.style, 'borderRadius', this.originalStyles.borderRadius);
    restoreStyle(this.content.style, 'background', this.originalStyles.background);
    restoreStyle(this.content.style, 'color', this.originalStyles.color);
    restoreStyle(this.content.style, 'fontSize', this.originalStyles.fontSize);
    restoreStyle(this.content.style, 'lineHeight', this.originalStyles.lineHeight);
    restoreStyle(this.content.style, 'boxShadow', this.originalStyles.boxShadow);

    this.content.classList.remove(DEFAULT_CLASS_NAME);

    if (this.addedClassName) {
      this.content.classList.remove(this.addedClassName);
    }

    if (this.generatedContent) {
      this.content.remove();
    }
  }

  private decorateContent(): void {
    this.content.classList.add(DEFAULT_CLASS_NAME);

    if (this.addedClassName) {
      this.content.classList.add(this.addedClassName);
    }

    this.content.setAttribute('role', 'tooltip');

    if (!this.interactive) {
      this.content.style.pointerEvents = 'none';
    }

    if (!this.content.style.maxWidth) {
      this.content.style.maxWidth = '240px';
    }

    if (!this.content.style.padding) {
      this.content.style.padding = '6px 10px';
    }

    if (!this.content.style.borderRadius) {
      this.content.style.borderRadius = '8px';
    }

    if (!this.content.style.background) {
      this.content.style.background = 'rgba(15, 23, 42, 0.96)';
    }

    if (!this.content.style.color) {
      this.content.style.color = '#ffffff';
    }

    if (!this.content.style.fontSize) {
      this.content.style.fontSize = '12px';
    }

    if (!this.content.style.lineHeight) {
      this.content.style.lineHeight = '1.45';
    }

    if (!this.content.style.boxShadow) {
      this.content.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.22)';
    }
  }

  private bindFocusEvents(): void {
    this.trigger.addEventListener('focusin', this.handleTriggerFocusIn);
    this.trigger.addEventListener('focusout', this.handleTriggerFocusOut);
    this.content.addEventListener('focusin', this.handleContentFocusIn);
    this.content.addEventListener('focusout', this.handleContentFocusOut);
  }

  private unbindFocusEvents(): void {
    this.trigger.removeEventListener('focusin', this.handleTriggerFocusIn);
    this.trigger.removeEventListener('focusout', this.handleTriggerFocusOut);
    this.content.removeEventListener('focusin', this.handleContentFocusIn);
    this.content.removeEventListener('focusout', this.handleContentFocusOut);
  }

  private applyTooltipSemantics(): void {
    this.content.setAttribute('role', 'tooltip');
    this.trigger.setAttribute('aria-describedby', this.content.id);
    this.trigger.removeAttribute('aria-haspopup');
    this.trigger.removeAttribute('aria-controls');
    this.trigger.removeAttribute('aria-expanded');
  }

  private isMovingWithinTooltip(nextTarget: EventTarget | null): boolean {
    if (!(nextTarget instanceof Node)) {
      return false;
    }

    return this.trigger.contains(nextTarget) || this.content.contains(nextTarget);
  }
}

export function createTooltip(options: TooltipOptions): Tooltip {
  return new Tooltip(options);
}
