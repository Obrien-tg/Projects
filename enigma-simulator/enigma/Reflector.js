export default class Reflector {
  constructor(wiring) {
    this.wiring = wiring.toUpperCase();
  }

  reflect(c) {
    const i = c.charCodeAt(0) - 65;
    return this.wiring[i];
  }
}
