'use client'
export default class KeyboardState {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  isKeyDown(key: string) {
    const state = this.keys[key.toLowerCase()];
    if (state === undefined) {
      return 0;
    }
    return state ? 1 : 0;
  }
}
