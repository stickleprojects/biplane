import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.audio("explosion", "assets/sounds/explosion.mp3");
    this.load.audio("gun1", "assets/sounds/gun1.mp3");

    //  Load the assets for the game - Replace with your own assets
    this.load.aseprite(
      "yellowbiplane",
      "assets/yellowbiplane.png",
      "assets/yellowbiplane.json"
    );
    this.load.aseprite("bullet", "assets/bullet.png", "assets/bullet.json");

    this.load.aseprite(
      "cloud-0001",
      "assets/cloud-0001.png",
      "assets/cloud-0001.json"
    );
    this.load.image(
      "cloud-0002",
      "assets/cloud-0002.png"
      //"assets/cloud-0002.json"
    );
    this.load.aseprite(
      "explosion",
      "assets/explosion.png",
      "assets/explosion.json"
    );
  }

  create() {
    this.anims.createFromAseprite("yellowbiplane");

    this.anims.createFromAseprite("explosion");

    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

    this.scene.start("Game");
  }
}
