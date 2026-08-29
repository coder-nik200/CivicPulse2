import { db } from "../config/db.js";

export async function findDuplicate(title, category, area) {
  const docs = db.collection("issues").find({ category, area, status: { $ne: "resolved" } }).sort().toArray();
  const titleLower = title.toLowerCase();

  for (const doc of docs) {
    const existing = doc.title?.toLowerCase() || "";
    if (similarity(titleLower, existing) > 0.7) {
      return { isDuplicate: true, duplicateId: doc._id };
    }
  }

  return { isDuplicate: false };
}

function similarity(a, b) {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const getBigrams = (str) => {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i++) bigrams.add(str.slice(i, i + 2));
    return bigrams;
  };

  const aBigrams = getBigrams(a);
  const bBigrams = getBigrams(b);
  let intersect = 0;
  for (const bg of aBigrams) if (bBigrams.has(bg)) intersect++;
  return (2 * intersect) / (aBigrams.size + bBigrams.size);
}
