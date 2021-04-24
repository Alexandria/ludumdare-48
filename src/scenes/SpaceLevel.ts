import Phaser, { Scene } from 'phaser'
import dude from 'url:../assets/dude-one.png'
import astronautTwo from 'url:../assets/astronaut-two.png'
import astronaut from 'url:../assets/astronaut.png'
import sky from 'url:../assets/space_bg.png'
import mountain from 'url:../assets/mountain.png'
import plateau from 'url:../assets/plateau.png'
import plant from 'url:../assets/plant.png'
import star from 'url:../assets/star.png'
import AsteroidTileSet from 'url:../assets/asteroid_tileset.png'
import tileMap from '../assets/spaceMap.json'

export default class SpaceLevel extends Phaser.Scene {

    private player?:Phaser.Physics.Matter.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private camera?:Phaser.Cameras.Scene2D.Camera
    private star?: Phaser.Physics.Matter.Sprite
    private musicPath = require('url:../assets/ludumdareWip.wav');


    private isTouchingGround = false

    constructor(){
        super('hello-world')
    }

    preload =()=>
    {

        this.load.image("sky", sky)
        this.load.audio('music',  this.musicPath)
        this.load.image("mountain", mountain)
        this.load.image("plateau", plateau)
        this.load.image("plant", plant)
        this.load.image("star", star)
        this.load.image('asteroidTileSet', AsteroidTileSet)
        this.load.tilemapTiledJSON('tilemap', tileMap)
        this.load.spritesheet('astronaut', astronaut, {frameWidth:9,frameHeight:16})   
        this.load.spritesheet('astronautTwo', astronautTwo, {frameWidth:23,frameHeight:32})
      
        
    }

    private createAligned = (scene:Phaser.Scene, totalwidth, texture,scrollfactor) => {
        const width = scene.textures.get(texture).getSourceImage().width
        // const totalwidth = scene.scale.width * 10 

        const count = Math.ceil(totalwidth / width)
        console.log({count})

        let x = 0
        for (let i= 0; i < count ; ++i)
        {
            const backgroundLayer = scene.add.image(x, scene.scale.height, texture).setOrigin(0,1).setScrollFactor(scrollfactor)

            x += backgroundLayer.width
        }

    }

    create = () =>
    {
        const {width, height} = this.scale

        //Main Camera and backgound 
        this.cameras.main.setBounds(0,0,11000,height)
        this.add.image(width*4 , height*0.5, "sky").setScrollFactor(0.5)

        // Music
        const theme = this.sound.add('music',{volume: 0.1} )
        theme.play()

        const map =  this.make.tilemap({key:'tilemap'})
        const tileset = map.addTilesetImage('AstroidsTest', 'asteroidTileSet')
        const asteriodGround = map.createLayer('ground', tileset)
        asteriodGround.setCollisionByProperty({collide:true})
     

        this.matter.world.convertTilemapLayer(asteriodGround)
        this.matter.world.setBounds(0,0,11000,height)


        // this.add.image(0,height, "mountain").setOrigin(0,1).setScrollFactor(0.5)
        // this.createAligned(this,this.scale.width * 10 , 'mountain', 0.5)
        // this.createAligned(this,this.scale.width * 10 , 'plateau', 1)
        

        // this.add.image(0,height,'plateau').setOrigin(0,1).setScrollFactor(1)
      
       const groundWidth = this.textures.get('mountain').getSourceImage().width

        // this.platforms = this.physics.add.staticGroup()
        // const ground:Phaser.GameObjects.Sprite = this.platforms?.create(0, height, 'ground')
        // const ground1:Phaser.GameObjects.Sprite = this.platforms?.create(width, height, 'ground')
        // const ground2:Phaser.GameObjects.Sprite = this.platforms?.create(width*2, height, 'ground')
    //    this.add.image(0,height, 'ground').setOrigin(0,1).setScrollFactor(1)
    //    this.createAligned(this,this.scale.width * 8 , 'ground', 1)
        // ground.setScale(2).refreshBody()
        // ground1.setScale(2).refreshBody()
        // ground2.setScale(2).refreshBody()
        
        
      
       

        ///this.add.image(0,height, 'plant').setOrigin(0,1).setScrollFactor(1.5)

        // this.createAligned(this,this.scale.width * 10 , 'plant', 1.5)
  
        // const ground:Phaser.GameObjects.Sprite = this.platforms.create(400, 568, 'ground')
        //  ground.setScale(2).refreshBody()

        //  this.player = this.physics.add.sprite(50, 0, 'astronaut')
        //  this.player.setBounce(0.2)
         //this.player.setCollideWorldBounds(true)

         this.createPlayerAnimations()

                
         this.player = this.matter.add.sprite(width * 0.5, height * 0.5, astronautTwo).play('player-idel').setFixedRotation()
         this.player.setOnCollide((data:MatterJS.ICollisionPair)=>{
             this.isTouchingGround = true
         })

         if(this.player){
            this.cameras.main.startFollow(this.player)
         }

      
       

        //  this.physics.add.collider(this.player, this.platforms)

         
        this.star = this.matter.add.sprite(250,0, 'star', undefined)

        // ({
        //     key:"star",
        //     repeat: 3,
        //     setXY: {x:250, y:0, stepX: 70}
        //     })
  
        // this.physics.add.collider(this.star, this.platforms, )

        // this.physics.add.overlap(this.player, this.star, this.handeCollectItems, undefined, this)
     
         this.cursors = this.input.keyboard.createCursorKeys()
      
         
         

    }

    private createPlayerAnimations = () =>{
        this.anims.create({
            key:'player-left',
            frames: this.anims.generateFrameNumbers('astronautTwo', {start:6, end:9}),
            frameRate:10,
            repeat:-1
        })

        this.anims.create({
            key:'player-idel',
            frames: [{key:'astronautTwo', frame:4}],
            frameRate:20
        })

        this.anims.create({
            key:'player-right',
            frames: this.anims.generateFrameNumbers('astronautTwo', {start:0, end:3}),
            frameRate:10,
            repeat:-1

        })

    }


    handeCollectItems = (player:Phaser.GameObjects.GameObject, item: Phaser.GameObjects.GameObject) =>{

        const itemImage = item as Phaser.Physics.Arcade.Image
        itemImage.disableBody(true, true)

    }

    update = () => {
        
        if(this.cursors && this.cursors?.left.isDown){
            this.player?.setVelocityX(-10)
            this.player?.anims.play('player-left', true)
        } else if (this.cursors?.right.isDown){
            this.player?.setVelocityX(10)
            this.player?.anims.play('player-right', true)
        }else{
            this.player?.setVelocityX(0)
            this.player?.anims.play('player-idel')
        }

        if(this.cursors?.up.isDown && this.isTouchingGround){
            this.player?.setVelocityY(-10)
            this.isTouchingGround = false
        }


    }
}