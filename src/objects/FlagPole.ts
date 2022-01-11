import Phaser from 'phaser';

export default class Flagpole extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const pole = scene.add.image(0, 0, 'stick').setOrigin(0, 0);
    pole.setDisplaySize(pole.width, 152);

    this.add(pole);

    scene.physics.add.existing(this, true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.width + 1, this.height + 156);
    body.setOffset(35, 28);
  }
}
