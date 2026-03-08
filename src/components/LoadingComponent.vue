<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Transition>
    <div class="root" v-if="show">
      <div class="loading">
        <div v-for="n in 5" :key="n"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@reference '@/assets/base.css';

.root {
  @apply left-0 right-0 top-0 bottom-0 absolute rounded-md bg-white;
  background-color: rgba(255,255,255,0.9);
}
.loading {
  @apply flex items-center justify-center h-full gap-1.5;
}
.loading div {
  @apply w-1 h-8 max-h-7/10 bg-gray-600 rounded-full;
  animation: scale 0.9s ease-in-out infinite;
  background-color: #84828F;
}
.loading div:nth-child(2) {
  animation-delay: -0.8s;
  background-color: #6A687A;
}
.loading div:nth-child(3) {
  animation-delay: -0.7s;
  background-color: #536271;
}
.loading div:nth-child(4) {
  animation-delay: -0.6s;
  background-color: #3E4C5E;
}
.loading div:nth-child(5) {
  animation-delay: -0.5s;
  background-color: #2C3D55;
}
@keyframes scale {
  0%, 40%, 100% {
    transform: scaleY(0.05);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
