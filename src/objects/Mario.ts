import Phaser from 'phaser';
import Bullet from './Bullet';

enum MarioSate {
  Small,
  Adult,
  Superman,
}

export default class Mario extends Phaser.GameObjects.Container {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private mario!: Phaser.GameObjects.Sprite;
  private marioBody!: Phaser.Physics.Arcade.Body;
  private isGrowUp: boolean = false;
  private shootTime: number = 0;
  private climbTime: number = 0;
  private currentScene!: Phaser.Scene;
  private bulletSpeed: number = 50;
  bullet!: Bullet;

  private isDying: boolean = false;
  private isJumping: boolean = false;
  private isSitting: boolean = false;
  private isFalling: boolean = false;
  winning: boolean = false;
  isGoToCastle: boolean = false;
  nextLevel: boolean = false;
  private isVulnerable!: boolean;
  private vulnerableCounter!: number;

  public getVulnerable(): boolean {
    return this.isVulnerable;
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.currentScene = scene;
    this.initSprite();
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  private initSprite() {
    this.mario = this.currentScene.add
      .sprite(0, 0, 'mario')
      .play(`${this.scene.registry.values.state}-idle`)
      .setOrigin(0, 0);
    this.add(this.mario);
    this.currentScene.physics.add.existing(this);
    this.marioBody = this.body as Phaser.Physics.Arcade.Body;
    this.isJumping = false;
    this.isDying = false;
    this.isVulnerable = true;
    this.vulnerableCounter = 100;
  }

  growUp() {
    this.scene.registry.values.state = 1;
    this.mario.play(`${this.scene.registry.values.state}-idle`);
    this.marioBody.setSize(this.mario.width - 4, this.mario.height);
    this.marioBody.setOffset(2, 0);
  }

  superman() {
    this.scene.registry.values.state = 2;
    this.mario.play(`${this.scene.registry.values.state}-idle`);
    this.marioBody.setSize(this.mario.width - 4, this.mario.height);
    this.marioBody.setOffset(2, 0);
  }

  private shrinkMario(): void {
    this.scene.registry.values.state = 0;
    this.mario.play(`${this.scene.registry.values.state}-idle`);
    this.currentScene.sound.play('shrink');
    this.marioBody.setSize(this.mario.width - 4, this.mario.height);
    this.marioBody.setOffset(2, 0);
  }

  preUpdate(t: number, dt: number) {
    if (!this.isDying) {
      this.handleInput(t, dt);
      this.handleAnimation(t, dt);
    } else {
      // this.currentScene.sound.play('die');
      if (this.scene.registry.values.state == 0 && !this.isFalling) {
        this.mario.play('die', true);
        this.isFalling = true;
        this.currentScene.sound.stopAll();
        this.currentScene.sound.play('die');
      }
      if (this.marioBody.y > this.currentScene.sys.canvas.height + 2500) {
        this.currentScene.scene.stop(
          `level${this.scene.registry.values.world}`
        );
        this.scene.registry.values.lives -= 1;
        if (this.scene.registry.values.lives < 0) {
          this.currentScene.scene.stop('HudScene');
          this.currentScene.scene.start('menu');
        } else {
          this.scene.events.emit('livesChanged');
          this.scene.registry.values.state = 0;
          this.currentScene.scene.start('game-scene');
        }
      }
    }

    if (!this.isVulnerable) {
      if (this.vulnerableCounter > 0) {
        this.vulnerableCounter -= 1;
      } else {
        this.vulnerableCounter = 100;
        this.isVulnerable = true;
      }
    }
  }

  handleInput(t: number, dt: number) {
    if (this.marioBody.y > this.currentScene.sys.canvas.height) {
      this.isDying = true;
    }
    if (!this.winning && !this.isGoToCastle) {
      this.shootTime++;

      if (
        this.marioBody.onFloor() ||
        this.marioBody.touching.down ||
        this.marioBody.blocked.down
      ) {
        this.isJumping = false;
      }

      if (this.cursors.up.isDown && !this.isJumping && !this.isSitting) {
        this.marioBody.velocity.y = -260;
        this.isJumping = true;
        if (this.scene.registry.values.state == 0) {
          this.currentScene.sound.play('small-jump');
        } else {
          this.currentScene.sound.play('jump');
        }
      }

      if (!this.isSitting) {
        if (this.cursors.left.isDown) {
          this.marioBody.velocity.x = -120;
          this.mario.scaleX = -1;
          this.mario.setOrigin(1, 0);
        } else if (this.cursors.right.isDown) {
          this.marioBody.velocity.x = 120;
          this.mario.scaleX = 1;
          this.mario.setOrigin(0, 0);
        } else {
          this.marioBody.velocity.x = 0;
        }
      }

      if (
        this.cursors.down.isDown &&
        !this.isSitting &&
        this.scene.registry.values.state != 0
      ) {
        this.isSitting = true;
        this.marioBody.velocity.x = 0;
      } else if (this.cursors.down.isUp) {
        this.isSitting = false;
      }

      if (this.cursors.space.isDown && this.shootTime >= 25) {
        if (this.scene.registry.values.state == 2) {
          this.bullet = this.createBullet();
          this.bullet.body.velocity.x = 250 * this.mario.scaleX;
          this.bullet.play('shoot');
          this.currentScene.sound.play('fireBallShoot');
          this.shootTime = 0;
        }
      }
    }
  }

  handleAnimation(t: number, dt: number) {
    if (!this.winning) {
      if (this.marioBody.velocity.y != 0 && this.isJumping) {
        this.mario.play(`${this.scene.registry.values.state}-jump`);
        this.marioBody.setSize(this.mario.width - 6, this.mario.height);
        this.marioBody.setOffset(4, 0);
      } else if (this.marioBody.velocity.x == 0) {
        if (!this.isSitting) {
          this.mario.play(`${this.scene.registry.values.state}-idle`, true);
          this.marioBody.setSize(this.mario.width - 4, this.mario.height);
          this.marioBody.setOffset(2, 0);
        } else {
          this.mario.play(`${this.scene.registry.values.state}-sit`, true);
          this.marioBody.setSize(this.mario.width - 4, this.mario.height - 9);
          this.marioBody.setOffset(2, 9);
        }
      } else {
        this.mario.play(`${this.scene.registry.values.state}-run`, true);
      }
    } else {
      this.climbTime++;

      if (!this.isGoToCastle) {
        this.mario.play(`${this.scene.registry.values.state}-climb`);
      }
      if (this.climbTime >= 50 && !this.isGoToCastle) {
        this.mario.scaleX = -1;
        this.mario.setOrigin(2, 0);
        this.marioBody.setOffset(16, 0);
        this.climbTime = 0;
        this.isGoToCastle = true;
        this.currentScene.sound.play('clearMap');
      }

      if (this.climbTime >= 100 && this.isGoToCastle) {
        this.mario.scaleX = 1;
        this.marioBody.velocity.x = 120;
        this.mario.setOrigin(0, 0);
        this.marioBody.setOffset(0, 0);
      }
      if (this.marioBody.velocity.x > 0) {
        if (this.climbTime >= 151) {
          this.mario.play(`${this.scene.registry.values.state}-idle`, true);
          this.marioBody.velocity.x = 0;
          this.nextLevel = true;
        } else {
          this.mario.play(`${this.scene.registry.values.state}-run`, true);
        }
      }
    }
  }

  createBullet(): Bullet {
    const _bullet = new Bullet({
      scene: this.currentScene,
      x: this.x + this.mario.width / 2,
      y: this.y + this.mario.height / 2,
      texture: 'Fire-shoot',
    });
    return _bullet;
  }

  public bounceUpAfterHitEnemyOnHead(): void {
    this.isJumping = true;
    this.currentScene.add.tween({
      targets: this,
      props: { y: this.y - 5 },
      duration: 200,
      ease: 'Power1',
      yoyo: true,
    });
  }
  public gotHit(): void {
    this.isVulnerable = false;
    if (this.scene.registry.values.state >= 1) {
      this.shrinkMario();
    } else {
      this.isDying = true;
      this.marioBody.velocity.y = -180;
      this.marioBody.velocity.x = 0;
      this.marioBody.checkCollision.up = false;
      this.marioBody.checkCollision.down = false;
      this.marioBody.checkCollision.right = false;
      this.marioBody.checkCollision.left = false;
    }
  }
}
