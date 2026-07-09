export const ALL_SEATS = ['east', 'south', 'west', 'north'] as const

export type Seat = (typeof ALL_SEATS)[number]
