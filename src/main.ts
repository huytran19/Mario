import Phaser from 'phaser';

import Preload from './scenes/Preload';
import Menu from './scenes/Menu';
import Level1 from './scenes/Level1';
import Level2 from './scenes/Level2';
import Level3 from './scenes/Level3';
import CompleteLevel from './scenes/CompleteLevel';
import { HudScene } from './scenes/HudScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 240,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  },
  scene: [Preload, Menu, Level1, Level2, Level3, CompleteLevel, HudScene],
  scale: {
    zoom: 2,
  },
  backgroundColor: '#48CBF5',
};

export default new Phaser.Game(config);
