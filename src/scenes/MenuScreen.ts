import Phaser from 'phaser'
import Controls from 'url:../assets/ui/CaelumCore_UI_Menu_HowToPlay.png'
import restart from 'url:../assets/ui/restartButton.png'
import titleScreen from 'url:../assets/ui/titleButton.png'

export default class HowToPlayScreen extends Phaser.Scene {

    
    constructor(){
        super('controls')
    }

    preload =()=>
    {
        this.load.image("controls", Controls)

              
    }

    create = () =>
    {
      
      this.add.image(400,300,"controls").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, ()=> {
        console.log("restart clicked!")
        this.scene.start('space-level')
      })


    }

 
    update = () => {
 

    }
}