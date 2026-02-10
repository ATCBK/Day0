<template>
  <div class="inspector-panel">
    <div class="panel-title">Inspector</div>

    <div v-if="!node" class="empty">选择一个节点以编辑配置</div>

    <template v-else>
      <div class="node-meta">
        <div><b>Type:</b> {{ node.type }}</div>
        <div><b>ID:</b> {{ node.id }}</div>
      </div>

      <el-form label-position="top" size="small">
        <template v-if="node.type === NODE_TYPES.KNOWLEDGE">
          <el-form-item label="kbId">
            <el-input v-model="form.kbId" @input="sync" />
          </el-form-item>
          <el-form-item label="topK">
            <el-input-number v-model="form.topK" :min="1" :max="20" @change="sync" />
          </el-form-item>
        </template>

        <template v-if="node.type === NODE_TYPES.AGGREGATE">
          <el-form-item label="mappings">
            <div class="mapping-list">
              <div v-for="(row, idx) in form.mappings" :key="idx" class="mapping-row">
                <el-input v-model="row.to" placeholder="to" @input="sync" />
                <el-input v-model="row.from" placeholder="from" @input="sync" />
                <el-input v-model="row.default" placeholder="default" @input="sync" />
                <el-button type="danger" text @click="removeMapping(idx)">删</el-button>
              </div>
            </div>
            <el-button text @click="addMapping">+ mapping</el-button>
          </el-form-item>
        </template>

        <template v-if="node.type === NODE_TYPES.BRANCH">
          <el-form-item label="expression">
            <el-input v-model="form.expression" @input="sync" />
          </el-form-item>
          <el-form-item label="trueLabel">
            <el-input v-model="form.trueLabel" @input="sync" />
          </el-form-item>
          <el-form-item label="falseLabel">
            <el-input v-model="form.falseLabel" @input="sync" />
          </el-form-item>
        </template>

        <template v-if="node.type === NODE_TYPES.LLM">
          <el-form-item label="model">
            <el-input v-model="form.model" @input="sync" />
          </el-form-item>
          <el-form-item label="temperature">
            <el-input-number v-model="form.temperature" :min="0" :max="2" :step="0.1" @change="sync" />
          </el-form-item>
          <el-form-item label="system_prompt">
            <el-input v-model="form.system_prompt" type="textarea" :rows="3" @input="sync" />
          </el-form-item>
          <el-form-item label="user_template">
            <el-input v-model="form.user_template" type="textarea" :rows="4" @input="sync" />
          </el-form-item>
        </template>

        <template v-if="node.type === NODE_TYPES.END">
          <el-form-item label="outputSource">
            <el-input v-model="form.outputSource" @input="sync" />
          </el-form-item>
        </template>
      </el-form>

      <el-button type="danger" plain @click="emit('delete-node')">删除节点</el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { NODE_TYPES } from "@/types";

type MappingRow = { to: string; from: string; default?: unknown };

const props = defineProps<{
  node: { id: string; type: string; data: Record<string, unknown> } | null;
}>();

const emit = defineEmits<{
  (e: "update-node-data", payload: Record<string, unknown>): void;
  (e: "delete-node"): void;
}>();

const form = reactive<Record<string, any>>({});

watch(
  () => props.node,
  (node) => {
    const snapshot = node ? structuredClone(node.data) : {};
    Object.keys(form).forEach((key) => delete form[key]);
    Object.assign(form, snapshot);

    if (node?.type === NODE_TYPES.AGGREGATE && !Array.isArray(form.mappings)) {
      form.mappings = [{ to: "", from: "", default: "" }] as MappingRow[];
    }
  },
  { immediate: true, deep: true }
);

function sync() {
  emit("update-node-data", structuredClone(form));
}

function addMapping() {
  if (!Array.isArray(form.mappings)) form.mappings = [];
  form.mappings.push({ to: "", from: "", default: "" });
  sync();
}

function removeMapping(index: number) {
  if (!Array.isArray(form.mappings)) return;
  form.mappings.splice(index, 1);
  if (form.mappings.length === 0) {
    form.mappings.push({ to: "", from: "", default: "" });
  }
  sync();
}
</script>

<style scoped>
.inspector-panel {
  height: 100%;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: auto;
}

.panel-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.empty {
  color: #64748b;
}

.node-meta {
  margin-bottom: 10px;
  font-size: 12px;
  color: #475569;
}

.mapping-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mapping-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 6px;
}
</style>
