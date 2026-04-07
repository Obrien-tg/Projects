import Rotor from './Rotor.js';
import Reflector from './Reflector.js';
import Plugboard from './Plugboard.js';

// Minimal set of rotor wirings and a reflector to allow a working demo
const ROTORS = {
  I: { w: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  II: { w: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  III: { w: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  IV: { w: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  V: { w: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' }
};

const REFLECTORS = {
  B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL'
};

export function createPlugboard(pairs) {
  return new Plugboard(pairs);
}

export default class Enigma {
  constructor(rotors = [], reflector = null, plugboard = null) {
    this.rotors = rotors; // array of Rotor instances, left-to-right (left is slow)
    this.reflector = reflector;
    this.plugboard = plugboard || new Plugboard([]);
  }

  // Simple default config: rotors I II III, reflector B
  static default() {
    const r1 = new Rotor(ROTORS.I.w, ROTORS.I.notch);
    const r2 = new Rotor(ROTORS.II.w, ROTORS.II.notch);
    const r3 = new Rotor(ROTORS.III.w, ROTORS.III.notch);
    return new Enigma([r1, r2, r3], new Reflector(REFLECTORS.B), new Plugboard([]));
  }

  setRotorPositions(positions) {
    // positions is ['A','B','C'] left-to-right
    for (let i = 0; i < Math.min(this.rotors.length, positions.length); i++) {
      this.rotors[i].position = Rotor.alphaIndex(positions[i] || 'A');
    }
  }

  stepRotors() {
    // Rightmost rotor steps every key press. Implement double-step.
    const r = this.rotors;
    const n = r.length;
    if (n === 0) return;

    // Double-step logic: if middle rotor at notch, it and left rotor step.
    // Simpler implementation for three rotors:
    if (n >= 2 && r[n - 2].atNotch()) {
      r[n - 3] && r[n - 3].step();
      r[n - 2].step();
    }
    // If right rotor at notch, middle rotor steps
    if (n >= 1 && r[n - 1].atNotch()) {
      r[n - 2] && r[n - 2].step();
    }
    // Rightmost always steps
    r[n - 1].step();
  }

  processChar(ch) {
    if (!/[A-Z]/.test(ch)) return ch;

    this.stepRotors();

    // Plugboard in
    let c = this.plugboard.swap(ch);

    // Pass through rotors right-to-left (fast rotor is rightmost)
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }

    // Reflect
    c = this.reflector.reflect(c);

    // Back through rotors left-to-right
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }

    // Plugboard out
    c = this.plugboard.swap(c);

    return c;
  }

  processText(text) {
    const out = [];
    for (const ch of text) {
      const up = ch.toUpperCase();
      out.push(this.processChar(up));
    }
    return out.join('');
  }
}
