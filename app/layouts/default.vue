<template>
  <div class="app">
    <AppHeader />
    <main class="mn">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layouts/Header.vue';
import AppFooter from '~/components/layouts/Footer.vue';
</script>
