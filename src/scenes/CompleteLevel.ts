import Phaser from 'phaser';
import Mario from '~/objects/Mario';

export default class CompleteLevel extends Phaser.Scene {
  private currentLevel!: number;
  private nextLevel!: string;
  private marioState!: number;
  spaceKey!: Phaser.Input.Keyboard.Key;
  constructor() {
    super('complete');
  }
  init() {
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.spaceKey.isDown = false;
  }
  create() {
    const { width, height } = this.scale;
    const x = width * 0.5;
    const y = height * 0.5;

    this.add
      .bitmapText(
        width / 2,
        height / 2,
        '8bit',
        `Level ${this.registry.values.world - 1} completed!`,
        10
      )
      .setOrigin(0.5, 0.5);
  }

  update() {
    if (this.spaceKey.isDown) {
      if (this.registry.values.world <= 3) {
        this.scene.start('game-scene');
        this.scene.start('HudScene');
      } else {
        this.scene.start('menu');
      }
    }
  }
}
