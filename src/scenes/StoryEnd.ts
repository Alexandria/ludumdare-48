import Phaser from 'phaser'
import StoryEndScreen from 'url:../assets/ui/CaelumCore_End_Card.png'

const musicPath = require('url:../assets/music/story_theme.wav');

export default class StoryEnd extends Phaser.Scene {

    constructor(){
        super('story-end')
    }

    preload =()=>
    {
        this.load.image("storyEnd", StoryEndScreen)
        this.load.audio("end-theme",musicPath)
       
    }

    create = () =>
    {
           //music
           this.sound.removeByKey('music');
           const theme = this.sound.add('end-theme',{loop:true}, )
           theme.play()
     
      this.add.image(400,300,"storyEnd").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, ()=> {
        this.scene.start('credit-scene')
      })

 


    }

 
    update = () => {
 

    }
}