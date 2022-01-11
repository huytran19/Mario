import { IBulletConstructor } from '~/interfaces/bullet.interface';

export default class Bullet extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  private currentScene!: Phaser.Scene;
  speed!: number;
  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.currentScene = aParams.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    this.setOrigin(0, 0);
    this.setFrame(0);

    this.currentScene.physics.world.enable(this);
    this.body.setSize(this.width, this.height);
  }

  destroyBullet() {
    this.destroy();
  }
}
