import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {}
  create() {
    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
