<script setup lang="ts">
</script>

<template>
  <div class="app-shell" data-testid="app-shell">
    <header class="app-header">
      <RouterLink class="app-brand" to="/">
        mahjong-trainer
      </RouterLink>
      <nav class="app-nav">
        <RouterLink class="app-link" to="/">
          首頁
        </RouterLink>
        <RouterLink class="app-link" to="/game">
          牌局
        </RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  padding: 0.75rem;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(58, 42, 18, 0.12);
  border-radius: 1.25rem;
  padding: 0.72rem 0.95rem;
  background: rgba(255, 251, 244, 0.72);
  backdrop-filter: blur(14px);
}

.app-brand,
.app-link {
  color: inherit;
  text-decoration: none;
}

.app-brand {
  font-weight: 700;
  letter-spacing: 0.04em;
}

.app-nav {
  display: flex;
  gap: 0.5rem;
}

.app-link {
  border-radius: 999px;
  padding: 0.5rem 0.85rem;
  background: rgba(35, 75, 61, 0.08);
}

.app-main {
  padding: 0.8rem 0 0;
  min-height: 0;
}
</style>
