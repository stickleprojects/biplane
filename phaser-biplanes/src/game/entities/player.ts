import Phaser from "phaser";

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
}

export default Player;
