<script setup lang="ts">
</script>

<template>
  <section class="home-view" data-testid="home-view">
    <div class="home-card">
      <p class="home-kicker">mahjong trainer</p>
      <h1 class="home-title">台灣 16 張麻將</h1>
      <RouterLink class="home-link" to="/game">
        開始牌局
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-view {
  display: grid;
  min-height: calc(100vh - 5rem);
  place-items: center;
  padding: 2rem;
}

.home-card {
  width: min(100%, 32rem);
  border: 1px solid rgba(58, 42, 18, 0.12);
  border-radius: 1.5rem;
  padding: 2rem;
  background: rgba(255, 251, 244, 0.82);
  box-shadow: 0 1rem 3rem rgba(78, 60, 31, 0.12);
}

.home-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #7d5f32;
}

.home-title {
  margin: 0 0 1.5rem;
  font-size: clamp(2rem, 4vw, 3rem);
}

.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  background: #234b3d;
  color: #f8f2e7;
  text-decoration: none;
}
</style>
