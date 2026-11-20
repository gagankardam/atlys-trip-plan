import { DESTINATIONS, type Destination, type Friend } from '../data/mock'

export interface RankedDestination extends Destination {
  inBudget: boolean
  blockers: Friend[]
  matchCount: number
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function rankDestinations(friends: Friend[]): RankedDestination[] {
  const active = friends.filter((friend) => friend.joined && friend.prefsSubmitted)
  const ranked = DESTINATIONS.map((destination) => {
    const blockers = active.filter(
      (friend) => friend.budgetHard && destination.cost > friend.budget,
    )
    const matchCount = active.filter((friend) =>
      friend.interests.some((interest) => destination.tags.includes(interest)),
    ).length
    return {
      ...destination,
      inBudget: blockers.length === 0,
      blockers,
      matchCount,
    }
  })

  ranked.sort((a, b) => {
    if (a.inBudget !== b.inBudget) return a.inBudget ? -1 : 1
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount
    return a.cost - b.cost
  })

  return ranked
}

export function budgetInsight(ranked: RankedDestination[]): string | null {
  const gokarna = ranked.find((destination) => destination.id === 'gokarna')
  if (!gokarna || gokarna.inBudget) return null
  const names = gokarna.blockers.map((friend) => friend.name)
  const who =
    names.length === 0
      ? 'the group'
      : names.length === 1
        ? names[0]
        : `${names[0]} and ${names[1]}`
  return `Gokarna is now above ${who}'s budget. Coorg may be a better fit.`
}

export function gokarnaGap(friends: Friend[]): { person: Friend; gap: number } | null {
  const aisha = friends.find((friend) => friend.id === 'aisha')
  if (!aisha || !aisha.joined || !aisha.prefsSubmitted) return null
  if (!aisha.budgetHard) return null
  const gap = 8500 - aisha.budget
  if (gap <= 0) return null
  return { person: aisha, gap }
}
