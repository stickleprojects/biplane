import Phaser, { Input } from "phaser";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "yellowbiplane", 0);
    this.setScale(3).setOrigin(0.5, 0.5);
    this.play({ key: "right1", repeat: -1 });

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
  }

  update(time: number, delta: number, input: Input.InputPlugin): void {
    if (
      input.keyboard?.checkDown(
        input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        0
      )
    ) {
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

    const speed = 0.2; // Adjust as needed
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
