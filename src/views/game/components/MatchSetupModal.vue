<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  defaultInitialChips?: number
}>()

const emit = defineEmits<{
  submit: [payload: { initialChips: number; victoryMode: 'bankruptcy' | 'four-winds' }]
}>()

const initialChips = ref(String(props.defaultInitialChips ?? 1000))
const victoryMode = ref<'bankruptcy' | 'four-winds'>('bankruptcy')

const handleSubmit = () => {
  const parsed = Number(initialChips.value)

  if (!Number.isFinite(parsed) || parsed <= 0)
    return

  emit('submit', {
    initialChips: parsed,
    victoryMode: victoryMode.value
  })
}
</script>

<template>
  <div class="match-setup-backdrop" data-testid="match-setup-modal">
    <section class="match-setup-card">
      <p class="match-setup-kicker">本場設定</p>
      <h2 class="match-setup-title">開局籌碼與勝利條件</h2>

      <label class="match-setup-field">
        <span>初始籌碼</span>
        <input
          v-model="initialChips"
          data-testid="match-setup-initial-chips"
          inputmode="numeric"
          type="number"
          min="1"
        >
      </label>

      <fieldset class="match-setup-fieldset">
        <legend>勝利條件</legend>
        <label class="match-setup-option">
          <input
            v-model="victoryMode"
            data-testid="match-setup-mode-bankruptcy"
            type="radio"
            value="bankruptcy"
          >
          <span>任一家籌碼小於等於 0 時立即結束</span>
        </label>
        <label class="match-setup-option">
          <input
            v-model="victoryMode"
            data-testid="match-setup-mode-four-winds"
            type="radio"
            value="four-winds"
          >
          <span>打滿四風圈後總結算</span>
        </label>
      </fieldset>

      <div class="match-setup-rules" data-testid="match-setup-rules">
        <span>底：30</span>
        <span>台：10</span>
      </div>

      <button
        class="action-button-pill cursor-pointer"
        data-testid="match-setup-submit"
        type="button"
        @click="handleSubmit"
      >
        開始對局
      </button>
    </section>
  </div>
</template>

<style scoped>
.match-setup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(14, 29, 24, 0.62);
  backdrop-filter: blur(6px);
}

.match-setup-card {
  width: min(100%, 32rem);
  display: grid;
  gap: 1rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(255, 229, 166, 0.24);
  background: linear-gradient(180deg, rgba(28, 71, 58, 0.98), rgba(17, 44, 37, 0.98));
  padding: 1.4rem;
  color: #f8f2e7;
  box-shadow: 0 1.2rem 3rem rgba(10, 24, 20, 0.28);
}

.match-setup-kicker {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f1d48a;
}

.match-setup-title {
  margin: 0;
}

.match-setup-field,
.match-setup-fieldset {
  display: grid;
  gap: 0.6rem;
}

.match-setup-field input {
  border: 1px solid rgba(255, 235, 193, 0.22);
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  padding: 0.75rem 0.9rem;
}

.match-setup-fieldset {
  border: 1px solid rgba(255, 235, 193, 0.16);
  border-radius: 1rem;
  padding: 0.9rem;
}

.match-setup-option {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
}

.match-setup-rules {
  display: flex;
  gap: 1rem;
  color: #f1d48a;
  font-weight: 700;
}
</style>
