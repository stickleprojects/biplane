import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  s: GameObjects.Sprite;
  constructor() {
    super("MainMenu");


  }

  initPhysics() {
    this.physics.world.setBounds(0, 0, 1024, 768);
    this.physics.world.setFPS(60);
    this.physics.world.gravity.set(0, 0);
    this.physics.world.setBoundsCollision(true, true, true, true);
  }
  preload() { }
  create() {
    //his.background = this.add.image(512, 384, "background");

    this.initPhysics();

    this.s = this.add
      .sprite(300, 200, "yellowbiplane", 0)
      .setScale(3)
      .setOrigin(0.5, 0.5);

    this.s.play({ key: "right1", repeat: -1 });

    this.physics.add.existing(this.s, false);

    var b = this.s.body as Phaser.Physics.Arcade.Body;
    b.setAllowGravity(false);

    //b.setVelocityX(0.3);
    //    b.setCollideWorldBounds(true);
    ///b.setBounce(1, 1);


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

  update(time: number, delta: number) {
    this.physics.world.step(delta)
    if (
      this.input.keyboard?.checkDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        0
      )
    ) {
      this.s.setRotation(this.s.rotation + 0.1);
    }
    if (
      this.input.keyboard?.checkDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        0
      )
    ) {
      this.s.setRotation(this.s.rotation - 0.1);
    }

    const speed = 0.2; // Adjust as needed
    var b = this.s.body as Phaser.Physics.Arcade.Body;
    const angle = b.rotation; // Get the angle in degrees

    // Convert angle to radians
    const rad = Phaser.Math.DegToRad(angle);

    // Calculate velocity components
    const vx = Math.cos(rad) * speed;
    const vy = Math.sin(rad) * speed;

    // Apply velocity to the sprite's body
    b.setVelocity(vx, vy);
    this.physics.world.wrap(this.s, 0);

  }
}
