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
  init(data) {
    this.currentLevel = data.level;
    this.marioState = data.marioState;
    if (this.currentLevel == 3) {
      this.nextLevel = 'menu';
    } else {
      this.nextLevel = `level${this.currentLevel + 1}`;
    }

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
        `Level ${this.currentLevel} completed!`,
        10
      )
      .setOrigin(0.5, 0.5);
  }

  update() {
    if (this.spaceKey.isDown) {
      this.scene.start(this.nextLevel, { marioState: this.marioState });
    }
  }
}
