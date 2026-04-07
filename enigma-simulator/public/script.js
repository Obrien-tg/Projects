import Enigma, { createPlugboard } from '/enigma/Enigma.js';

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const encryptBtn = document.getElementById('encrypt');
const clearBtn = document.getElementById('clear');
const r1 = document.getElementById('r1');
const r2 = document.getElementById('r2');
const r3 = document.getElementById('r3');
const plugboardEl = document.getElementById('plugboard');

function parsePlugboard(text) {
  if (!text) return [];
  return text.toUpperCase().split(/\s+/).filter(Boolean).map(pair => pair.slice(0,2));
}

encryptBtn.addEventListener('click', () => {
  const rotorPositions = [r1.value || 'A', r2.value || 'A', r3.value || 'A'].map(v => v.toUpperCase()[0] || 'A');
  const plugs = parsePlugboard(plugboardEl.value);

  // Create a default configuration: three rotors and a reflector
  const enigma = Enigma.default();
  enigma.setRotorPositions(rotorPositions);
  enigma.plugboard = createPlugboard(plugs);

  const text = (inputEl.value || '').toUpperCase();
  const result = enigma.processText(text);
  outputEl.textContent = result;
  console.log('Encrypted', {text, result, rotorPositions, plugs});
});

clearBtn.addEventListener('click', () => { inputEl.value = ''; outputEl.textContent = ''; plugboardEl.value = ''; r1.value = r2.value = r3.value = 'A'; });

// Quick log to indicate module loaded
console.log('Enigma UI loaded');
