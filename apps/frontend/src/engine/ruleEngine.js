// src/engine/ruleEngine.js
import { rules } from "./rules";
import { recommendations } from "./mockRecommendations";

export function getRecommendations(mood, { budget }) {
  if (!mood) return [];

  // find rule for this mood
  const rule = rules.find((r) => r.mood === mood);
  if (!rule) return [];

  // filter recommendations for this mood
  let filtered = recommendations.filter((rec) => rec.mood === mood);

  // apply budget filter
  if (budget) {
    filtered = filtered.filter((rec) => rec.price <= rule.conditions.budget.max && rec.price <= budget);
  }

  return filtered;
}
