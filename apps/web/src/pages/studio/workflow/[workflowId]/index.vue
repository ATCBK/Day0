<template>
  <section class="workflow-page">
    <header class="workflow-header">
      <div>
        <h3>Workflow Studio: {{ workflowStore.workflowId }}</h3>
        <span class="dirty" v-if="workflowStore.dirty">未保存</span>
      </div>
      <el-button size="small" @click="workflowStore.save">保存到本地</el-button>
    </header>

    <div class="workflow-main">
      <aside class="left"><PalettePanel @add-node="onAddNode" /></aside>
      <main class="center">
        <WorkflowCanvas
          :nodes="canvasNodes"
          :edges="workflowStore.edges"
          @connect="onConnect"
          @add-node="onAddNodeFromDrop"
          @select-node="workflowStore.selectNode"
          @select-edge="workflowStore.selectEdge"
          @clear-selection="workflowStore.clearSelection"
          @node-moved="onNodeMoved"
        />
      </main>
      <aside class="right">
        <InspectorPanel
          :node="selectedNode"
          @update-node-data="workflowStore.updateSelectedNodeData"
          @delete-node="workflowStore.removeSelectedNode"
        />
      </aside>
    </div>

    <div class="console-wrap">
      <RunConsole :workflow-id="workflowStore.workflowId" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import type { Connection, XYPosition } from "@vue-flow/core";
import type { NodeType } from "@/types";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useRunStore } from "@/stores/runStore";
import PalettePanel from "@/components/workflow/PalettePanel.vue";
import WorkflowCanvas from "@/components/workflow/WorkflowCanvas.vue";
import InspectorPanel from "@/components/workflow/InspectorPanel.vue";
import RunConsole from "@/components/workflow/RunConsole.vue";

const route = useRoute();
const workflowStore = useWorkflowStore();
const runStore = useRunStore();

const selectedNode = computed(
  () => workflowStore.nodes.find((n) => n.id === workflowStore.selectedNodeId) || null
);

const canvasNodes = computed(() =>
  workflowStore.nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      __runStatus: runStore.nodeStatuses[node.id]
    }
  }))
);

onMounted(() => {
  const workflowId = String(route.params.workflowId || "demo");
  workflowStore.load(workflowId);
  window.addEventListener("keydown", onDeleteKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onDeleteKey);
  runStore.closeStream();
});

function onAddNode(nodeType: NodeType) {
  workflowStore.addNode(nodeType);
}

function onAddNodeFromDrop(payload: { nodeType: string; position: XYPosition }) {
  workflowStore.addNode(payload.nodeType as NodeType, payload.position);
}

function onNodeMoved(payload: { nodeId: string; position: XYPosition }) {
  workflowStore.updateNodePosition(payload.nodeId, payload.position);
}

function onConnect(connection: Connection) {
  const result = workflowStore.addEdge(connection);
  if (!result.ok) {
    ElMessage.warning(result.reason || "连线失败");
  }
}

function onDeleteKey(event: KeyboardEvent) {
  if (event.key !== "Delete") return;

  if (workflowStore.selectedNodeId) {
    workflowStore.removeSelectedNode();
    return;
  }

  if (workflowStore.selectedEdgeId) {
    workflowStore.removeSelectedEdge();
  }
}
</script>

<style scoped>
.workflow-page {
  display: grid;
  grid-template-rows: auto 1fr 250px;
  gap: 12px;
  height: calc(100vh - 110px);
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workflow-header h3 {
  margin: 0;
}

.dirty {
  color: #f59e0b;
  font-size: 12px;
  margin-left: 8px;
}

.workflow-main {
  display: grid;
  grid-template-columns: 220px 1fr 320px;
  gap: 12px;
  min-height: 0;
}

.left,
.center,
.right,
.console-wrap {
  min-height: 0;
}

@media (max-width: 1280px) {
  .workflow-main {
    grid-template-columns: 200px 1fr 280px;
  }
}

@media (max-width: 1024px) {
  .workflow-page {
    grid-template-rows: auto auto 1fr 240px;
    height: auto;
  }

  .workflow-main {
    grid-template-columns: 1fr;
  }

  .center {
    height: 520px;
  }
}
</style>
