import Phaser from 'phaser'
import astronautTwo from 'url:../assets/astronaut-two.png'
import astronautThree from 'url:../assets/astronaut-three.png'
import astronautFour from 'url:../assets/astronaut-four.png'
import astronaut from 'url:../assets/astronaut.png'
import sky from 'url:../assets/Caelum_BG_5.png'
import stars from 'url:../assets/Caelum_BG_4.png'
import planets from 'url:../assets/Caelum_BG_3.png'
import suns from 'url:../assets/Caelum_BG_2.png'
import ship from 'url:../assets/Caelum_BG_1.png'
import helmet from 'url:../assets/CAELUMCORE_Helmet.png'
import jetpack from "url:../assets/CAELUMCORE_Jetpack.png"
import boots from "url:../assets/CAELUMCORE_Boots.png"
import core from 'url:../assets/CAELUMCORE_Core.png'
import heartCountThree from 'url:../assets/heartCountThree.png'
import heartCountTwo from 'url:../assets/heartCountTwo.png'
import heartCountOne from 'url:../assets/heartCountOne.png'
import itemMetterZero from 'url:../assets/itemMetterZero.png'
import itemMetterOne from 'url:../assets/itemMetterOne.png'
import itemMetterTwo from 'url:../assets/itemMetterTwo.png'
import itemMetterThree from 'url:../assets/itemMetterThree.png'
import itemMetterFour from 'url:../assets/itemMetterFour.png'
import AsteroidTileSet from 'url:../assets/CAELUMCORE_Asteroid_Tileset.png'
import SpikeTileSet from 'url:../assets/CAELUMCORE_SpikeAsteroid_TileSet.png'
import tileMap from '../assets/spaceMap.json'

const musicPath = require('url:../../public/ludumdareWip.wav');

export default class SpaceLevel extends Phaser.Scene {

    private player:Phaser.Physics.Matter.Sprite 
    private playerTwo:Phaser.Physics.Matter.Sprite
    private playerThree:Phaser.Physics.Matter.Sprite
    private playerFour:Phaser.Physics.Matter.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private camera?:Phaser.Cameras.Scene2D.Camera
    private helmet: Phaser.Physics.Matter.Image
    private jetpack: Phaser.Physics.Matter.Image
    private boots: Phaser.Physics.Matter.Image
    private core:Phaser.Physics.Matter.Image
    private heartCountUI: Phaser.GameObjects.Image
    private itemCountUI: Phaser.GameObjects.Image
    private currentPlayKey = ''
    private currentPlayerLocation = {x:0, y:0}

    // User Controls
    private playerSpeed = 6
    private playerJump = 9
    private playerHit = 4

    

    private spawnPoint = {x:0, y:0}

    //UI State
    private hitCount = 0
    private itemCount = 0

    private isTouchingGround = false

    constructor(){
        super('hello-world')
    }

