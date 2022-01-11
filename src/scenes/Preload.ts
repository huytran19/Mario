import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    this.load.image('tiles', 'Tilesets/OverWorld.png');
    this.load.image('castle', 'Tilesets/Castle.png');
    this.load.tilemapTiledJSON('map1', 'Tilesets/map1.json');
    this.load.tilemapTiledJSON('map2', 'Tilesets/map2.json');
    this.load.tilemapTiledJSON('map3', 'Tilesets/map3.json');
    this.load.atlas(
      'Mario',
      'Characters/Mario/Mario.png',
      'Characters/Mario/Mario.json'
    );

    this.load.atlas(
      'Fire-shoot',
      'Misc/fire-shoot.png',
      'Misc/fire-shoot.json'
    );
    this.load.image('box', 'Tilesets/box.png');
    this.load.image('emptybox', 'Tilesets/emptybox.png');
    this.load.image('brick', 'Tilesets/brick.png');
    this.load.image('breakbrick1', 'Tilesets/breakbrick1.png');
    this.load.image('breakbrick2', 'Tilesets/breakbrick2.png');
    this.load.image('mushroom', 'Misc/mushroom.png');
    this.load.image('coin', 'Misc/coin.png');
    this.load.image('headstick', 'Misc/top-stick.png');
    this.load.image('stick', 'Misc/stick.png');
    this.load.bitmapFont('8bit', 'font/8bit.png', 'font/8bit.fnt');
    this.load.atlas(
      'goomba',
      'Characters/Enemies/Goomba.png',
      'Characters/Enemies/Goomba.json'
    );
    this.load.atlas(
      'turtle',
      'Characters/Enemies/Turtle.png',
      'Characters/Enemies/Turtle.json'
    );
  }

  create() {
    this.anims.create({
      key: '0-idle',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Idle-1.png',
        },
      ],
    });
    this.anims.create({
      key: '1-idle',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Idle-5.png',
        },
      ],
    });
    this.anims.create({
      key: '2-idle',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Idle-6.png',
        },
      ],
    });

    this.anims.create({
      key: 'grow-up',
      frames: this.anims.generateFrameNames('Mario', {
        start: 1,
        end: 5,
        prefix: 'Mario-Idle-',
        suffix: '.png',
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: 'die',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Small-Die.png',
        },
      ],
    });

    this.anims.create({
      key: '0-run',
      frames: this.anims.generateFrameNames('Mario', {
        start: 3,
        end: 1,
        prefix: 'Mario-Small-Run-',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: '1-run',
      frames: this.anims.generateFrameNames('Mario', {
        start: 3,
        end: 1,
        prefix: 'Mario-Run-',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: '2-run',
      frames: this.anims.generateFrameNames('Mario', {
        start: 3,
        end: 1,
        prefix: 'Mario-W-Run-',
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: '0-jump',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Small-Jump.png',
        },
      ],
    });
    this.anims.create({
      key: '1-jump',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Jump.png',
        },
      ],
    });
    this.anims.create({
      key: '2-jump',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-W-Jump.png',
        },
      ],
    });

    this.anims.create({
      key: '1-sit',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Sit.png',
        },
      ],
    });
    this.anims.create({
      key: '2-sit',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-W-Sit.png',
        },
      ],
    });

    this.anims.create({
      key: '0-climb',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Small-Climb.png',
        },
      ],
    });
    this.anims.create({
      key: '1-climb',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-Climb.png',
        },
      ],
    });
    this.anims.create({
      key: '2-climb',
      frames: [
        {
          key: 'Mario',
          frame: 'Mario-W-Climb.png',
        },
      ],
    });

    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNames('Fire-shoot', {
        start: 1,
        end: 4,
        prefix: 'fire-bullet-',
        suffix: '.png',
      }),
      frameRate: 7.5,
      repeat: -1,
    });

    this.anims.create({
      key: 'goombaWalk',
      frames: this.anims.generateFrameNames('goomba', {
        start: 1,
        end: 2,
        prefix: 'Goomba-',
        suffix: '.png',
      }),
      frameRate: 7.5,
      repeat: -1,
    });

    this.anims.create({
      key: 'goombaDie',
      frames: [
        {
          key: 'goomba',
          frame: 'Goomba-die.png',
        },
      ],
    });
    this.scene.start('menu');
  }
}
