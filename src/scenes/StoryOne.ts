import Phaser from 'phaser'
import StoryOneScreen from 'url:../assets/ui/CaelumCore_Opening1.png'

const musicPath = require('url:../assets/music/story_theme.wav');

export default class StoryOne extends Phaser.Scene {

    
    constructor(){
        super('story-one')
    }

    preload =()=>
    {
        this.load.image("storyOne", StoryOneScreen)
        this.load.audio("story-theme",musicPath)
       
    }

    create = () =>
    {
           //music
           this.sound.removeByKey('title-music');
           const theme = this.sound.add('story-theme',{volume: 0.1, loop:true}, )
           theme.play()
     
      this.add.image(400,300,"storyOne").setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, ()=> {
        this.scene.start('story-two')
      })

 


    }

 
    update = () => {
 

    }
}