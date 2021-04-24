import { debug } from 'node:console';
import Phaser from 'phaser'

import SpaceLevel from './scenes/SpaceLevel';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug:true
        }
    },
    scene: [SpaceLevel]
};

export default new Phaser.Game(config); 