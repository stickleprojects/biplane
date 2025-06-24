import { GameObjects, Scene } from "phaser";
import Player from "../entities/player";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player1: Player;
  instructions: GameObjects.Text;

  initPhysics() {
    this.physics.world.setBounds(0, 0, 1024, 768);
    this.physics.world.setFPS(60);
    this.physics.world.gravity.set(0, 0);
    this.physics.world.setBoundsCollision(true, true, true, true);
  }
  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x0000a0);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    this.initPhysics();

    this.instructions = this.add.text(
      100,
      100,
      "Use left/right arrows to steer the plane.\nClick to end the game."
    );
    this.player1 = new Player(this, 300, 200);
  }
  update(time: number, delta: number) {
    this.physics.world.step(delta);
    this.player1.update(time, delta, this.input);
  }
}
