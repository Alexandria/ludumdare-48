import Phaser from 'phaser'
import Title from 'url:../assets/ui/CaelumCore_UI_Menu.png'

const musicPath = require('url:../assets/music/title_theme.wav');


export default class TitleScreen extends Phaser.Scene {

    
    constructor(){
        super('title')
    }

    preload =()=>
    {
        this.load.audio('title-music',  musicPath)
        this.load.image("titleScreen", Title)
       

              
    }

    create = () =>
    {
      this.sound.removeByKey('end-theme')
      const theme = this.sound.add('title-music',{ loop:true} )
      theme.play()

      this.add.image(400,300,"titleScreen").setInteractive().on(Phaser.Input.Events.POINTER_DOWN, ()=> {
        console.log("restart clicked!")
        this.scene.start('controls')
      })
     

    }

 
    update = () => {
 

    }
}