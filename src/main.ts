import Phaser from 'phaser'

import SpaceLevel from './scenes/SpaceLevel';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            // debug:true,
            gravity: {y:2 }
            
        }
    },
    scene: [SpaceLevel]
};

export default new Phaser.Game(config); 