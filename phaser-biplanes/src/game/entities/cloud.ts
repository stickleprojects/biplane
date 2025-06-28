import Phaser from "phaser";

class Cloud extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    imageKey: string = "cloud-0001"
  ) {
    super(scene, x, y, imageKey);

    scene.add.existing(this);

    // const clouds = [];
    // for (let i = 0; i < numberOFClouds; i++) {
    //   const xd = Phaser.Math.Between(-40, 40);
    //   const yd = Phaser.Math.Between(-40, 40);
    //   const c = this.scene.add.sprite(x + xd, y + yd, "cloud-0001");

    //   //c.anims.play({ key: "pulse", repeat: -1, frameRate: 5 });
    //   clouds.push(c);
    // }
    // this.clouds = clouds;
  }
}
export default Cloud;
