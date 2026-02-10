<template>
  <section>
    <h3>Agent: {{ route.params.agentId }}</h3>
    <p>Agent config placeholder.</p>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>
