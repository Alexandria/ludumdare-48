import Phaser from 'phaser'
import StoryTwoSceen from 'url:../assets/ui/CaelumCore_Opening2.png'
import restart from 'url:../assets/ui/restartButton.png'
import titleScreen from 'url:../assets/ui/titleButton.png'

export default class StoryTwo extends Phaser.Scene {

    
    constructor(){
        super('story-two')
    }

    preload =()=>
    {
        this.load.image("storyTwo", StoryTwoSceen)
              
    }

    create = () =>
    {
      
      this.add.image(400,300,"storyTwo").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, ()=> {
        console.log("restart clicked!")
        this.scene.start('space-level')
      })


    }

 
    update = () => {
 

    }
}