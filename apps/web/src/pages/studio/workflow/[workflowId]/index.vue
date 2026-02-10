<template>
  <section>
    <h3>Workflow Studio: {{ route.params.workflowId }}</h3>
    <div class="canvas-wrapper">
      <VueFlow :nodes="nodes" :edges="edges" fit-view />
    </div>
    <RunConsole />
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { VueFlow } from "@vue-flow/core";
import RunConsole from "@/components/workflow/RunConsole.vue";

const route = useRoute();
const nodes = ref([]);
const edges = ref([]);
</script>
