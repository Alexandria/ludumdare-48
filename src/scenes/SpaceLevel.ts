import Phaser from 'phaser'
import astronautTwo from 'url:../assets/astronaut-two.png'
import astronautThree from 'url:../assets/astronaut-three.png'
import astronautFour from 'url:../assets/astronaut-four.png'
import astronaut from 'url:../assets/astronaut.png'
import sky from 'url:../assets/Caelum_BG_5.png'
import star from 'url:../assets/star.png'
import wings from 'url:../assets/wings.png'
import final from 'url:../assets/final.png'
import AsteroidTileSet from 'url:../assets/CAELUMCORE_Asteroid_Tileset.png'
import SpikeTileSet from 'url:../assets/CAELUMCORE_SpikeAsteroid_TileSet.png'
import tileMap from '../assets/spaceMap.json'
import bomb from "url:../assets/bomb.png"
const musicPath = require('url:../../public/ludumdareWip.wav');

export default class SpaceLevel extends Phaser.Scene {

    private player:Phaser.Physics.Matter.Sprite 
    private playerTwo:Phaser.Physics.Matter.Sprite
    private playerThree:Phaser.Physics.Matter.Sprite
    private playerFour:Phaser.Physics.Matter.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private camera?:Phaser.Cameras.Scene2D.Camera
    private star: Phaser.Physics.Matter.Image
    private bomb: Phaser.Physics.Matter.Image
    private bombB: Phaser.Physics.Matter.Image
    private currentPlayKey = ''
    private currentPlayerLocation = {x:0, y:0}
    private playerSpeed = 6
    private playerJump = 9
    private spawnPoint = {x:0, y:0}

    private isTouchingGround = false

    constructor(){
        super('hello-world')
    }

