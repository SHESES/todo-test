<template>
  <div>
    <router-view/>
    <CookiesConfirm />
  </div>
</template>

<script setup>
import { CookiesConfirm } from './components/';
</script>

<style scoped>
</style>
