CONST={
    MURLOC_DEFAULT_POSITION_X : 200,
    MURLOC_DEFAULT_POSITION_Y : 200,
    MURLOC_DEFAULT_HEALTH : 30,
    MURLOC_DEFAULT_FIRERATE : 500,
    WORLD_WIDTH : 10000,
    WORLD_HEIGHT : 10000,
    TOUCH_SCALING : 2

}
DEBUG = {
    TP : function (x,y){
        murlocList[myId].murloc.position.set(x,y);
    }
}
var easeInSpeed = function(x){
        return x * Math.abs(x) / 2000;
    };
Controls=function(){
    this.speed={
        x : 0,
        y : 0
    }
    this.up=false;
    this.down=false;
    this.left=false;
    this.right=false;
}
Murloc=function(index,game,player,startPosition){
    this.position={};
    if (!startPosition){
        this.position.x=CONST.MURLOC_DEFAULT_POSITION_X;
        this.position.y=CONST.MURLOC_DEFAULT_POSITION_Y;
    } else {
        this.position.x=startPosition.x || CONST.MURLOC_DEFAULT_POSITION_X;
        this.position.y=startPosition.y || CONST.MURLOC_DEFAULT_POSITION_X;
    }
    
    this.inputBuffer=new Controls();
    this.curentControls=new Controls();


    this.id=index;
    this.player=player;
    this.game=game;
    this.health=CONST.MURLOC_DEFAULT_HEALTH;


    this.bullets=this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(20, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);  

    this.fireRate = CONST.MURLOC_DEFAULT_FIRERATE;
    this.nextFire = 0;
    this.isAlive = true;

    this.murloc = this.game.add.sprite(this.position.x,this.position.y, 'murloc');
    this.murloc.anchor.set(0.5);
    this.game.physics.arcade.enable(this.murloc);
    
    
    this.murloc.animations.add('walkDown', [0 ,1 ,2 ,3 ,4 ,5 ,6 ,7], 20 /*fps */, true);
    this.murloc.animations.add('walkUp',   [8 ,9 ,10,11,12,13,14,15], 20 /*fps */, true);
    this.murloc.animations.add('walkLeft', [16,17,18,19,20,21,22,23], 20 /*fps */, true);
    this.murloc.animations.add('walkRight',[24,25,26,27,28,29,30,31], 20 /*fps */, true);
    //this.murloc.body.immovable = false;
    //this.murloc.body.bounce.setTo(0, 0);  // ?
    this.murloc.body.collideWorldBounds=true;
    
    
}
Murloc.prototype.update = function() {
    for (var i in this.inputBuffer)
        this.curentControls[i]=this.inputBuffer[i];
    for (var i in this.curentControls.speed){ //!!!!!!!!!!!REMEMBER;
        this.curentControls.speed[i]*=-CONST.TOUCH_SCALING;
    }
    this.murloc.body.velocity.x=0;
    this.murloc.body.velocity.y=0;

    //var speed=this.curentControls.speed;

    if (this.curentControls.up){
        this.murloc.body.velocity.y=this.curentControls.speed.y;
        this.murloc.play('walkUp');
    } else if (this.curentControls.down){
        this.murloc.body.velocity.y=this.curentControls.speed.y;
        this.murloc.play('walkDown');       
    } else if (this.curentControls.left){
        this.murloc.body.velocity.x=this.curentControls.speed.x;
        this.murloc.play('walkLeft');
    } else if (this.curentControls.right){
        this.murloc.body.velocity.x=this.curentControls.speed.x;
        this.murloc.play('walkRight');
    } else {
        this.murloc.animations.stop(0,true);
    }
};
Murloc.prototype.fire = function(target) {
    // body...
};

var mainFunctions={
     preload: preload, 
     create: create,
     update: update, 
     render: render 
    }
var game=new Phaser.Game(500,500,Phaser.AUTO,'PhaserGame',mainFunctions);
var murloc=null;
var myId=0;
var murlocList={};
function preload(){
    game.load.spritesheet('murloc', 'assets/murloc.png', 72, 96, 32);
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('background', 'assets/background.png');
    this.load.image('compass', 'assets/compass_rose.png');
    this.load.image('touch_segment', 'assets/touch_segment.png');
    this.load.image('touch', 'assets/touch.png');
    
}
function create(){
    game.world.setBounds(0, 0, CONST.WORLD_WIDTH, CONST.WORLD_HEIGHT);
    game.stage.disableVisibilityChange  = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.touchControl = game.plugins.add(Phaser.Plugin.TouchControl);
    game.touchControl.inputEnable();
    game.touchControl.settings.singleDirection=true;

    this.tilesprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background');
    this.tilesprite.scale.set(1);


    murloc=new Murloc(myId,game,null);
    murlocList[myId]=murloc;
    this.game.camera.follow(murlocList[myId].murloc);
    var testDude=new Murloc(1,game,null,{x:1000,y:1000});
    

    
    //game.camera.deadzo/ne = new Phaser.Rectangle(150, 150, 500, 300);
    //game.camera.focusOnXY(0, 0);
}
function update(){
    murloc.inputBuffer.speed.x=game.touchControl.speed.x;
    murloc.inputBuffer.speed.y=game.touchControl.speed.y;
    murloc.inputBuffer.up=game.touchControl.cursors.up;
    murloc.inputBuffer.down=game.touchControl.cursors.down;
    murloc.inputBuffer.left=game.touchControl.cursors.left;
    murloc.inputBuffer.right=game.touchControl.cursors.right;

    murloc.update();

}
function render(){
    game.debug.cameraInfo(game.camera, 32, 32);
};
