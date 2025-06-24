import { GameObjects, Scene } from "phaser";
import Player from "../entities/player";
import Bullet from "../entities/bullet";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player1: Player;
  npc: Player;
  instructions: GameObjects.Text;

  bulletGroup: Phaser.Physics.Arcade.Group;
  planeGroup: Phaser.Physics.Arcade.Group;

  initPhysics() {
    this.physics.world.setBounds(0, 0, 1024, 768);
    this.physics.world.setFPS(60);
    this.physics.world.gravity.set(0, 0);
    this.physics.world.setBoundsCollision(true, true, true, true);
  }
  constructor() {
    super("Game");
  }

  spawnNPC() {
    const y = Phaser.Math.Between(100, 668);
    this.npc = new Player(this, 100, y, 0xff0000, this.bulletGroup);

    this.planeGroup.add(this.npc);
  }
  bindEvents() {
    this.events.on("playerFired", (player: Player) => {
      //console.log("Player fired:", player);
      // Implement firing logic here
    });

    this.events.on("planeDestroyed", (player: Player) => {
      if (player === this.npc) {
        console.log("NPC plane destroyed, respawning...");
        this.spawnNPC();
      }
      // Implement player destruction logic here
    });
  }
  create() {
    this.bindEvents();

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x0000a0);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    this.initPhysics();

    this.instructions = this.add.text(
      100,
      100,
      "Use left/right arrows to steer the plane.\nClick to end the game."
    );

    this.bulletGroup = this.physics.add.group({
      classType: Bullet,
      defaultKey: "bullet",
      maxSize: 10,
    });

    this.planeGroup = this.physics.add.group({
      classType: Player,
      defaultKey: "plane",
      maxSize: 10,
    });

    this.player1 = new Player(this, 300, 200, 0x00a0ff, this.bulletGroup);

    this.planeGroup.add(this.player1);

    this.spawnNPC();

    this.physics.add.collider(
      this.bulletGroup,
      this.planeGroup,
      (bullet, plane) => {
        if (!(bullet instanceof Bullet)) {
          return false;
        }
        if (!(plane instanceof Player)) {
          return false;
        }
        if (bullet.Parent === plane) {
          // Prevent collision with itself
          return false;
        }

        // Handle collision between bullet and plane
        console.log("Bullet hit a plane:", plane);
        bullet.destroy(); // Destroy the bullet on collision
        if (plane == this.player1) {
          // If the plane is a player, you can handle player damage or other logic here
          console.log("Player hit by bullet!");
        } else {
          plane.kill();
        }
      }
    );
  }
  update(time: number, delta: number) {
    this.physics.world.step(delta);
    this.player1.update(time, delta, this.input);
    this.npc.update(time, delta, this.input);
  }
}
