<template>
  <div class="palette-panel">
    <div class="panel-title">Node Palette</div>
    <div class="node-list">
      <button
        v-for="item in nodeItems"
        :key="item.type"
        class="node-item"
        draggable="true"
        @click="emit('add-node', item.type)"
        @dragstart="onDragStart($event, item.type)"
      >
        <span>{{ item.type }}</span>
        <small>{{ item.desc }}</small>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NODE_TYPES } from "@/types";
import type { NodeType } from "@/types";

const emit = defineEmits<{
  (e: "add-node", nodeType: NodeType): void;
}>();

const nodeItems: Array<{ type: NodeType; desc: string }> = [
  { type: NODE_TYPES.START, desc: "入口" },
  { type: NODE_TYPES.KNOWLEDGE, desc: "关键词检索" },
  { type: NODE_TYPES.AGGREGATE, desc: "变量聚合" },
  { type: NODE_TYPES.BRANCH, desc: "条件分支" },
  { type: NODE_TYPES.LLM, desc: "模型调用" },
  { type: NODE_TYPES.END, desc: "结束输出" }
];

function onDragStart(event: DragEvent, nodeType: NodeType) {
  if (!event.dataTransfer) return;
  event.dataTransfer.setData("application/coze-node", nodeType);
  event.dataTransfer.effectAllowed = "copy";
}
</script>

<style scoped>
.palette-panel {
  height: 100%;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.panel-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-item {
  text-align: left;
  border: 1px solid #dce2eb;
  background: #f8fafc;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
}

.node-item small {
  display: block;
  color: #64748b;
  margin-top: 4px;
}
</style>
