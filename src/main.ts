import Phaser from 'phaser'
import GameOver from './scenes/GameOver';
import HowToPlayScreen from './scenes/MenuScreen';

import SpaceLevel from './scenes/SpaceLevel';
import StoryOne from './scenes/StoryOne';
import StoryTwo from './scenes/StoryTwo';
import TitleScreen from './scenes/TitleScreen';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            // debug:true,            
        }
    },
    scene: [ TitleScreen, HowToPlayScreen, StoryOne, StoryTwo, SpaceLevel, GameOver]
};

export default new Phaser.Game(config); 