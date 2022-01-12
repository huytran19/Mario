import { ICollectibleConstructor } from '~/interfaces/collectible.interface';

export default class Collectible extends Phaser.GameObjects.Sprite {
  body!: Phaser.Physics.Arcade.Body;

  // variables
  private currentScene: Phaser.Scene;
  private points: number;
  speed: number;
  typeofContent: string;

  constructor(aParams: ICollectibleConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // variables
    this.currentScene = aParams.scene;
    this.points = aParams.points;
    this.typeofContent = aParams.texture;
    this.initSprite();
    this.currentScene.add.existing(this);
    this.speed = 40;
  }

  private initSprite() {
    // sprite
    this.setOrigin(0, 0);
    this.setFrame(0);

    // physics
    this.currentScene.physics.world.enable(this);
    this.body.setSize(this.width, this.height);
    this.body.setAllowGravity(false);
  }

  update(): void {
    if (this.typeofContent === 'mushroom') {
      if (this.body.blocked.right || this.body.blocked.left) {
        this.speed = -this.speed;
        this.body.velocity.x = this.speed;
      }
    }
  }

  public collected(): void {
    this.destroy();
    this.currentScene.registry.values.score += this.points;
    this.currentScene.events.emit('scoreChanged');
    let scoreText = this.currentScene.add
      .dynamicBitmapText(this.x, this.y - 20, '8bit', this.points.toString(), 4)
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
