import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload () {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');
        this.load.spritesheet('player', '/player/Sprite-ninja-sin-fondo-Sheet-100x100.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame:0,
            endFrame: 22
        });
        this.load.image('platform1', '/platforms/platform1.png');
        this.load.image('platform2', '/platforms/platform2.png');
    }

    create () {

        this.platform = this.physics.add.staticGroup();

        this.platform.create(900, 300, 'platform1').setSize(360, 170);
        this.platform.create(200, 700, 'platform2').setSize(400, 150);
        this.platform.create(700, 800, 'platform1').setSize(360, 170);
        this.platform.children.iterate((platform, index) => {
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
        })

        this.ninja = this.physics.add.sprite(0, 0, 'player', 0);
        this.anims.create({
            key: 'ninja-idle',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 4}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'ninja-run',
            frames: this.anims.generateFrameNumbers('player', {start: 7, end: 12}),
            repeat: -1,
            frameRate: 15
        })
        this.anims.create({
            key: 'ninja-jump',
            frames: this.anims.generateFrameNumbers('player', {start: 13, end: 20}),
            repeat: 0,
            frameRate: 15
        })
        this.ninja.setGravityY(5000);
        this.ninja.setSize(60, 90);
        this.ninja.setOffset(22, 10);

        this.physics.add.collider(this.ninja, this.platform);

        this.keys = this.input.keyboard.createCursorKeys();

        this.camaramain = this.cameras.main.startFollow(this.ninja);
        this.camaramain.setLerp(0.1, 0.1);
        
    }

    update () {

        if (this.keys.up.isDown && this.ninja.body.touching.down) {
            this.ninja.setVelocityY(-2000);
            console.dir(this.camaramain);
        } else if (this.keys.down.isDown && !this.ninja.body.touching.down && this.ninja.body.velocity.y > 0) {
            this.ninja.setVelocityY(1500);
        } else if (this.keys.down.isDown && this.ninja.body.touching.down) {
            this.ninja.setFrame(5);
        }

        if (this.keys.right.isDown) {
            this.ninja.setVelocityX(400);
            this.ninja.setFlipX(false);
            this.camaramain.originX = 0.4;
        } else if (this.keys.left.isDown) {
            this.ninja.setVelocityX(-400);
            this.ninja.setFlipX(true);
            this.camaramain.originX = 0.6;
        } else {
            this.ninja.setVelocityX(0);
        }
        

        if (this.ninja.body.velocity.x == 0 && this.ninja.body.velocity.y == 0) {
            this.ninja.anims.play('ninja-idle', true);
        } else if (this.ninja.body.velocity.y > 0) {
            this.ninja.setFrame(20);
        } else if (this.ninja.body.velocity.y < 0) {
            this.ninja.anims.play('ninja-jump', true);
        } else if (this.ninja.body.velocity.x > 0 && this.ninja.body.touching.down) {
            this.ninja.anims.play('ninja-run', true);
        } else if (this.ninja.body.velocity.x < 0 && this.ninja.body.touching.down) {
            this.ninja.anims.play('ninja-run', true);
        }

    }
}
