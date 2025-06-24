import Phaser, { Input } from "phaser";

class Player extends Phaser.GameObjects.Sprite {
  private rotate_left: Phaser.Input.Keyboard.Key;
  private rotate_right: Phaser.Input.Keyboard.Key;
  private firebutton: Phaser.Input.Keyboard.Key;

  private bullet;
  private bullet_speed: number = 4.2; // Speed of the bullet
  private plane_speed: number = 0.2; // Speed of the plane

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "yellowbiplane", 0);
    this.setScale(3).setOrigin(0.5, 0.5);
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

    const bullet = this.scene.add.circle(
      this.x,
      this.y,
      4,
      0x000000
    ) as Phaser.GameObjects.Shape;
    this.scene.add.existing(bullet);
    this.scene.physics.add.existing(bullet);

    bullet.setRotation(this.rotation); // Set the bullet's rotation to match the player's
    // calc the destination point based on time
    const distance = 400; // Distance the bullet will travel
    const angle = this.rotation; // Get the angle in radians
    const destinationX = this.x + Math.cos(angle) * distance;
    const destinationY = this.y + Math.sin(angle) * distance;

    // launch it from the front of the plane
    bullet.setPosition(
      this.x + Math.cos(this.rotation) * 50,
      this.y + Math.sin(this.rotation) * 20 - 10
    );

    this.scene.tweens.add({
      targets: bullet,
      x: destinationX,
      y: destinationY,
      duration: 200, // Duration in milliseconds
      ease: "Linear",
      onComplete: () => {
        bullet.destroy(); // Destroy the bullet after it reaches the destination
      },
    });

    this.scene.events.emit("bulletFired", bullet);
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
