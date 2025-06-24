import Phaser, { Input } from "phaser";
import Bullet from "./bullet";

class Player extends Phaser.GameObjects.Sprite {
  private rotate_left: Phaser.Input.Keyboard.Key;
  private rotate_right: Phaser.Input.Keyboard.Key;
  private firebutton: Phaser.Input.Keyboard.Key;

  private plane_speed: number = 0.2; // Speed of the plane
  private color: number;
  private bulletGroup: Phaser.Physics.Arcade.Group;

  public get BulletGroup(): Phaser.Physics.Arcade.Group {
    return this.bulletGroup;
  }

  public get Color(): number {
    return this.color;
  }
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: number,
    bulletGroup: Phaser.Physics.Arcade.Group
  ) {
    super(scene, x, y, "yellowbiplane", 0);
    this.setScale(3).setOrigin(0.5, 0.5);
    this.color = color;
    this.setTint(this.color);

    this.bulletGroup = bulletGroup;
    this.play({ key: "right1", repeat: -1 });

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
  }

  fire() {
    // Implement firing logic here
    console.log("Firing!");
    // spawn a bullet or perform an action

    const bullet = new Bullet(this, this.x, this.y);
    this.bulletGroup.add(bullet);
  }
  bindKeys(input: Input.InputPlugin) {
    if (input == null) {
      throw new Error("Input plugin is not defined");
    }
    if (input.keyboard == null) {
      throw new Error("Keyboard input is not defined");
    }

    if (this.firebutton == null) {
      this.firebutton = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
    }
    if (this.rotate_left == null) {
      this.rotate_left = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.LEFT
      );
    }
    if (this.rotate_right == null) {
      this.rotate_left = input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.RIGHT
      );
    }
  }
  update(time: number, delta: number, input: Input.InputPlugin): void {
    if (!this.body) {
      return;
    }

    this.bindKeys(input);

    if (input.keyboard?.checkDown(this.firebutton, 200)) {
      this.fire();
      this.scene.events.emit("playerFired", this);
    }

    if (input.keyboard?.checkDown(this.rotate_left, 0)) {
      this.setRotation(this.rotation + 0.1);
    }
    if (
      input.keyboard?.checkDown(
        input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        0
      )
    ) {
      this.setRotation(this.rotation - 0.1);
    }

    const speed = this.plane_speed;
    var b = this.body as Phaser.Physics.Arcade.Body;
    const angle = b.rotation; // Get the angle in degrees

    // Convert angle to radians
    const rad = Phaser.Math.DegToRad(angle);

    // Calculate velocity components
    const vx = Math.cos(rad) * speed;
    const vy = Math.sin(rad) * speed;

    // Apply velocity to the sprite's body
    b.setVelocity(vx, vy);
    this.scene.physics.world.wrap(this, 0);
  }
}

export default Player;
