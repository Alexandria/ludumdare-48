import Phaser, { Scene } from 'phaser'
import dude from 'url:../assets/dude-one.png'
import astronaut from 'url:../assets/astronaut.png'
import sky from 'url:../assets/space_bg.png'
import ground from 'url:../assets/ground.png'
import mountain from 'url:../assets/mountain.png'
import plateau from 'url:../assets/plateau.png'
import plant from 'url:../assets/plant.png'
import star from 'url:../assets/star.png'

export default class SpaceLevel extends Phaser.Scene {

    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?:Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private camera?:Phaser.Cameras.Scene2D.Camera
    private star?: Phaser.Physics.Arcade.Group


    constructor(){
        super('hello-world')
    }

    preload =()=>
    {

        this.load.image("sky", sky)
        this.load.image("ground", ground)
        this.load.image("mountain", mountain)
        this.load.image("plateau", plateau)
        this.load.image("plant", plant)
        this.load.image("star", star)
        this.load.spritesheet('dude', dude, {frameWidth:16,frameHeight:16})
        this.load.spritesheet('astronaut', astronaut, {frameWidth:9,frameHeight:16})
        
        
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
        this.cameras.main.setBounds(0,0,12200,height)
        this.add.image(width*4 , height*0.5, "sky").setScrollFactor(0.5)

        // this.add.image(0,height, "mountain").setOrigin(0,1).setScrollFactor(0.5)
        // this.createAligned(this,this.scale.width * 10 , 'mountain', 0.5)
        // this.createAligned(this,this.scale.width * 10 , 'plateau', 1)
        

        //this.add.image(0,height,'plateau').setOrigin(0,1).setScrollFactor(1)
      
       const groundWidth = this.textures.get('mountain').getSourceImage().width

        this.platforms = this.physics.add.staticGroup()
        const ground:Phaser.GameObjects.Sprite = this.platforms?.create(0, height, 'ground')
        const ground1:Phaser.GameObjects.Sprite = this.platforms?.create(width, height, 'ground')
        const ground2:Phaser.GameObjects.Sprite = this.platforms?.create(width*2, height, 'ground')
       // this.add.image(0,height, 'ground').setOrigin(0,1).setScrollFactor(1)
       this.createAligned(this,this.scale.width * 8 , 'ground', 1)
        ground.setScale(2).refreshBody()
        ground1.setScale(2).refreshBody()
        ground2.setScale(2).refreshBody()
        
        
      
       

        ///this.add.image(0,height, 'plant').setOrigin(0,1).setScrollFactor(1.5)

        this.createAligned(this,this.scale.width * 10 , 'plant', 1.5)
  
        // const ground:Phaser.GameObjects.Sprite = this.platforms.create(400, 568, 'ground')
        //  ground.setScale(2).refreshBody()

         this.player = this.physics.add.sprite(50, 0, 'astronaut')
         this.player.setBounce(0.2)
         //this.player.setCollideWorldBounds(true)

         if(this.player){
            this.cameras.main.startFollow(this.player)
         }

        

         this.anims.create({
             key:'left',
             frames: this.anims.generateFrameNumbers('astronaut', {start:6, end:9}),
             frameRate:10,
             repeat:-1
         })

         this.anims.create({
             key:'turn',
             frames: [{key:'astronaut', frame:4}],
             frameRate:20
         })

         this.anims.create({
             key:'right',
             frames: this.anims.generateFrameNumbers('astronaut', {start:0, end:3}),
             frameRate:10,
             repeat:-1

         })


         this.physics.add.collider(this.player, this.platforms)

         
        this.star = this.physics.add.group({
        key:"star",
        repeat: 3,
        setXY: {x:250, y:0, stepX: 70}
        })
  
        this.physics.add.collider(this.star, this.platforms, )

        this.physics.add.overlap(this.player, this.star, this.handeCollectItems, undefined, this)
     
         this.cursors = this.input.keyboard.createCursorKeys()
      
         
         

    }


    handeCollectItems = (player:Phaser.GameObjects.GameObject, item: Phaser.GameObjects.GameObject) =>{

        const itemImage = item as Phaser.Physics.Arcade.Image
        itemImage.disableBody(true, true)

    }

    update = () => {
        
        if(this.cursors && this.cursors?.left.isDown){
            this.player?.setVelocityX(-160)
            this.player?.anims.play('left', true)
        } else if (this.cursors?.right.isDown){
            this.player?.setVelocityX(160)
            this.player?.anims.play('right', true)
        }else{
            this.player?.setVelocityX(0)
            this.player?.anims.play('turn')
        }


        if(this.cursors?.up.isDown && this.player?.body.touching.down){
            this.player?.setVelocityY(-330)
        }


    }
}