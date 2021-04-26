import Phaser from 'phaser'
import Title from 'url:../assets/ui/CaelumCore_UI_Menu.png'
import restart from 'url:../assets/ui/restartButton.png'
import titleScreen from 'url:../assets/ui/titleButton.png'

export default class TitleScreen extends Phaser.Scene {

    
    constructor(){
        super('title')
    }

    preload =()=>
    {
        this.load.image("titleScreen", Title)

              
    }

    create = () =>
    {
      
      this.add.image(400,300,"titleScreen").setInteractive().on(Phaser.Input.Events.POINTER_DOWN, ()=> {
        console.log("restart clicked!")
        this.scene.start('controls')
      })

    }

 
    update = () => {
 

    }
}