<template>
  <div class="node-card" :class="runClass">
    <Handle type="target" :position="Position.Left" id="in" />
    <div class="title">{{ props.type }}</div>
    <div class="id">{{ props.id }}</div>

    <template v-if="props.type === NODE_TYPES.BRANCH">
      <Handle type="source" :position="Position.Right" id="true" :style="{ top: '30%' }" />
      <Handle type="source" :position="Position.Right" id="false" :style="{ top: '70%' }" />
      <div class="branch-label branch-true">T</div>
      <div class="branch-label branch-false">F</div>
    </template>
    <Handle v-else type="source" :position="Position.Right" id="out" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { NODE_TYPES } from "@/types";

const props = defineProps<{ id: string; type: string; data: Record<string, unknown> }>();

const runClass = computed(() => {
  const status = String(props.data.__runStatus || "");
  if (status === "started") return "run-started";
  if (status === "succeeded") return "run-success";
  if (status === "failed") return "run-failed";
  return "";
});
</script>

<style scoped>
.node-card {
  min-width: 160px;
  background: #fff;
  border: 1px solid #ccd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  position: relative;
}

.title {
  font-weight: 600;
}

.id {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.run-started {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.18);
}

.run-success {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.18);
}

.run-failed {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.18);
}

.branch-label {
  position: absolute;
  right: 18px;
  font-size: 11px;
  color: #64748b;
}

.branch-true {
  top: 24%;
}

.branch-false {
  top: 64%;
}
</style>
