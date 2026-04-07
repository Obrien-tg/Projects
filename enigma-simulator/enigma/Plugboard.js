export default class Plugboard {
  constructor(pairs = []) {
    // pairs: array of two-letter strings like 'AB'
    this.map = new Map();
    for (const p of pairs) {
      if (p && p.length >= 2) {
        const a = p[0].toUpperCase();
        const b = p[1].toUpperCase();
        if (a === b) continue;
        this.map.set(a, b);
        this.map.set(b, a);
      }
    }
  }

  swap(c) {
    return this.map.get(c) || c;
  }
}
