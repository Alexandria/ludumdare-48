import Phaser from 'phaser'
import EndCredit from './scenes/Credit';
import GameOver from './scenes/GameOver';
import HowToPlayScreen from './scenes/MenuScreen';

import SpaceLevel from './scenes/SpaceLevel';
import StoryEnd from './scenes/StoryEnd';
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
        }
    },
    scene: [ TitleScreen, HowToPlayScreen, StoryOne, StoryTwo, SpaceLevel, GameOver, StoryEnd, EndCredit,]
};

export default new Phaser.Game(config); 