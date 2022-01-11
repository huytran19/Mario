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

  public spawnBoxContent(): Collectible {
    this.content = new Collectible({
      scene: this.currentScene,
      x: this.x + 3,
      y: this.y - 11,
      texture: this.boxContent,
      points: 1000,
    });
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

  public popUpCollectible(): void {
    this.content.body.setVelocityX(this.content.speed);
    this.content.body.setAllowGravity(true);
    this.content.body.setGravityY(-300);
  }

  public addCoinAndScore(coin: number, score: number): void {
    this.currentScene.registry.values.coins += coin;
    console.log(this.currentScene.registry.values.score, score);
    this.currentScene.events.emit('coinsChanged');
    this.currentScene.registry.values.score += score;
    this.currentScene.events.emit('scoreChanged');
  }
}
