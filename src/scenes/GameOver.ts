import { Console } from 'node:console'
import Phaser from 'phaser'
import GameOverScreen from 'url:../assets/ui/CaelumCore_UI_GameOver.png'
import restart from 'url:../assets/ui/restartButton.png'
import titleScreen from 'url:../assets/ui/titleButton.png'

export default class GameOver extends Phaser.Scene {

    
    constructor(){
        super('game-over')
    }

    preload =()=>
    {
        this.load.image("gameOverScreen",GameOverScreen)
        this.load.image("restart",restart)
        this.load.image("titelScreen",titleScreen)

      
        
    }

    create = () =>
    {
        const {width, height } = this.scale
      
      this.add.image(400,300,"gameOverScreen")
      this.add.sprite(400,300,"titelScreen").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN , (ptr,img)=> {
          console.log({img})
        console.log("Title clicked!")
        // this.scene.start('title')
     })
      this.add.image(400,300,"restart").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (ptr, img)=> {
        console.log({img})
        console.log({ptr})
        console.log(img.getData)
        console.log("restart clicked!")
        this.scene.start('space-level')
      })
    }

 
    update = () => {
 

    }
}