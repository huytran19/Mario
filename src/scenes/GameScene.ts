import Phaser, { Physics } from 'phaser';
import Box from '~/objects/Box';
import Brick from '~/objects/Brick';
import Bullet from '~/objects/Bullet';
import Collectible from '~/objects/Collectible';
import Flagpole from '~/objects/FlagPole';
import Goomba from '~/objects/Goomba';
import Mario from '~/objects/Mario';

export default class GameScene extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private ground!: Phaser.Tilemaps.TilemapLayer;
  private mario!: Mario;
  private boxes!: Phaser.GameObjects.Group;
  private bricks!: Phaser.GameObjects.Group;
  private bullets!: Phaser.GameObjects.Group;
  private collectibles!: Phaser.GameObjects.Group;
  private enemies!: Phaser.GameObjects.Group;
  private headstick!: Phaser.GameObjects.Sprite;
  private flagPole!: Flagpole;

  constructor() {
    super('game-scene');
  }

  create() {
    this.sound.play('soundtrack');
    this.map = this.make.tilemap({ key: `map${this.registry.values.world}` });
    this.tileset = this.map.addTilesetImage('world', 'tiles');
    this.ground = this.map.createLayer('Ground', this.tileset);
    this.ground.setCollisionByProperty({ collides: true });
    this.add.image(3272, 168, 'castle');
    this.mario = new Mario(
      this,
      this.scene.scene.registry.values.spawn.x,
      this.scene.scene.registry.values.spawn.y
    );
    this.add.existing(this.mario);

    this.boxes = this.add.group({
      runChildUpdate: true,
    });
    this.bricks = this.add.group({
      runChildUpdate: true,
    });
    this.collectibles = this.add.group({
      runChildUpdate: true,
    });
    this.bullets = this.add.group({
      runChildUpdate: true,
    });
    this.enemies = this.add.group({
      runChildUpdate: true,
    });
    this.loadObjectsFromTilemap();

    this.flagPole = new Flagpole(
      this,
      this.headstick.x + 3,
      this.headstick.y + this.headstick.height
    );
    this.add.existing(this.flagPole);

    this.physics.add.collider(this.mario, this.ground);
    this.physics.add.collider(
      this.mario,
      this.boxes,
      this.handleMarioHitBox,
      undefined,
      this
    );
    this.physics.add.collider(
      this.mario,
      this.bricks,
      this.handleMarioHitBrick,
      undefined,
      this
    );
    this.physics.add.collider(
      this.collectibles,
      this.ground,
      this.handleMushroomHitPipe,
      undefined,
      this
    );
    this.physics.add.collider(this.collectibles, this.bricks);
    this.physics.add.collider(this.collectibles, this.boxes);
    this.physics.add.collider(this.enemies, this.ground);
    this.physics.add.collider(this.enemies, this.bricks);
    this.physics.add.collider(this.enemies, this.boxes);
    this.physics.add.overlap(
      this.mario,
      this.collectibles,
      this.handlePlayerCollectiblesOverlap,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      this.handleBulletHitEnemy,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.mario,
      this.enemies,
      this.handleMarioEnemyOverlap,
      undefined,
      this
    );
    this.physics.add.collider(
      this.bullets,
      this.ground,
      this.handleBulletHitSomething,
      undefined,
      this
    );
    this.physics.add.collider(
      this.bullets,
      this.boxes,
      this.handleBulletHitSomething,
      undefined,
      this
    );
    this.physics.add.collider(
      this.bullets,
      this.bricks,
      this.handleBulletHitSomething,
      undefined,
      this
    );

    this.physics.add.collider(
      this.mario,
      this.flagPole,
      this.handleMarioWin,
      undefined,
      this
    );
    this.cameras.main.startFollow(this.mario);
    this.cameras.main.setBounds(
      0,
      0,
      Number.MAX_SAFE_INTEGER,
      this.scale.height
    );
  }

  update() {
    if (this.registry.values.state == 2) {
      if (this.mario.bullet) {
        this.bullets.add(this.mario.bullet);
      }
      this.bullets.getChildren().forEach((bullet) => {
        const body = bullet.body as Phaser.Physics.Arcade.Body;
      });
    }
    if (this.mario.nextLevel) {
      this.scene.scene.registry.values.world += 1;
      this.scene.start('complete');
      this.scene.stop('HudScene');
    }
  }

  private loadObjectsFromTilemap() {
    const objects = this.map.getObjectLayer('Objects').objects as any[];

    objects.forEach((object) => {
      if (object.type === 'box') {
        this.boxes.add(
          new Box({
            scene: this,
            content: object.properties[0].value,
            x: object.x,
            y: object.y - object.height,
            texture: 'box',
          })
        );
      }

      if (object.type === 'brick') {
        this.bricks.add(
          new Brick({
            scene: this,
            x: object.x,
            y: object.y - object.height,
            texture: 'brick',
            value: 50,
          })
        );
      }

      if (object.type === 'head-stick') {
        this.headstick = this.add.sprite(object.x + 4, object.y, 'headstick');
        this.headstick.setOrigin(0, 0);
      }

      if (object.type === 'goomba') {
        this.enemies.add(
          new Goomba({
            scene: this,
            x: object.x,
            y: object.y - object.height * 0.5,
            texture: 'goomba',
          })
        );
      }
    });
  }

  handleMarioHitBox(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const mario = obj1 as Mario;
    const box = obj2 as Box;
    const bodyBox = box.body as Phaser.Physics.Arcade.Body;
    if (bodyBox.touching.down && box.active) {
      box.marioHitBox();
      let isChange;
      if (this.registry.values.state == 0) {
        isChange = false;
      } else {
        isChange = true;
      }
      this.collectibles.add(box.spawnBoxContent(isChange, 'flower'));
      switch (box.getBoxContentString()) {
        case 'coin': {
          box.tweenBoxContent({ y: box.y - 40, alpha: 0 }, 700, function () {
            box.getContent().destroy();
          });
          box.addCoinAndScore(1, 100);
          break;
        }
        case 'mushroom': {
          box.popUpCollectible(isChange);

          break;
        }
      }
      box.startHitTimeline();
    }
  }

  handleMarioHitBrick(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const mario = obj1 as Mario;
    const brick = obj2 as Brick;
    const bodyBrick = brick.body as Phaser.Physics.Arcade.Body;
    if (bodyBrick.touching.down) {
      if (this.registry.values.state == 0) {
        brick.marioHitBrick();
        brick.startHitTimeline();
      } else {
        this.physics.overlap(
          this.enemies,
          obj2,
          this.handleEnemyBrickOverlap,
          undefined,
          this
        );
        brick.brickDestroy();
      }
    }
  }

  handleMushroomHitPipe(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const mushroom = obj1 as Collectible;
    const mushroomBody = mushroom.body as Phaser.Physics.Arcade.Body;
    if (mushroomBody.touching.down) {
      mushroomBody.velocity.x *= -1;
    }
  }

  handlePlayerCollectiblesOverlap(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const mario = obj1 as Mario;
    const collectible = obj2 as Collectible;
    if (
      collectible.typeofContent === 'mushroom' ||
      collectible.typeofContent === 'flower'
    ) {
      this.sound.play('powerUp');
      if (this.registry.values.state == 0) {
        mario.growUp();
      } else if (this.registry.values.state == 1) {
        mario.superman();
      }
    }

    collectible.collected();
  }

  handleBulletHitSomething(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const bullet = obj1 as Bullet;
    const body = bullet.body as Phaser.Physics.Arcade.Body;
    if (body) {
      if (body.blocked.down!) {
        body.velocity.y = -125;
      } else {
        bullet.destroyBullet();
      }
    } else {
      bullet.destroyBullet();
    }
  }

  handleMarioWin(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const mario = obj1 as Phaser.GameObjects.Sprite;
    const body = mario.body as Phaser.Physics.Arcade.Body;
    this.mario.winning = true;
    this.sound.stopAll();
    this.sound.play('downFlagPole');
    const flagpole = obj2 as Flagpole;
    flagpole.addScore(2000);
    setTimeout(() => {
      const poleBody = this.flagPole.body as Phaser.Physics.Arcade.Body;
      poleBody.setSize(3, 0);
    }, 800);
  }

  handleMarioEnemyOverlap(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const mario = obj1 as Mario;
    const body = mario.body as Phaser.Physics.Arcade.Body;
    const goomba = obj2 as Goomba;
    const bodyGoomba = goomba.body as Phaser.Physics.Arcade.Body;
    if (mario.getVulnerable()) {
      if (body.touching.down && bodyGoomba.touching.up) {
        // player hit enemy on top
        mario.bounceUpAfterHitEnemyOnHead();
        goomba.gotHitOnHead();
        this.add.tween({
          targets: goomba,
          props: { alpha: 0 },
          duration: 1000,
          ease: 'Power0',
          yoyo: false,
          onComplete: () => {
            goomba.isDead();
          },
        });
      } else {
        if (mario.getVulnerable()) {
          mario.gotHit();
        }
      }
    }
  }
  handleBulletHitEnemy(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const bullet = obj1 as Bullet;
    const enemy = obj2 as Goomba;
    const bulletBody = bullet.body as Phaser.Physics.Arcade.Body;
    const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
    if (bulletBody) {
      if (
        (bulletBody.touching.down && enemyBody.touching.up) ||
        (bulletBody.touching.right && enemyBody.touching.left) ||
        (bulletBody.touching.left && enemyBody.touching.right)
      ) {
        enemy.gotHitByBullet();
        this.add.tween({
          targets: enemy,
          props: { alpha: 0 },
          duration: 1000,
          ease: 'Power0',
          yoyo: false,
          onComplete: () => {
            enemy.isDead();
          },
        });
        bullet.destroyBullet();
      }
    }
  }
  handleEnemyBrickOverlap(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const goomba = obj1 as Goomba;
    const brick = obj2 as Brick;
    goomba.gotHitByBreakBrick();
    this.add.tween({
      targets: goomba,
      props: { alpha: 0 },
      duration: 1000,
      ease: 'Power0',
      yoyo: false,
      onComplete: () => {
        goomba.isDead();
      },
    });
  }
}
