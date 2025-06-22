import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  s: GameObjects.Sprite;
  constructor() {
    super("MainMenu");
  }

  preload() {}
  create() {
    //his.background = this.add.image(512, 384, "background");

    this.s = this.add
      .sprite(300, 200, "yellowbiplane", 0)
      .setScale(4)
      .setOrigin(0, 0);

    this.s.play({ key: "right1", repeat: -1 });

    // this.title = this.add
    //   .text(512, 460, "Main Menu", {
    //     fontFamily: "Arial Black",
    //     fontSize: 38,
    //     color: "#ffffff",
    //     stroke: "#000000",
    //     strokeThickness: 8,
    //     align: "center",
    //   })
    //   .setOrigin(0.5);

    //    this.add.sprite(512, 600, "yellow-biplane").play("yellow-biplane");

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
