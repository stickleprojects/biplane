import { Scene, GameObjects } from "phaser";
import Player from "../entities/player";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

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
    //his.background = this.add.image(512, 384, "background");

    this.initPhysics();

    this.player1 = new Player(this, 300, 200);

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }

  update(time: number, delta: number) {
    this.physics.world.step(delta);
    if (
      this.input.keyboard?.checkDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        0
      )
    ) {
      this.player1.setRotation(this.player1.rotation + 0.1);
    }
    if (
      this.input.keyboard?.checkDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        0
      )
    ) {
      this.player1.setRotation(this.player1.rotation - 0.1);
    }

    const speed = 0.2; // Adjust as needed
    var b = this.player1.body as Phaser.Physics.Arcade.Body;
    const angle = b.rotation; // Get the angle in degrees

    // Convert angle to radians
    const rad = Phaser.Math.DegToRad(angle);

    // Calculate velocity components
    const vx = Math.cos(rad) * speed;
    const vy = Math.sin(rad) * speed;

    // Apply velocity to the sprite's body
    b.setVelocity(vx, vy);
    this.physics.world.wrap(this.player1, 0);
  }
}
