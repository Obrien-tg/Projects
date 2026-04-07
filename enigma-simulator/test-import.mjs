import Enigma, { createPlugboard } from './enigma/Enigma.js';

(async function(){
  const en = Enigma.default();
  en.setRotorPositions(['A','A','A']);
  // Example with no plugboard
  const inText = 'HELLO WORLD';
  const out = en.processText(inText);
  console.log('Enigma test:');
  console.log(' Input :', inText);
  console.log(' Output:', out);

  // Test with a simple plugboard pair (use named export)
  en.plugboard = createPlugboard(['AZ','BY']);
  en.setRotorPositions(['A','A','A']);
  const out2 = en.processText('HELLOWORLD');
  console.log(' With plugboard (AZ,BY):', out2);
})();
