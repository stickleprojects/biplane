import Phaser, { Input } from "phaser";
import Bullet from "./bullet";
import Plane from "./plane";

class Player extends Plane {
  private rotate_right: Phaser.Input.Keyboard.Key;
  private firebutton: Phaser.Input.Keyboard.Key;
  private rotate_left: Phaser.Input.Keyboard.Key;
  private bulletSound: Phaser.Sound.BaseSound;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: number,
    bulletGroup: Phaser.Physics.Arcade.Group
  ) {
    super(scene, x, y, color, bulletGroup);
  }

  fire() {
    // Implement firing logic here
    console.log("Firing!");
    // spawn a bullet or perform an action

    if (this.bulletSound == null) {
      this.bulletSound = this.scene.sound.add("gun1", {
        loop: false,
        volume: 0.5,
      });
    }
    if (!this.bulletSound.isPlaying) {
      this.bulletSound.play();
    }

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
    super.update(time, delta, input);
  }
}

export default Player;
