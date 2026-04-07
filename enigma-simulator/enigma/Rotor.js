// Rotor implementation
export default class Rotor {
  constructor(wiring, notch, ring = 0, position = 'A') {
    this.wiring = wiring.toUpperCase();
    this.notch = notch.toUpperCase();
    this.ring = ring; // 0-25
    this.position = Rotor.alphaIndex(position || 'A');
  }

  static alphaIndex(ch) { return ch.charCodeAt(0) - 65; }
  static indexAlpha(i) { return String.fromCharCode(((i%26)+26)%26 + 65); }

  // step the rotor by 1
  step() { this.position = (this.position + 1) % 26; }

  // Returns true if rotor is at its notch position
  atNotch() { return Rotor.indexAlpha(this.position) === this.notch; }

  // forward through rotor (entering from keyboard side)
  forward(c) {
    const offset = (this.position - this.ring + 26) % 26;
    const i = (Rotor.alphaIndex(c) + offset) % 26;
    const wired = this.wiring[i];
    const out = (Rotor.alphaIndex(wired) - offset + 26) % 26;
    return Rotor.indexAlpha(out);
  }

  // backward through rotor (from reflector side)
  backward(c) {
    const offset = (this.position - this.ring + 26) % 26;
    const i = (Rotor.alphaIndex(c) + offset) % 26;
    const idx = this.wiring.indexOf(Rotor.indexAlpha(i));
    const out = (idx - offset + 26) % 26;
    return Rotor.indexAlpha(out);
  }
}