    preload =()=>
    {
        
      
        this.load.image("sky", sky)
        this.load.audio('music',  musicPath)
        this.load.image("star", star)
        this.load.image("bomb", bomb)
        this.load.image("wings", wings)
        this.load.image("final", final)
        this.load.image('asteroidTileSet', AsteroidTileSet)
        this.load.image('spikeTileSet', SpikeTileSet)
        this.load.tilemapTiledJSON('tilemap', tileMap)
        this.load.spritesheet('astronaut', astronaut, {frameWidth:11,frameHeight:16})   
        this.load.spritesheet('astronautTwo', astronautTwo, {frameWidth:19,frameHeight:32})
        this.load.spritesheet('astronautThree', astronautThree, {frameWidth:34,frameHeight:64})
        this.load.spritesheet('astronautFour', astronautFour, {frameWidth:51,frameHeight:96})
      
        
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
        this.matter.world.setBounds(undefined, undefined,undefined,undefined,undefined,false,false,false, false)
        console.log('walls',this.matter.world.walls)
        //Main Camera and backgound 
        this.cameras.main.setBounds(0,10,6800,height)
        this.cameras.main.setScroll(0,10)
        // const background = this.add.image(width*4 , height*0.5, "sky").setScrollFactor(0.5).setDisplaySize(6400,600).
        const background = this.add.image( width*2.6, height*0.5, "sky").setScrollFactor(0.5).setScale(0.65,1)


        // Music
        const theme = this.sound.add('music',{volume: 0.1} )
        // theme.play()

        // Map Level
        const map =  this.make.tilemap({key:'tilemap'})
        const tileset = map.addTilesetImage('Asteroid Platforms', 'asteroidTileSet')
        const spikeTileSet = map.addTilesetImage('Spike Asteroid Platforms', 'spikeTileSet')
        const asteriodGround = map.createLayer('LEVEL 1', [spikeTileSet, tileset])
        const objectLayer = map.getObjectLayer('Object Layer 1')
        asteriodGround.setCollisionByProperty({collides:true})
       

     

        // this.matter.world.convertTilemapLayer(backgroundLayer)
        this.matter.world.convertTilemapLayer(asteriodGround)     
        // this.matter.world.convertTilemapLayer(objectLayer)
        
        this.matter.world.setBounds(0,0,11000, 1000)


        this.currentPlayKey = "astronaut"
        this.createPlayerAnimations()
         

        objectLayer.objects.forEach((objectData)=>{
            const {x=0, y=0, name, id} = objectData
            switch(name){
                case'Caelum 16 SpawnPoint':
                {
                    this.player = this.matter.add.sprite(x,y, this.currentPlayKey, undefined, {label:'player1', friction:0}).play('player-idel').setFixedRotation()
                    this.spawnPoint = {x,y} 
                
                    if(this.player){
                        this.cameras.main.startFollow(this.player)
                    }

                    this.player.setOnCollide((data:MatterJS.ICollisionPair)=>{
                        console.log({data})

                        this.isTouchingGround = true
                    })
                    break;
                }
                case'Caelum 32 Part':
                {
                    this.star = this.matter.add.image(100,y, 'star', undefined, {label:'star'})
                    break;   
                    
                }

                case'Caelum 64 Part':
                {
                    this.bomb = this.matter.add.image(400,y, 'bomb', undefined, {label:'bomb'})
                    break;      
                    
                }
                case'Caelum  64B Part':
                {
                    this.bombB = this.matter.add.image(x,y, 'bomb', undefined, {label:'bomb2'})
                    break ;     
                    
                }
                default:
                    break;
            }
        })


        // const bomb = this.matter.add.image(900,0, 'bomb', undefined, {label:'bomb'})
        // const star = this.matter.add.image(500,0, 'star', undefined, {label:'star'})
        // const wings = this.matter.add.image(1100,0, 'wings', undefined, {label:'wings'})
       
        // World collision screen
        this.matter.world.on('collisionstart', (event)=>{
            event.pairs.forEach(pair =>{
                const{bodyA, bodyB} = pair
                if(bodyA.parent.gameObject !== null && bodyA.parent.gameObject.tile && bodyA.parent.gameObject.tile.properties.hasSpike){
                    console.log("Ouch! Aspike!", bodyA)
                    if(bodyB.label === 'player1'){
                        this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y)
                    }else if(bodyB.label === 'player2'){
                        this.playerTwo.setPosition(this.spawnPoint.x, this.spawnPoint.y)
                    }else if(bodyB.label === 'player3'){
                        this.playerThree.setPosition(this.spawnPoint.x, this.spawnPoint.y)
                    }
                    bodyA.render.opacity = 0.5
                    bodyB.render.opacity = 0.5
                }

                if(bodyA.bounds.min.y > 900){
                    if(bodyB.label === 'player1'){
                        this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y)
                    }else if(bodyB.label === 'player2'){
                        this.playerTwo.setPosition(this.spawnPoint.x, this.spawnPoint.y)
                    }else if(bodyB.label === 'player3'){
                        this.playerThree.setPosition(this.spawnPoint.x, this.spawnPoint.y)
                    }
                    bodyA.render.opacity = 0.5
                    bodyB.render.opacity = 0.5
                }
               
                if(bodyA.gameObject !== null && bodyA.gameObject.tile !== undefined){
                    
                    // console.log('BodyA hasSpikes',bodyA.gameObject.tile.properties.hasSpike)
                } 
           
                if(bodyA.label === 'player1' && bodyB.label === 'star' || bodyA.label === 'star' && bodyB.label === 'player1'){
                       this.currentPlayerLocation = {x:this.player.x, y:this.player.y}
                       this.currentPlayKey = "astronautTwo"
                       this.createPlayerTwoAnimations()
                       this.playerTwo = this.matter.add.sprite(this.currentPlayerLocation.x, this.currentPlayerLocation.y, "astronautTwo", undefined, {label:'player2', friction:0}).play('player2-idel').setFixedRotation()
                       this.cameras.main.stopFollow()
                       this.cameras.main.startFollow(this.playerTwo)
        
                       this.playerTwo.setOnCollide((data:MatterJS.ICollisionPair)=>{
                        this.isTouchingGround = true
                        })

                        this.star.destroy()
                        
                }



                if(bodyA.label === 'bomb' && bodyB.label === 'player2' || bodyA.label === 'player2' && bodyB.label === 'bomb' ){
                
                    this.currentPlayerLocation = {x:this.playerTwo.x, y:this.playerTwo.y}
                    this.currentPlayKey = "astronautThree"
                    // Create New Player
                    this.createPlayerThreeAnimations()
                    this.playerThree = this.matter.add.sprite(this.currentPlayerLocation.x, this.currentPlayerLocation.y, "astronautThree", undefined, {label:'player3', friction:0 }).play('player3-idel').setFixedRotation()
                    this.cameras.main.stopFollow()
                    this.cameras.main.startFollow(this.playerThree)
    
                    this.playerThree.setOnCollide((data:MatterJS.ICollisionPair)=>{
                        this.isTouchingGround = true
                    })

                    this.bomb.destroy()
    
                }

                if(bodyA.label === 'bomb2' && bodyB.label === 'player2' || bodyA.label === 'player2' && bodyB.label === 'bomb2' ){
                
                    this.bombB.destroy()
    
                }


                
                // if(bodyA.label === 'wings' && bodyB.label === 'player3' || bodyA.label === 'player3' && bodyB.label === 'wings' ){
                
                //     this.currentPlayerLocation = {x:this.playerThree.x, y:this.playerThree.y}
                //     this.currentPlayKey = "astronautFour"
                //     // Create New Player
                //     this.createPlayerFourAnimations()
                //     this.playerFour = this.matter.add.sprite(this.currentPlayerLocation.x, this.currentPlayerLocation.y, "astronautFour", undefined, {label:'player4'}).play('player4-idel').setFixedRotation()
                //     this.cameras.main.stopFollow()
                //     this.cameras.main.startFollow(this.playerFour)
    
                //     this.playerFour.setOnCollide((data:MatterJS.ICollisionPair)=>{
                //         this.isTouchingGround = true
                //     })

                
                //     wings.destroy()
    
                // }

                if(bodyA.label === 'final' && bodyB.label === 'player4' || bodyA.label === 'player4' && bodyB.label === 'final' ){
                
                    // this.currentPlayerLocation = {x:this.playerThree.x, y:this.playerThree.y}
                    // this.currentPlayKey = "astronautFour"
                    // // Create New Player
                    // this.createPlayerFourAnimations()
                    // this.playerFour = this.matter.add.sprite(this.currentPlayerLocation.x, this.currentPlayerLocation.y, "astronautFour", undefined, {label:'player4'}).play('player4-idel').setFixedRotation()
                    // this.cameras.main.stopFollow()
                    // this.cameras.main.startFollow(this.playerFour)
    
                    // this.playerFour.setOnCollide((data:MatterJS.ICollisionPair)=>{
                    //     this.isTouchingGround = true
                    // })

                
                    final.destroy()
    
                }


            })
        })


        

     
         this.cursors = this.input.keyboard.createCursorKeys()
      
    }

    private createPlayerAnimations = () =>{
        this.anims.create({
            key:'player1-left',
            frames: this.anims.generateFrameNumbers("astronaut", {start:6, end:9}),
            frameRate:10,
            repeat:-1
        })

        this.anims.create({
            key:'player1-idel',
            frames: [{key: "astronaut", frame:4}],
            frameRate:20
        })

        this.anims.create({
            key:'player1-right',
            frames: this.anims.generateFrameNumbers("astronaut", {start:0, end:3}),
            frameRate:10,
            repeat:-1

        })    
    }

    createPlayerTwoAnimations = () =>{
        this.anims.create({
            key:'player2-left',
            frames: this.anims.generateFrameNumbers("astronautTwo", {start:6, end:9}),
            frameRate:10,
            repeat:-1
        })

        this.anims.create({
            key:'player2-idel',
            frames: [{key: "astronautTwo", frame:4}],
            frameRate:20
        })

        this.anims.create({
            key:'player2-right',
            frames: this.anims.generateFrameNumbers("astronautTwo", {start:0, end:3}),
            frameRate:10,
            repeat:-1

        })
    }

    createPlayerThreeAnimations = () =>{
        this.anims.create({
            key:'player3-left',
            frames: this.anims.generateFrameNumbers("astronautThree", {start:6, end:9}),
            frameRate:10,
            repeat:-1
        })

        this.anims.create({
            key:'player3-idel',
            frames: [{key: "astronautThree", frame:4}],
            frameRate:20
        })

        this.anims.create({
            key:'player3-right',
            frames: this.anims.generateFrameNumbers("astronautThree", {start:0, end:3}),
            frameRate:10,
            repeat:-1

        })
    }

    createPlayerFourAnimations = () =>{
        this.anims.create({
            key:'player4-left',
            frames: this.anims.generateFrameNumbers("astronautFour", {start:6, end:9}),
            frameRate:10,
            repeat:-1
        })

        this.anims.create({
            key:'player4-idel',
            frames: [{key: "astronautFour", frame:4}],
            frameRate:20
        })

        this.anims.create({
            key:'player4-right',
            frames: this.anims.generateFrameNumbers("astronautFour", {start:0, end:3}),
            frameRate:10,
            repeat:-1

        })
    }

    handeCollectItems = (player:Phaser.GameObjects.GameObject, item: Phaser.GameObjects.GameObject) =>{

        const itemImage = item as Phaser.Physics.Arcade.Image
        itemImage.disableBody(true, true)

    }

    playerOneMovement = () => {
        if(this.currentPlayKey === 'astronautTwo') { 
            return
        }

        if(this.cursors && this.cursors?.left.isDown){
            this.player?.setVelocityX(-this.playerSpeed)
            this.player?.anims.play('player1-left', true)
        } else if (this.cursors?.right.isDown){
            this.player?.setVelocityX(this.playerSpeed)
            this.player?.anims.play('player1-right', true)
        }else{
            this.player?.setVelocityX(0)
            this.player?.anims.play('player1-idel')
        }

        if((this.cursors?.up.isDown || this.cursors?.space.isDown) && this.isTouchingGround){
            this.player?.setVelocityY(-this.playerJump)
            this.isTouchingGround = false
        }

    }

    playerTwoMovement = () => {
        if(this.player){this.player.destroy()}

        if(this.cursors && this.cursors?.left.isDown){
            this.playerTwo?.setVelocityX(-this.playerSpeed)
            this.playerTwo?.anims.play('player2-left', true)
        } else if (this.cursors?.right.isDown){
            this.playerTwo?.setVelocityX(this.playerSpeed)
            this.playerTwo?.anims.play('player2-right', true)
        }else{
            this.playerTwo?.setVelocityX(0)
            this.playerTwo?.anims.play('player2-idel')
        }

        if((this.cursors?.up.isDown || this.cursors?.space.isDown) && this.isTouchingGround){
            this.playerTwo?.setVelocityY(-this.playerJump)
            this.isTouchingGround = false
        }
    }

    playerThreeMovement = () => {
        if(this.playerTwo) this.playerTwo.destroy()

        if(this.cursors && this.cursors?.left.isDown){
            this.playerThree?.setVelocityX(-this.playerSpeed)
            this.playerThree?.anims.play('player3-left', true)
        } else if (this.cursors?.right.isDown){
            this.playerThree?.setVelocityX(this.playerSpeed)
            this.playerThree?.anims.play('player3-right', true)
        }else{
            this.playerThree?.setVelocityX(0)
            this.playerThree?.anims.play('player3-idel')
        }

        if(this.cursors?.up.isDown && this.isTouchingGround){
            this.playerThree?.setVelocityY(-this.playerSpeed)
            this.isTouchingGround = false
        }
    }

    playerFourMovement = () => {
        if(this.playerTwo) this.playerThree.destroy()

        if(this.cursors && this.cursors?.left.isDown){
            this.playerFour?.setVelocityX(-this.playerSpeed)
            this.playerFour?.anims.play('player4-left', true)
        } else if (this.cursors?.right.isDown){
            this.playerFour?.setVelocityX(this.playerSpeed)
            this.playerFour?.anims.play('player4-right', true)
        }else{
            this.playerFour?.setVelocityX(0)
            this.playerFour?.anims.play('player4-idel')
        }

        if(this.cursors?.up.isDown && this.isTouchingGround){
            this.playerFour?.setVelocityY(-this.playerSpeed)
            this.isTouchingGround = false
        }
    }


    update = () => {
 
       if(this.currentPlayKey === `astronaut`) this.playerOneMovement()
       if(this.currentPlayKey === `astronautTwo`) this.playerTwoMovement()
       if(this.currentPlayKey === `astronautThree`) this.playerThreeMovement()
       if(this.currentPlayKey === `astronautFour`)this.playerFourMovement()

       


    }
}