import type { ScrollbarInstance } from "element-plus"
import { ref, onMounted, onUnmounted } from "vue"




export const useHorScroll = () => {
  const scrollbarRef = ref<ScrollbarInstance>()
  let targetScrollLeft = 0
  let isAnimating = false
  const smoothScroll = (container) => {
    const current = container.scrollLeft
    const distance = targetScrollLeft - current

    // 线性插值（可根据需要替换为其他缓动函数）
    container.scrollLeft = current + distance * 0.3

    // 判断是否需要继续动画
    if (Math.abs(distance) > 0.5) {
      requestAnimationFrame(() => {
        smoothScroll(container)
      })
    } else {
      isAnimating = false
      container.scrollLeft = targetScrollLeft
    }
  }

  const onWheel = (e) => {
    e.preventDefault()
    const container = scrollbarRef.value.wrapRef

    const delta = e.deltaY * 1.5
    targetScrollLeft += delta

    // 限制边界
    targetScrollLeft = Math.max(0,
      Math.min(targetScrollLeft,
        container.scrollWidth - container.clientWidth + 3))

    // 触发动画
    if (!isAnimating) {
      isAnimating = true
      requestAnimationFrame(() => {
        smoothScroll(container)
      })
    }
  }

  onMounted(() => {
    scrollbarRef.value?.wrapRef?.addEventListener('wheel', onWheel)
  })

  onUnmounted(() => {
    scrollbarRef.value?.wrapRef?.removeEventListener('wheel', onWheel)
  })

  return {
    scrollbarRef
  }
}
