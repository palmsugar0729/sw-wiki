<template>
  <div v-if="visible" class="image-viewer" @click.self="close">
    <button class="nav left" @click.stop="prev">‹</button>

    <transition :name="transitionName">
      <img :key="currentIndex" :src="images[currentIndex]" class="image" />
    </transition>

    <button class="nav right" @click.stop="next">›</button>
    <div class="close-btn" @click="close">×</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    images: string[]
    modelValue: boolean
    initialIndex?: number
  }>(),
  { initialIndex: 0 },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = ref(props.modelValue)
const currentIndex = ref(props.initialIndex)
const transitionName = ref<'slide-left' | 'slide-right'>('slide-left')

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    currentIndex.value = props.initialIndex
  }
})

watch(visible, (val) => {
  if (!val) emit('update:modelValue', false)
})

const close = () => {
  visible.value = false
}

const next = () => {
  transitionName.value = 'slide-left'
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  transitionName.value = 'slide-right'
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length
}

/* 键盘支持 */
const handleKey = (e: KeyboardEvent) => {
  if (!visible.value) return
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))
</script>

<style scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.image {
  max-width: 85%;
  max-height: 85%;
  border-radius: 8px;
  position: absolute;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.left {
  left: 30px;
}

.right {
  right: 30px;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 40px;
  color: #fff;
  cursor: pointer;
}

/* 轮播动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
