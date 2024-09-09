import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.activeControls = true;
        this.activeRight = true;
        this.activeLeft = true;
        this.isDash = false;
    }

    preload () {
        this.load.setPath('assets');
        this.load.image('fondo1', '/backgrounds/fondo1.jpg');

        this.load.spritesheet('player', '/player/Sprite-ninja-sin-fondo-Sheet-100x100.png', {
            frameWidth: 100,
            frameHeight: 100,
            startFrame:0,
            endFrame: 22
        });
        this.load.image('platform1', '/platforms/platform1.png');
        this.load.image('platform2', '/platforms/platform2.png');
        this.load.image('platform3', '/platforms/platform3.png');
        this.load.image('platform4', '/platforms/platform4.png');
        this.load.image('platform5', '/platforms/platform5.png');
        this.load.image('platform6', '/platforms/platform6.png');
        this.load.image('platform7', '/platforms/platform7.png');
        this.load.image('platform8', '/platforms/platform8.png');
        this.load.image('platform9', '/platforms/platform9.png');
        this.load.image('helices1', '/obstacles/helices1.png');
        this.load.image('arbol1', '/backgrounds/arbol.png');
        this.load.spritesheet('burbuja', '/jumpers/burbuja-105x105-Spritesheet.png', {
            frameWidth: 105,
            frameHeight: 105,
            startFrame: 0,
            endFrame: 9
        });
    }

    create () {
        this.fondo = this.add.image(0, 0, 'fondo1').setOrigin(0, 0).setScale(2);
        this.fondo.setScrollFactor(0);
        this.platform = this.physics.add.staticGroup();
        this.verticalPlatform = this.physics.add.staticGroup();
        this.helice = this.physics.add.staticGroup();
        this.burbuja = this.physics.add.staticGroup();

        this.platform.create(900, 300, 'platform1').setSize(360, 170);
        this.add.image(500, 70, 'arbol1').setTint(0x111111);
        this.add.image(2200, 0, 'arbol1').setTint(0x111111);
        this.platform.create(200, 400, 'platform2').setSize(400, 150);
        this.platform.create(1000, 900, 'platform1').setSize(360, 170);
        this.platform.create(-400, 500, 'platform1').setSize(360, 170);
        this.platform.create(700, 600, 'platform2').setSize(400, 150);
        this.platform.create(1400, 0, 'platform2').setSize(400, 150);
        this.platform.create(1900, 300, 'platform1').setSize(360, 170);
        this.platform.create(3300, 500, 'platform3').setSize(1730, 100).setScale(3.4).setOffset(-600, 24);
        this.verticalPlatform.create(3300, -50, 'platform9').setSize(50, 500).setScale(2, 1);
        this.verticalPlatform.create(3000, -300, 'platform9').setSize(50, 500).setScale(2, 1);
        this.helice.create(3300, -100, 'helices1');
        this.helice.create(3000, -450, 'helices1');
        this.platform.create(3700, -300, 'platform6').setScale(3).setSize(400, 100).setOffset(-100, 0);
        this.burbuja.create(4200, -600, 'burbuja', 0);
        this.burbuja.create(4500, -700, 'burbuja', 0);
        this.burbuja.create(4800, -600, 'burbuja', 0);
        this.platform.create(5200, -600, 'platform6').setScale(3).setSize(400, 100).setOffset(-100, 0);


        this.burbuja.children.iterate((burbuja) => {
            burbuja.setCircle(42);
            burbuja.setOffset(9, 9);
            burbuja.setTint(0xff0007);
        })

        this.platform.children.iterate((platform, index) => {
            platform.body.checkCollision.down = false;
            platform.body.checkCollision.left = false;
            platform.body.checkCollision.right = false;
        })
        this.verticalPlatform.children.iterate((platform, index) => {
            if (index === 0) {
                platform.angle = -90;
            }
            if (index === 1) {
                platform.angle = 90;
            }
        })

        this.helice.children.iterate((helice) => {
            console.dir(helice)
            helice.setScale(2)
            helice.setSize(200, 200);
            helice.setOffset(-45, -45);
            helice.setCircle(100);
            this.tweens.add({
                targets: helice,
                angle: 360, 
                duration: 1000, 
                repeat: -1 
            });
        })

        this.platform.setTint(0x111111);
        this.verticalPlatform.setTint(0x111111);
        this.helice.setTint(0x1111111);


        this.ninja = this.physics.add.sprite(-400, 0, 'player', 0);// x:-400, y:0 posicion original
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
        this.ninja.setSize(55, 90);
        this.ninja.setOffset(22, 10);
        this.ninja.setMaxVelocity(2000, 1900);
        this.ninja.setTint(0x555555);

        this.anims.create({
            key: 'burbuja-destroy',
            frames: this.anims.generateFrameNumbers('burbuja', {start: 0, end: 9}),
            repeat: 0,
            frameRate: 30
        })

        this.keys = this.input.keyboard.createCursorKeys();
        this.aKeys = this.input.keyboard.addKeys('z, x, c');

        function handleNinjaVplatformCollide( ninja) {
            if(this.keys.up.isDown && ninja.body.touching.right) {
                this.activeControls = false;
                ninja.setVelocityX(-1000);
                ninja.setVelocityY(-1700);
            } else if (this.keys.up.isDown && ninja.body.touching.left) {
                this.activeControls = false;
                ninja.setVelocityX(1400);
                ninja.setVelocityY(-1700);
            }
            setTimeout(() => {
                this.activeControls = true;
            }, 50);
        }

        function handleNinjaHeliceCollide (ninja) {
            this.camaramain.shake(200, 0.02);
            ninja.setTint(0xab2125);
            this.activeControls = false;
            setTimeout(() => {
                ninja.setTint(0x555555);
            }, 100);
        }

        function handleNinjaBurbujaCollide (ninja, burbuja) {
            if (this.keys.up.isDown) {
                this.ninja.setVelocityY(-2000);
                burbuja.anims.play('burbuja-destroy', true);
                setTimeout(() => {
                    burbuja.destroy();
                }, 400);
            }

        }
        
        this.physics.add.collider(this.ninja, this.platform);
        this.physics.add.collider(this.ninja, this.verticalPlatform, handleNinjaVplatformCollide.bind(this));
        this.physics.add.overlap(this.ninja, this.helice, handleNinjaHeliceCollide.bind(this));
        this.physics.add.overlap(this.ninja, this.burbuja, handleNinjaBurbujaCollide.bind(this));

        

        this.camaramain = this.cameras.main.startFollow(this.ninja);
        this.camaramain.setLerp(0.1, 0.1);
        this.camaramain.fadeIn(2000, 0, 0 , 0);
        console.dir(this.camaramain);
        console.dir(this.ninja);

        
    }

    update () {
        if (!this.activeControls && this.ninja.body.touching.down) {
            this.activeControls = true;
        }

        

        if (this.activeControls) {
            if (this.keys.up.isDown && this.ninja.body.touching.down) {
                this.ninja.setVelocityY(-2000);
            } else if (this.keys.down.isDown && !this.ninja.body.touching.down && this.ninja.body.velocity.y > 0) {
                this.ninja.setVelocityY(2500);
            }
            if (this.keys.right.isDown) {
                if (this.activeRight) {
                    this.ninja.setVelocityX(500);
                    this.ninja.setFlipX(false);
                    this.camaramain.originX = 0.4;   
                }
            } else if (this.keys.left.isDown) {
                if (this.activeLeft) {
                    this.ninja.setVelocityX(-500);
                    this.ninja.setFlipX(true);
                    this.camaramain.originX = 0.6;   
                }
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

            if (this.aKeys.z.isDown && !this.ninja.body.touching.down && !this.isDash) {
                if (!this.ninja.flipX) {
                    this.tweens.add({
                        targets: this.ninja,
                        x: this.ninja.x + 200,
                        ease: 'linear',
                        duration: 70
                    })
                } else if (this.ninja.flipX) {
                    this.tweens.add({
                        targets: this.ninja,
                        x: this.ninja.x - 200,
                        ease: 'linear',
                        duration: 70
                    })
                }
                this.isDash = true;
            }
            if (this.ninja.body.touching.down) {
                this.isDash = false;
            }
            if (this.aKeys.c.isDown) {
                console.log('x: ' + this.ninja.x + ' y: ' + this.ninja.y);
            }
        }


        if(this.ninja.y > 1500) {
            this.camaramain.fade(1000, 0, 0, 0);
            setTimeout(() => {
                this.scene.restart();
            }, 1000)
        }

    }
}
