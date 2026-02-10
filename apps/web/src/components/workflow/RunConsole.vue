<template>
  <div class="run-console panel">
    <div class="header">
      <div>
        <b>Run Console</b>
        <span class="tip">运行使用本地 workflow 配置（P0）</span>
      </div>
      <el-button type="primary" :loading="runStore.status === 'RUNNING'" @click="onRun">Run</el-button>
    </div>

    <el-input v-model="userInput" type="textarea" :rows="2" placeholder="user_input (可空)" />

    <div class="status">状态: {{ runStore.status }} | runId: {{ runStore.runId || '-' }}</div>

    <div class="section">
      <div class="title">Node Status</div>
      <div v-if="Object.keys(runStore.nodeStatuses).length === 0" class="empty">暂无节点状态</div>
      <div v-for="(status, nodeId) in runStore.nodeStatuses" :key="nodeId" class="status-row">
        <span>{{ nodeId }}</span>
        <b>{{ status }}</b>
      </div>
    </div>

    <div class="section">
      <div class="title">Logs</div>
      <div v-if="runStore.logs.length === 0" class="empty">暂无日志</div>
      <div v-for="item in runStore.logs" :key="`${item.seq}-${item.message}`" class="log-row">
        [{{ item.seq }}][{{ item.level || 'info' }}] {{ item.message }}
      </div>
    </div>

    <div class="section" v-if="runStore.finalResult">
      <div class="title">Final Result</div>
      <div class="result-text">{{ runStore.finalResult.text }}</div>
      <div class="citations">
        <div class="title tiny">Citations</div>
        <div v-if="!runStore.finalResult.citations?.length" class="empty">无引用</div>
        <div v-for="c in runStore.finalResult.citations || []" :key="c.chunkId" class="citation-row">
          {{ c.kbId }}/{{ c.chunkId }} ({{ c.score }})
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRunStore } from "@/stores/runStore";
import { useWorkflowStore } from "@/stores/workflowStore";

const props = defineProps<{ workflowId: string }>();

const runStore = useRunStore();
const workflowStore = useWorkflowStore();
const userInput = ref("");

async function onRun() {
  try {
    workflowStore.save();
    await runStore.startRun(props.workflowId, userInput.value);
  } catch (error) {
    runStore.status = "FAILED";
    ElMessage.error(error instanceof Error ? error.message : "Run 启动失败");
  }
}
</script>

<style scoped>
.run-console {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tip {
  font-size: 12px;
  color: var(--muted);
  margin-left: 8px;
}

.status {
  font-size: 12px;
  color: #475569;
  border: 1px solid var(--line);
  background: var(--panel-soft);
  border-radius: 8px;
  padding: 6px 8px;
}

.section {
  border-top: 1px dashed var(--line);
  padding-top: 8px;
}

.title {
  font-weight: 700;
  margin-bottom: 4px;
}

.title.tiny {
  font-size: 12px;
  margin-top: 8px;
}

.empty {
  color: var(--muted);
  font-size: 12px;
}

.status-row,
.log-row,
.citation-row {
  font-size: 12px;
  margin-bottom: 2px;
}

.result-text {
  white-space: pre-wrap;
  font-size: 13px;
  border: 1px solid var(--line);
  background: #fbfcfe;
  border-radius: 8px;
  padding: 8px;
}
</style>
