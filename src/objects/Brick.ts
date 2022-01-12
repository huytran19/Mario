import { IBrickConstructor } from '~/interfaces/brick.interface';

export default class Brick extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body;

  // variables
  private currentScene: Phaser.Scene;
  protected destroyingValue: number;
  private hitBoxTimeline!: Phaser.Tweens.Timeline;
  isDestroying!: boolean;
  constructor(aParams: IBrickConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // variables
    this.currentScene = aParams.scene;
    this.destroyingValue = aParams.value;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    // sprite
    this.setOrigin(0, 0);
    this.setFrame(0);
    this.isDestroying = false;
    // physics
    this.currentScene.physics.world.enable(this);
    this.body.setSize(13, 13);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  public marioHitBrick(): void {
    this.hitBoxTimeline = this.currentScene.tweens.createTimeline({});
    this.hitBoxTimeline.add({
      targets: this,
      props: { y: this.y - 10 },
      duration: 60,
      ease: 'Power0',
      yoyo: true,
    });
  }

  public startHitTimeline(): void {
    this.hitBoxTimeline.play();
    this.currentScene.sound.play('bump');
  }

  public brickDestroy(): void {
    let smallBrick1 = this.currentScene.physics.add
      .sprite(this.x, this.y, 'breakbrick1')
      .setOrigin(0, 0);
    let smallBrick2 = this.currentScene.physics.add
      .sprite(this.x + 8, this.y, 'breakbrick2')
      .setOrigin(0, 0);
    let smallBrick3 = this.currentScene.physics.add
      .sprite(this.x, this.y + 8, 'breakbrick1')
      .setOrigin(0, 0);
    let smallBrick4 = this.currentScene.physics.add
      .sprite(this.x + 8, this.y + 8, 'breakbrick2')
      .setOrigin(0, 0);

    smallBrick1.setVelocity(-40, -50);
    smallBrick2.setVelocity(40, -50);
    smallBrick3.setVelocity(-30, -45);
    smallBrick4.setVelocity(30, -45);
    this.currentScene.sound.play('brickSmash');
    this.isDestroying = true;
    this.destroy();
  }
}
