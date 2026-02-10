<template>
  <div class="app-shell">
    <LeftNav />
    <div class="content-shell">
      <TopBar />
      <main class="page-body">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftNav from "@/components/layout/LeftNav.vue";
import TopBar from "@/components/layout/TopBar.vue";
</script>
