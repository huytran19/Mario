export class HudScene extends Phaser.Scene {
  private textElements!: Map<string, Phaser.GameObjects.BitmapText>;
  private level!: Phaser.Scene;
  constructor() {
    super({
      key: 'HudScene',
    });
  }

  create(): void {
    this.textElements = new Map([
      [
        'LIVES',
        this.add.bitmapText(
          0,
          0,
          '8bit',
          `Lives ${this.registry.get('lives')}`,
          8
        ),
      ],
      // ['WORLDTIME', this.addText(80, 0, `${this.registry.get('worldTime')}`)],
      [
        'SCORE',
        this.add.bitmapText(
          0,
          16,
          '8bit',
          `Score ${this.registry.get('score')}`,
          8
        ),
      ],
      // ['COINS', this.addText(80, 8, `${this.registry.get('coins')}`)],
      [
        'WORLD',
        this.add.bitmapText(
          100,
          0,
          '8bit',
          `Map ${this.registry.get('world')}`,
          8
        ),
      ],
    ]);

    // create events
    this.level = this.scene.get('game-scene');
    // level.events.on('coinsChanged', this.updateCoins, this);
    this.level.events.on('scoreChanged', this.updateScore, this);
    this.level.events.on('livesChanged', this.updateLives, this);
  }
  update() {}
  private updateScore() {
    this.textElements
      .get('SCORE')!
      .setText(`Score ${this.registry.get('score')}`);
  }
  private updateLives() {
    this.textElements
      .get('LIVES')!
      .setText(`Lives ${this.registry.get('lives')}`);
  }
}
