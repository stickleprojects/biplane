import { Scene, GameObjects } from "phaser";
import Player from "../entities/player";

export class MainMenu extends Scene {
  background: GameObjects.Image;

  instructions: GameObjects.Text;

  player1: Player;

  constructor() {
    super("MainMenu");
  }

  initPhysics() {
    this.physics.world.setBounds(0, 0, 1024, 768);
    this.physics.world.setFPS(60);
    this.physics.world.gravity.set(0, 0);
    this.physics.world.setBoundsCollision(true, true, true, true);
  }
  preload() {}
  create() {
    this.initPhysics();

    this.player1 = new Player(this, 300, 200);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });

    this.instructions = this.add.text(
      100,
      100,
      "Use left/right arrows to steer the plane.\nClick to end the game."
    );
  }

  update(time: number, delta: number) {
    this.physics.world.step(delta);
    this.player1.update(time, delta, this.input);
  }
}
