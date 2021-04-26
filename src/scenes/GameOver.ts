import { Console } from 'node:console'
import Phaser from 'phaser'
import GameOverScreen from 'url:../assets/ui/CaelumCore_UI_GameOver.png'
import restart from 'url:../assets/ui/restartButton.png'
import titleScreen from 'url:../assets/ui/titleButton.png'


const musicPath = require('url:../assets/music/fail_theme.wav');

export default class GameOver extends Phaser.Scene {

    
    constructor(){
        super('game-over')
    }

    preload =()=>
    {
        this.load.image("gameOverScreen",GameOverScreen)
        this.load.image("restart",restart)
        this.load.image("titelScreen",titleScreen)
        this.load.audio("fail-theme", musicPath)

      
        
    }

    create = () =>
    {
        const {width, height } = this.scale

        this.sound.removeByKey('music');
        const theme = this.sound.add('fail-theme',{loop:true} )
        theme.play()
      
      this.add.image(400,300,"gameOverScreen").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, ()=> {
        this.scene.start('space-level')
      })
    }

 
    update = () => {
 

    }
}