<template>
  <div class="node-card" :class="runClass">
    <Handle type="target" :position="Position.Left" id="in" />
    <div class="title">{{ props.type }}</div>
    <div class="id">{{ props.id }}</div>

    <template v-if="props.type === NODE_TYPES.BRANCH">
      <Handle type="source" :position="Position.Right" id="true" :style="{ top: '30%' }" />
      <Handle type="source" :position="Position.Right" id="false" :style="{ top: '70%' }" />
      <div class="branch-label branch-true">True</div>
      <div class="branch-label branch-false">False</div>
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
  min-width: 190px;
  background: #fff;
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  padding: 10px 12px;
  position: relative;
  box-shadow: var(--shadow-sm);
}

.title {
  font-weight: 700;
  letter-spacing: 0.2px;
}

.id {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.run-started {
  border-color: #0f6cbd;
  box-shadow: 0 0 0 2px rgba(15, 108, 189, 0.18);
}

.run-success {
  border-color: #17803d;
  box-shadow: 0 0 0 2px rgba(23, 128, 61, 0.18);
}

.run-failed {
  border-color: #b42318;
  box-shadow: 0 0 0 2px rgba(180, 35, 24, 0.15);
}

.branch-label {
  position: absolute;
  right: 18px;
  font-size: 11px;
  color: var(--muted);
}

.branch-true {
  top: 24%;
}

.branch-false {
  top: 64%;
}
</style>
