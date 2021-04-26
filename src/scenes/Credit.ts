import Phaser from 'phaser'
import StoryCreditScreen from 'url:../assets/ui/CaelumCore_UI_Credits.png'


export default class EndCredit extends Phaser.Scene {

    constructor(){
        super('credit-scene')
    }

    preload =()=>
    {
        this.load.image("storyCredits", StoryCreditScreen)
            
    }

    create = () =>
    {
         
      this.add.image(400,300,"storyCredits").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, ()=> {
        this.scene.start('title')
      })

 


    }

 
    update = () => {
 

    }
}