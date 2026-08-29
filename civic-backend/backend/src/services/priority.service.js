// Priority score: 1 (low) to 10 (critical)
const CATEGORY_WEIGHTS = {
  "Public Safety": 5,
  Electricity: 4,
  Water: 4,
  Road: 3,
  Sanitation: 3,
  Other: 1,
};

export function calculatePriority({ category, upvotes = 0, duplicateCount = 0 }) {
  const base = CATEGORY_WEIGHTS[category] ?? 1;
  const upvoteScore = Math.min(upvotes * 0.1, 3);
  const duplicateScore = Math.min(duplicateCount * 0.5, 2);

  return Math.min(Math.round(base + upvoteScore + duplicateScore), 10);
}
