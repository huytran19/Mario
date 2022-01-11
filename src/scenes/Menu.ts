import Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
  spaceKey!: Phaser.Input.Keyboard.Key;
  constructor() {
    super('menu');
  }

  init() {
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.spaceKey.isDown = false;
    this.initGlobalDataManager();
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
        'Press SPACE to play first level',
        10
      )
      .setOrigin(0.5, 0.5);
  }

  update(time: number, delta: number): void {
    if (this.spaceKey.isDown) {
      this.scene.start('HudScene');
      this.scene.start('level1');
      this.scene.bringToTop('HudScene');
    }
  }

  private initGlobalDataManager(): void {
    this.registry.set('level', 'level1');
    this.registry.set('world', 1);
    this.registry.set('score', 0);
    this.registry.set('lives', 2);
    this.registry.set('spawn', { x: 12, y: 44, dir: 'down' });
  }
}
