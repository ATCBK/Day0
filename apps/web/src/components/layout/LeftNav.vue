<template>
  <aside class="left-nav">
    <div class="brand">
      <div class="brand-mark">C</div>
      <div>
        <h2>Coze Builder</h2>
        <p class="brand-sub">P0 Workflow Studio</p>
      </div>
    </div>

    <nav class="menu">
      <RouterLink class="menu-item" to="/studio/workflow/demo">
        <span>Workflow</span>
        <small>Builder</small>
      </RouterLink>
      <RouterLink class="menu-item" to="/studio/knowledge">
        <span>Knowledge</span>
        <small>RAG</small>
      </RouterLink>
      <RouterLink class="menu-item" to="/studio/agent/demo-agent">
        <span>Agent</span>
        <small>Preview</small>
      </RouterLink>
    </nav>

    <div class="hint">设计参考 demo4，当前为白底中性风格重构版。</div>
  </aside>
</template>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #0f6cbd;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #95a6bd;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  border: 1px solid #2c3d54;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #c9d5e6;
}

.menu-item small {
  color: #8fa0b8;
}

.menu-item.router-link-active {
  border-color: #4f6d8e;
  background: #1c2a3d;
  color: #f8fbff;
}

.hint {
  margin-top: auto;
  font-size: 12px;
  color: #8fa0b8;
  line-height: 1.5;
}
</style>
