import { debug } from 'node:console';
import Phaser from 'phaser'

import HellowWorldScene from './scenes/HelloWorldScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 520,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug:true
        }
    },
    scene: [HellowWorldScene]
};

export default new Phaser.Game(config); 