<template>
  <div class="canvas-panel" @dragover.prevent @drop="onDrop">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes"
      :fit-view-on-init="true"
      :zoom-on-scroll="true"
      :pan-on-drag="true"
      :min-zoom="0.25"
      :max-zoom="2"
      @connect="(p) => emit('connect', p)"
      @node-click="onNodeClick"
      @edge-click="onEdgeClick"
      @pane-click="() => emit('clear-selection')"
      @node-drag-stop="onNodeDragStop"
    />

    <div class="zoom-controls">
      <button @click="onZoomIn">+</button>
      <button @click="onZoomOut">-</button>
      <button @click="resetZoom">100%</button>
      <button @click="onFitView">Fit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Connection, XYPosition } from "@vue-flow/core";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import type { WorkflowEdge, WorkflowNode } from "@/stores/workflowStore";
import FlowNodeCard from "./FlowNodeCard.vue";

defineProps<{
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}>();

const emit = defineEmits<{
  (e: "connect", connection: Connection): void;
  (e: "select-node", nodeId: string): void;
  (e: "select-edge", edgeId: string): void;
  (e: "clear-selection"): void;
  (e: "node-moved", payload: { nodeId: string; position: XYPosition }): void;
  (e: "add-node", payload: { nodeType: string; position: XYPosition }): void;
}>();

const nodeTypes: Record<string, any> = {
  Start: FlowNodeCard,
  Knowledge: FlowNodeCard,
  Aggregate: FlowNodeCard,
  Branch: FlowNodeCard,
  LLM: FlowNodeCard,
  End: FlowNodeCard
};

const { zoomIn, zoomOut, setViewport, fitView, screenToFlowCoordinate } = useVueFlow();

function onNodeClick(event: any) {
  emit("select-node", event.node.id);
}

function onEdgeClick(event: any) {
  emit("select-edge", event.edge.id);
}

function onNodeDragStop(event: any) {
  emit("node-moved", { nodeId: event.node.id, position: event.node.position });
}

function onDrop(event: DragEvent) {
  const nodeType = event.dataTransfer?.getData("application/coze-node");
  if (!nodeType) return;
  const position = screenToFlowCoordinate({ x: event.clientX, y: event.clientY });
  emit("add-node", { nodeType, position });
}

function onZoomIn() {
  zoomIn();
}

function onZoomOut() {
  zoomOut();
}

function onFitView() {
  fitView();
}

function resetZoom() {
  setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 180 });
}
</script>

<style scoped>
.canvas-panel {
  border: 1px solid var(--line);
  border-radius: 12px;
  position: relative;
  height: 100%;
  overflow: hidden;
  background-color: #f8fafc;
  background-image:
    linear-gradient(to right, rgba(100, 116, 139, 0.16) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(100, 116, 139, 0.16) 1px, transparent 1px);
  background-size: 22px 22px;
  box-shadow: var(--shadow-sm);
}

.zoom-controls {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  gap: 6px;
  z-index: 10;
}

.zoom-controls button {
  border: 1px solid var(--line-strong);
  background: #fff;
  border-radius: 8px;
  padding: 6px 9px;
  cursor: pointer;
  color: #223041;
}

.zoom-controls button:hover {
  background: #f2f6fa;
}
</style>
