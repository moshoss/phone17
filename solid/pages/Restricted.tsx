import type { Component, JSX } from 'solid-js'

export interface RestrictedProps {
  icon?: JSX.Element
  title?: string
  reason?: string
  buttonText?: string
  onAction?: () => void
}

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="size-16 text-muted-foreground"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const Restricted: Component<RestrictedProps> = (props) => {
  return (
    <div class="flex min-h-[60vh] items-center justify-center">
      <div class="flex flex-col items-center gap-4 text-center">
        {props.icon ?? <LockIcon />}
        <h2 class="text-xl font-semibold text-foreground">
          {props.title ?? '功能暂不可用'}
        </h2>
        <p class="max-w-sm text-sm text-muted-foreground">
          {props.reason ?? '您没有权限访问此功能，请联系管理员获取相应权限。'}
        </p>
        <button
          class="mt-2 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          onClick={props.onAction}
        >
          {props.buttonText ?? '返回首页'}
        </button>
      </div>
    </div>
  )
}

export default Restricted
