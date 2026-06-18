import { Food } from '../data/foods';

export type Archetype = { emoji: string; label: string };

export function deriveArchetypes(liked: Food[]): Archetype[] {
  const tags = liked.flatMap((f) => f.tags);
  const count = (t: string): number => tags.filter((x) => x === t).length;
  const catCount = (c: string): number =>
    liked.filter((f) => f.category === c).length;

  const archetypes: Archetype[] = [];

  if (count('red-meat') >= 1 || catCount('protein') >= 3)
    archetypes.push({ emoji: '🥩', label: 'Carnivore' });
  if (count('italian') >= 1)
    archetypes.push({ emoji: '🇮🇹', label: 'Italian Food' });
  if (count('fruit') >= 1 || count('breakfast') >= 2)
    archetypes.push({ emoji: '🍇', label: 'Fruit-Lover' });
  if (count('japanese') >= 1)
    archetypes.push({ emoji: '🍱', label: 'Japanese Food' });
  if (catCount('vegetable') >= 3)
    archetypes.push({ emoji: '🥗', label: 'Plant-Based' });
  if (count('comfort') >= 3)
    archetypes.push({ emoji: '🛋️', label: 'Comfort Food' });
  if (count('healthy') >= 4)
    archetypes.push({ emoji: '💚', label: 'Health Nut' });

  // Always return at least 3
  const defaults: Archetype[] = [
    { emoji: '🌍', label: 'Adventurous' },
    { emoji: '⚖️', label: 'Balanced' },
    { emoji: '🍽️', label: 'Foodie' },
  ];
  while (archetypes.length < 3)
    archetypes.push(defaults[archetypes.length]);

  return archetypes.slice(0, 6); // max 6 (2 pages of 3)
}

export function deriveLifestyleTraits(liked: Food[]): string[] {
  const tags = liked.flatMap((f) => f.tags);
  const traits: string[] = [];
  if (tags.includes('healthy')) traits.push('Active');
  if (liked.some((f) => f.category === 'protein')) traits.push('Gym-Goer');
  if (liked.some((f) => f.category === 'vegetable')) traits.push('Walks a lot');
  traits.push('PCOS & GI Diet');
  return traits.slice(0, 4);
}
