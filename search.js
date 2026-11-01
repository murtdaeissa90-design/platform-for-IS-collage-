// بحث تلقائي يتحمّل الأخطاء الإملائية، ويدعم العربي والإنجليزي.

const ROMAN = { i: "1", ii: "2", iii: "3", iv: "4" };

/** توحيد النص: حروف صغيرة، حذف التشكيل، توحيد الهمزات والتاء المربوطة والألف المقصورة، وتحويل الأرقام العربية */
export function norm(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(input) {
  return norm(input)
    .split(" ")
    .filter(Boolean)
    .map((t) => ROMAN[t] || t);
}

/** مسافة التحرير (Levenshtein) مع توقف مبكر */
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    let rowMin = prev[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        last + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      last = tmp;
      if (prev[j] < rowMin) rowMin = prev[j];
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length];
}

function tokenScore(q, t) {
  if (t === q) return 100;
  if (t.startsWith(q)) return 90 - Math.min(10, t.length - q.length);
  if (q.length >= 3 && t.includes(q)) return 70;
  if (q.length >= 3) {
    const max = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3;
    const d = Math.min(lev(q, t.slice(0, q.length), max), lev(q, t, max));
    if (d <= max) return 60 - d * 10;
  }
  return 0;
}

/** تقييم عنصر مقابل الاستعلام: 0 = غير مطابق */
export function scoreText(queryTokens, text) {
  const tt = tokens(text);
  if (!tt.length || !queryTokens.length) return 0;
  let total = 0;
  for (const q of queryTokens) {
    let best = 0;
    for (const t of tt) {
      const s = tokenScore(q, t);
      if (s > best) best = s;
    }
    if (!best) {
      // الطالب كتب الكلمات ملتصقة؟ جرّب مطابقتها مع النص كاملاً بلا مسافات
      const joined = tt.join("");
      if (q.length >= 4 && joined.includes(q)) best = 55;
    }
    if (!best) return 0;
    total += best;
  }
  return total / queryTokens.length;
}

/**
 * items: مصفوفة عناصر، getTexts(item) => مصفوفة نصوص قابلة للبحث
 * يرجع أفضل النتائج مرتبة.
 */
export function fuzzySearch(items, query, getTexts, limit = 8) {
  const q = tokens(query);
  if (!q.length) return [];
  const scored = [];
  for (const item of items) {
    let best = 0;
    for (const text of getTexts(item)) {
      const s = scoreText(q, text);
      if (s > best) best = s;
    }
    if (best > 0) scored.push({ item, score: best });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.item);
}
