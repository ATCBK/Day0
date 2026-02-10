<template>
  <header class="top-bar">
    <div class="left">
      <strong>Workflow Studio</strong>
      <span class="env-tag">Local</span>
    </div>
    <div class="right">
      <span class="status">P0 Converged Architecture</span>
    </div>
  </header>
</template>

<style scoped>
.left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.env-tag {
  font-size: 12px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 2px 8px;
  color: var(--muted);
}

.right {
  display: flex;
  align-items: center;
}

.status {
  font-size: 12px;
  color: var(--muted);
}
</style>
