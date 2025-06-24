import Phaser, { Input } from "phaser";
import Bullet from "./bullet";

class Plane extends Phaser.GameObjects.Sprite {
  protected plane_speed: number = 0.2; // Speed of the plane
  protected color: number;
  protected bulletGroup: Phaser.Physics.Arcade.Group;

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

  kill() {
    this.scene.events.emit("planeDestroyed", this);
    super.destroy();
  }
  update(time: number, delta: number, input: Input.InputPlugin): void {
    if (!this.body) {
      return;
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

export default Plane;
