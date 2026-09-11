// Plain JS (not .ts) so scripts/generate-audio.mjs -- a zero-dependency Node
// script with no build step -- can import it directly, same as the app code.
// See textUtils.d.mts alongside for the type declaration TypeScript needs.

/**
 * Lowercase just the first letter, for mid-sentence use ("The Kraken" -> "the Kraken").
 * @param {string} label
 * @returns {string}
 */
export function toMidSentence(label) {
  return label.charAt(0).toLowerCase() + label.slice(1);
}