    preload =()=>
    {
        
      
        this.load.image("sky", sky)
        this.load.audio('music',  musicPath)
        this.load.image("helmet", helmet)
        this.load.image("stars", stars)
        this.load.image("planets", planets)
        this.load.image("suns", suns)
        this.load.image("ship", ship)
        this.load.image("jetpack", jetpack)
        this.load.image("boots", boots)
        this.load.image("core", core)

        //UI
        this.load.image("heartCountThree", heartCountThree)
        this.load.image("heartCountTwo", heartCountTwo)
        this.load.image("heartCountOne", heartCountOne)
        this.load.image("itemMetterZero", itemMetterZero)
        this.load.image("itemMetterOne", itemMetterOne)
        this.load.image("itemMetterTwo", itemMetterTwo)
        this.load.image("itemMetterThree", itemMetterThree)
        this.load.image("itemMetterFour", itemMetterFour)

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
        this.cameras.main.setBounds(0,0,6800,height)
        // const background = this.add.image(width*4 , height*0.5, "sky").setScrollFactor(0.5).setDisplaySize(6400,600).
        const background = this.add.image( width*2.6, height*0.5, "sky").setScrollFactor(0.1).setScale(0.65,1)
        this.add.image( width*2.6, height*0.5, "stars").setScrollFactor(0.2).setScale(0.65,1)
        this.add.image( width*1.7, height*0.5, "planets").setScrollFactor(0.3).setScale(0.45,1)
        this.add.image( width*1.8, height*0.5, "suns").setScrollFactor(0.5).setScale(0.45,1)
        this.add.image( width*1.8, height*0.5, "ship").setScrollFactor(0.5).setScale(1,1)
        

        // this.add.image( width*2.6, height*0.5, "stars").setScrollFactor(0.9).setScale(0.65,1)
        // this.add.image( width*1.7, height*0.5, "planets").setScrollFactor(0.5).setScale(0.45,1)
        // this.add.image( width*1.8, height*0.5, "suns").setScrollFactor(0.3).setScale(0.45,1)
        // this.add.image( width*4, height*0.5, "ship").setScrollFactor(0.2).setScale(1,1)

        // Music
        const theme = this.sound.add('music',{volume: 0.1} )
        theme.play()

        // Map Level
        const map =  this.make.tilemap({key:'tilemap'})
        const tileset = map.addTilesetImage('Asteroid Platforms', 'asteroidTileSet')
        const spikeTileSet = map.addTilesetImage('Spike Asteroid Platforms', 'spikeTileSet')
        const asteriodGround = map.createLayer('LEVEL 1', [spikeTileSet, tileset])
        const objectLayer = map.getObjectLayer('Object Layer 1')
        asteriodGround.setCollisionByProperty({collides:true})
       

        //UI 
        this.heartCountUI = this.add.image(width*0.5,height*0.5,"heartCountThree").setScrollFactor(0)
        this.itemCountUI = this.add.image(width*0.5,height*0.5,"itemMetterZero").setScrollFactor(0)

        //UI Test
        // this.hitCount = 2
        // this.updateHeartUI()

        // this.itemCount = 4
        // this.updateItemUI()

        // this.matter.world.convertTilemapLayer(backgroundLayer)
        this.matter.world.convertTilemapLayer(asteriodGround)     
        // this.matter.world.convertTilemapLayer(objectLayer)
        
        this.matter.world.setBounds(0,0,11000, 600)


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
                    this.helmet = this.matter.add.image(x,y, 'helmet', undefined, {label:'helmet', friction:100})
                    break;   
                    
                }

