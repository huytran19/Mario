import Phaser from 'phaser';
import Collectible from './Collectible';
import { IBoxConstructor } from '~/interfaces/box.interface';

export default class Box extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body;

  private currentScene: Phaser.Scene;
  private boxContent!: string;
  private content!: Collectible;
  private hitBoxTimeline!: Phaser.Tweens.Timeline;

  public getContent(): Phaser.GameObjects.Sprite {
    return this.content;
  }

  public getBoxContentString(): string {
    return this.boxContent;
  }

  constructor(aParams: IBoxConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.currentScene = aParams.scene;
    this.boxContent = aParams.content;

    this.initSprite();
    this.currentScene.add.existing(this);
  }

  initSprite() {
    this.hitBoxTimeline = this.currentScene.tweens.createTimeline({});
    this.setOrigin(0, 0);
    this.currentScene.physics.world.enable(this);
    const boxBody = this.body as Phaser.Physics.Arcade.Body;
    boxBody.setSize(13, 13);
    boxBody.setAllowGravity(false);
    boxBody.setImmovable(true);
  }
  marioHitBox() {
    this.hitBoxTimeline.add({
      targets: this,
      props: { y: this.y - 10 },
      duration: 60,
      ease: 'Power0',
      yoyo: true,
      onComplete: () => {
        this.active = false;
        this.setTexture('emptybox');
      },
    });
  }

  public spawnBoxContent(isChange: boolean, newTexture: string): Collectible {
    if (isChange && this.boxContent === 'mushroom') {
      this.content = new Collectible({
        scene: this.currentScene,
        x: this.x + 3,
        y: this.y - 11,
        texture: newTexture,
        points: 1000,
      });
    } else {
      this.content = new Collectible({
        scene: this.currentScene,
        x: this.x + 3,
        y: this.y - 11,
        texture: this.boxContent,
        points: 1000,
      });
    }
    return this.content;
  }

  public tweenBoxContent(
    props: {},
    duration: number,
    complete: () => void
  ): void {
    this.hitBoxTimeline.add({
      targets: this.content,
      props: props,
      delay: 0,
      duration: duration,
      ease: 'Power0',
      onComplete: complete,
    });
  }

  public startHitTimeline(): void {
    this.hitBoxTimeline.play();
  }

  public popUpCollectible(isChange: boolean): void {
    this.content.body.setAllowGravity(true);
    this.content.body.setGravityY(-250);
    this.currentScene.sound.play('powerUpAppears');
    if (isChange) {
      this.content.x -= 3;
      this.content.body.setVelocityX(0);
    } else {
      this.content.body.setVelocityX(this.content.speed);
    }
  }

  public addCoinAndScore(coin: number, score: number): void {
    this.scene.sound.play('coin');
    this.currentScene.registry.values.coins += coin;
    this.currentScene.events.emit('coinsChanged');
    this.currentScene.registry.values.score += score;
    this.currentScene.events.emit('scoreChanged');
    let scoreText = this.currentScene.add
      .dynamicBitmapText(this.x, this.y - 20, '8bit', score.toString(), 4)
      .setOrigin(0, 0);

    this.currentScene.add.tween({
      targets: scoreText,
      props: { y: scoreText.y - 40 },
      duration: 800,
      ease: 'Power0',
      yoyo: false,
      onComplete: function () {
        scoreText.destroy();
      },
    });
  }
}
