import Phaser from 'phaser';

import Preload from './scenes/Preload';
import Menu from './scenes/Menu';
import GameScene from './scenes/GameScene';
import CompleteLevel from './scenes/CompleteLevel';
import { HudScene } from './scenes/HudScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 240,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  scene: [Preload, Menu, GameScene, CompleteLevel, HudScene],
  scale: {
    zoom: 2,
  },
  backgroundColor: '#48CBF5',
  audio: {
    disableWebAudio: true,
  },
};

export default new Phaser.Game(config);
