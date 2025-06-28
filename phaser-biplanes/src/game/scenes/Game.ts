import { GameObjects, Scene } from "phaser";
import Player from "../entities/player";
import Bullet from "../entities/bullet";
import Cloud from "../entities/cloud";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player1: Player;
  npc: Player;
  instructions: GameObjects.Text;

  playerscoreControl: GameObjects.Text;
  npcscoreControl: GameObjects.Text;

  bulletGroup: Phaser.Physics.Arcade.Group;

  clouds: Cloud[];

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
    if (this.npc) {
      console.warn("NPC already exists, not spawning a new one.");
      this.npc.setPosition(100, Phaser.Math.Between(100, 400));
      this.npc.setVisible(true); // Ensure NPC is visible
      this.npc.setActive(true); // Ensure NPC is active
      this.npc.reset(); // Reset NPC state if needed

      return;
    }
    const y = Phaser.Math.Between(100, 400);
    console.log("Spawning NPC at y:", y);
    this.npc = new Player(this, 100, y, 0xff0000, this.bulletGroup);
    this.npc.name = "npc";
    this.npc.setDepth(50);
  }
  bindEvents() {
    this.events.on("playerScoreUpdated", (player: Player) => {
      if (player === this.player1) {
        this.playerscoreControl.setText(`Player Score: ${player.Score}`);
      } else if (player === this.npc) {
        this.npcscoreControl.setText(`NPC Score: ${player.Score}`);
      }
    });

    this.events.on("planeDestroyed", (player: Player) => {
      console.log("Plane destroyed:", player);
      if (player === this.npc) {
        console.log("NPC plane destroyed, respawning...");
        this.spawnNPC();
      }
      if (player === this.player1) {
        console.log("Player plane destroyed");
        //this.player1.kill();
      }
    });
  }
  create() {
    this.bindEvents();

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x0000a0);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    this.createClouds();
    this.initPhysics();

    this.playerscoreControl = this.add.text(10, 10, "Player Score: 0", {
      fontSize: "20px",
    });
    this.npcscoreControl = this.add.text(10, 40, "NPC Score: 0", {
      fontSize: "20px",
    });
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

    this.spawnPlayer();

    this.spawnNPC();
    this.createGround();

    this.physics.add.collider(this.npc, this.player1, (player, npc) => {
      this.player1.addKill(this.npc); // Add the plane to the player's kill count
      this.npc.addKill(this.player1); // Add the plane to the player's kill count

      this.spawnNPC();
      this.spawnPlayer();
    });
    this.physics.add.collider(this.bulletGroup, this.npc, (plane, bullet) => {
      console.log("Bullet hit NPC plane:", bullet, plane);

      bullet.destroy(); // Destroy the bullet on collision

      this.player1.addKill(plane);
      this.spawnNPC();
    });
  }
  private spawnPlayer() {
    if (!this.player1) {
      this.player1 = new Player(this, 300, 200, 0x00a0ff, this.bulletGroup);
      this.player1.setDepth(1);
      this.player1.name = "player1";
    } else {
      console.warn("Player already exists, not spawning a new one.");
      this.player1.setPosition(300, 200); // Reset position if player already exists
      this.player1.setVisible(true); // Ensure player is visible
      this.player1.setActive(true); // Ensure player is active
      this.player1.reset(); // Reset player state if needed
    }
  }

  createGround() {
    const ground = this.add.rectangle(512, 728, 1024, 80, 0x00ffa0);
    this.physics.add.existing(ground);

    const groundBody = ground.body as Phaser.Physics.Arcade.StaticBody;
    groundBody.setImmovable(true);
    groundBody.setAllowGravity(false);

    this.physics.add.collider(this.player1, ground, (plane) => {
      console.log("Plane hit the ground:", plane);

      this.npc.addKill(plane); // Add the plane to the NPC's kill count
      this.spawnPlayer();
    });
    this.physics.add.collider(this.bulletGroup, ground, (bullet) => {
      if (bullet instanceof Bullet) {
        bullet.destroy(); // Destroy the bullet when it hits the ground
      }
    });
  }
  update(time: number, delta: number) {
    this.physics.world.step(delta);
    this.player1.update(time, delta, this.input);
    this.npc.update(time, delta, this.input);
  }
  createClouds() {
    const cloudCount = 3; // Number of clouds to create
    const cloudPositions = [];
    for (let i = 0; i < cloudCount; i++) {
      const x = Phaser.Math.Between(0, 1024);
      const y = Phaser.Math.Between(0, 468);
      const z = 2; // Random z-index for depth effect
      const numberOfClouds = Phaser.Math.Between(3, 7); // Random number of clouds per position
      cloudPositions.push({ x, y, z, numberOfClouds });
    }

    this.clouds = cloudPositions.map((cp) => {
      const isBig = Phaser.Math.Between(0, 3) > 2; // Randomly decide if clouds should be big or small

      const c = new Cloud(
        this,
        cp.x,
        cp.y,
        isBig ? "cloud-0002" : "cloud-0001"
      );
      c.setDepth(cp.z);
      return c;
    });
  }
}
