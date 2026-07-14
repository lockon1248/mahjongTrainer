/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, any>
  export default component
}

interface Window {
  __MAHJONG_E2E__?: {
    seedPonClaimScenario: () => void
    seedDiscardWinScenario: () => void
    seedBigThreeDragonsClaimScenario: () => void
  }
}
