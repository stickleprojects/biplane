import Player from "./player";

class Bullet extends Phaser.GameObjects.Sprite {
  /**
   *
   */
  private movementTween: Phaser.Tweens.Tween;

  constructor(
    parent: Player,

    x: number,
    y: number
  ) {
    super(parent.scene, x, y, "bullet", 0);

    this.setTint(parent.Color);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setRotation(parent.rotation); // Set the bullet's rotation to match the player's
    // calc the destination point based on time
    const distance = 400; // Distance the bullet will travel
    const angle = parent.rotation; // Get the angle in radians
    const destinationX = parent.x + Math.cos(angle) * distance;
    const destinationY = parent.y + Math.sin(angle) * distance;

    // launch it from the front of the plane
    this.setPosition(
      parent.x + Math.cos(this.rotation) * 50,
      parent.y + Math.sin(this.rotation) * 20 - 10
    );

    this.movementTween = this.scene.tweens.add({
      targets: this,
      x: destinationX,
      y: destinationY,
      duration: 200, // Duration in milliseconds
      ease: "Linear",
      onComplete: () => {
        this.destroy(); // Destroy the bullet after it reaches the destination
      },
    });

    this.scene.events.emit("bulletFired", this);
  }
  ondestroy() {
    if (this.movementTween) {
      this.movementTween.stop();
    }
    this.scene.events.emit("bulletDestroyed", this);
  }
}
export default Bullet;
