import Phaser, { Input } from "phaser";
import Bullet from "./bullet";

class Plane extends Phaser.GameObjects.Sprite {
  protected plane_speed: number = 0.2; // Speed of the plane
  protected color: number;
  protected bulletGroup: Phaser.Physics.Arcade.Group;
  dying: boolean;
  private score: number = 0;
  get Score() {
    return this.score;
  }

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

  addKill(
    plane: (
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
    ) &
      Player
  ) {
    this.score += 1;
    this.scene.events.emit("playerScoreUpdated", this);
  }
  reset() {
    this.dying = false; // Reset dying state
    this.setRotation(0);
    this.anims.play("right1", true);
    this.setVisible(true); // Ensure NPC is visible
    this.setActive(true); // Ensure NPC is active
    this.plane_speed = 0.2; // Reset speed
    this.score = 0;
    this.scene.events.emit("playerScoreUpdated", this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollisionCategory(1); //enable collision
    body.setEnable(true); // Deactivate the body to stop physics interactions
  }
  stop() {
    this.plane_speed = 0; // Stop the plane
  }
  kill() {
    this.stop();
    this.dying = true; // Set dying state to true
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollisionCategory(0); //enable collision
    body.setEnable(true); // Deactivate the body to stop physics interactions

    this.anims.play({
      key: "explosion",
      hideOnComplete: true,
      frameRate: 20, // Frame rate of the explosion animation

      repeat: 0, // Play the animation once 
    }, true).once("animationcomplete", () => {
      this.scene.events.emit("planeDestroyed", this);
    }); // Play explosion animation
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