                case'Caelum 64 Part':
                {
                    this.jetpack = this.matter.add.image(x,y, 'jetpack', undefined, {label:'jetpack', friction:100})
                    break;      
                    
                }
                case'Caelum  64B Part':
                {
                    this.boots = this.matter.add.image(x+90,y, 'boots', undefined, {label:'boots', friction:100})
                    break ;     
                    
                }
                case'core':
                {
                    this.core = this.matter.add.image(x,y, 'core', undefined, {label:'core', friction:100})
                    break ;     
                    
                }
                default:
                    break;
            }
        })


        // const jetpack = this.matter.add.image(900,0, 'jetpack', undefined, {label:'jetpack'})
        // const helmet = this.matter.add.image(500,0, 'helmet', undefined, {label:'helmet'})
        // const wings = this.matter.add.image(1100,0, 'wings', undefined, {label:'wings'})
       
        // World collision screen
        this.matter.world.on('collisionstart', (event)=>{
            event.pairs.forEach(pair =>{
                const{bodyA, bodyB} = pair
                console.log({bodyB})

                if(bodyA.parent.gameObject !== null && bodyA.parent.gameObject.tile && bodyA.parent.gameObject.tile.properties.hasSpike && bodyB.label === 'player1'){          
                    this.time.delayedCall(50, () =>{   
                        this.hitCount++; 
                        this.updateHeartUI()}
                        )
                    
                    this.player.setVelocityY(-this.playerHit)
                   
                    if(this.hitCount >=3){
                        console.log("Hit Count",this.hitCount)
                        // this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y)
                        this.hitCount = 0
                        this.updateHeartUI()
                    }
                    
                }

                if(bodyA.parent.gameObject !== null && bodyA.parent.gameObject.tile && bodyA.parent.gameObject.tile.properties.hasSpike && bodyB.label === 'player2'  ){
                //   if (this.hitCount > 2)  this.playerTwo.setPosition(this.spawnPoint.x, this.spawnPoint.y) 
                }
                 
                if(bodyA.parent.gameObject !== null && bodyA.parent.gameObject.tile && bodyA.parent.gameObject.tile.properties.hasSpike && bodyB.label === 'player3'  ){
                    // if (this.hitCount > 2)  this.playerThree.setPosition(this.spawnPoint.x, this.spawnPoint.y) 
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
           
                if(bodyA.label === 'player1' && bodyB.label === 'helmet' || bodyA.label === 'helmet' && bodyB.label === 'player1'){
                       this.currentPlayerLocation = {x:this.player.x, y:this.player.y}
                       this.currentPlayKey = "astronautTwo"
                       this.createPlayerTwoAnimations()
                       this.playerTwo = this.matter.add.sprite(this.currentPlayerLocation.x, this.currentPlayerLocation.y, "astronautTwo", undefined, {label:'player2', friction:0}).play('player2-idel').setFixedRotation()
                       this.cameras.main.stopFollow()
                       this.cameras.main.startFollow(this.playerTwo)
        
                       this.playerTwo.setOnCollide((data:MatterJS.ICollisionPair)=>{
                        this.isTouchingGround = true
                        })
                        
                        this.itemCount++
                        this.updateItemUI()
                        this.helmet.destroy()
                        
                }



                if(bodyA.label === 'jetpack' && bodyB.label === 'player2' || bodyA.label === 'player2' && bodyB.label === 'jetpack' ){
                
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

                    this.itemCount++
                    this.updateItemUI()
                    this.jetpack.destroy()
    
                }

                if(bodyA.label === 'boots' && bodyB.label === 'player3' || bodyA.label === 'player3' && bodyB.label === 'boots' ){
                    this.itemCount++
                    this.updateItemUI()
                    this.boots.destroy()
    
                }

                if(bodyA.label === 'core' && bodyB.label === 'player4' || bodyA.label === 'player4' && bodyB.label === 'core' ){
                    this.itemCount++
                    this.updateItemUI()
                    this.core.destroy()
    
                }


            })
        })


        

     
         this.cursors = this.input.keyboard.createCursorKeys()
      
    }

    private updateHeartUI = ()=> {
        if(this.hitCount > 2){ 
            this.heartCountUI.setTexture('heartCountThree')
            
        }
        if(this.hitCount  === 0) this.heartCountUI.setTexture('heartCountThree')
        if(this.hitCount === 1) this.heartCountUI.setTexture('heartCountTwo')
        if(this.hitCount === 2) this.heartCountUI.setTexture('heartCountOne')
    }

    private updateItemUI = ()=> {
        if(this.itemCount > 4) return
        if(this.itemCount  === 0) this.itemCountUI.setTexture('itemMetterZero')
        if(this.itemCount === 1) this.itemCountUI.setTexture('itemMetterOne')
        if(this.itemCount === 2) this.itemCountUI.setTexture('itemMetterTwo')
        if(this.itemCount === 3) this.itemCountUI.setTexture('itemMetterThree')
        if(this.itemCount === 4) this.itemCountUI.setTexture('itemMetterFour')
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

        if((this.cursors?.up.isDown || this.cursors?.space.isDown) && this.isTouchingGround){
            this.playerThree?.setVelocityY(-this.playerJump+2)
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