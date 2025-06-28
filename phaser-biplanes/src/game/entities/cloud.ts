import Player from "./player";

class Cloud extends Phaser.GameObjects.Sprite {
    clouds: any;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        numberOFClouds: number = 6
    ) {
        super(scene, x, y, "cloud", 0);


        const clouds = [];
        for (let i = 0; i < numberOFClouds; i++) {
            const xd = Phaser.Math.Between(-40, 40);
            const yd = Phaser.Math.Between(-40, 40);
            const c = this.scene.add.circle(x + xd, y + yd, 50, 0xffffff);
            clouds.push(c);
        }
        this.clouds = clouds;


    }

}
export default Cloud;
