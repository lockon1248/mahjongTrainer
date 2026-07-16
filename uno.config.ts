import { presetWind3 } from '@unocss/preset-wind3'

export default {
  presets: [presetWind3()],
  shortcuts: {
    'table-chip': 'rounded-4 border border-[#3b58442e] bg-[rgba(248,243,232,0.88)] px-4 py-3',
    'player-panel-shell': 'relative rounded-[1.25rem] p-4 text-[#f8f2e7] shadow-[0_1rem_2rem_rgba(20,50,41,0.16)] bg-[linear-gradient(180deg,rgba(30,73,60,0.96),rgba(20,50,41,0.96))]',
    'player-status-pill': 'inline-flex w-fit items-center rounded-full px-[0.72rem] py-[0.32rem] text-[0.78rem] font-700 tracking-[0.04em]',
    'player-stat-grid': 'mt-4 grid grid-cols-2 gap-3',
    'player-meld-card': 'grid gap-[0.45rem] rounded-[0.95rem] bg-[rgba(248,242,231,0.08)] px-[0.8rem] py-[0.7rem]',
    'tile-pill': 'rounded-[0.75rem] border px-[0.55rem] py-[0.3rem] text-[0.92rem]',
    'action-button-pill': 'rounded-full border border-[#3b58442e] bg-[rgba(248,243,232,0.88)] px-[0.9rem] py-[0.6rem] text-[#214538]'
  }
}
