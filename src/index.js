import Phaser from "phaser";

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer, lavaLayer;
var text;
var score = 0;

// function killPlayer(player, lava) {
//     player.setVelocity(0,0);
//     player.setX(200);
//     player.setY(200);
// }

function preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    // tiles in spritesheet 
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // this.load.image('coin', 'assets/coinGold.png');

    this.load.image('background', 'assets/tonys_assets/castleBackground.jpg')
    // player animations
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
}

function create() {
    // load the map 
    map = this.make.tilemap({key: 'map'});
    // add a background image //
    let background = this.add.sprite(0, 0, 'background');

    background.setOrigin(0,0).setScale(3.75);
    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('Tile Layer 1', groundTiles, 0, 0);
    // create the lava layer
    // lavaLayer = map.createDynamicLayer('LavaLayer', groundTiles, 0,0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);
    // lavaLayer.setCollisionByExclusion([-1]);
    // this.physics.add.collider(this.player, this.lavaLayer, killPlayer, null, this);
    

    // // coin image used as tileset
    // var coinTiles = map.addTilesetImage('coin');
    // // add coins as tiles
    // coinLayer = map.createDynamicLayer('jewelLayer', coinTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite    
    player = this.physics.add.sprite(200, 200, 'player');
    player.setCollideWorldBounds(true); // don't go out of the map    

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width-35, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    // this.physics.add.collider(lavaLayer, player);

    // coinLayer.setTileIndexCallback(17, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    // this.physics.add.overlap(player, coinLayer);

    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 60,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });


    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);
}

// this function will be called when the player touches a coin
// function collectCoin(sprite, tile) {
//     coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
//     score++; // add 10 points to the score
//     text.setText(score); // set the text to show the current score
//     return false;
// }

function update(time, delta) {
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-500);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(500);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.setVelocityY(-820);        
    }
}