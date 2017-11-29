var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "game",
  {init:init, preload:preload, create:create, update:update});
var bg;
var player;
var cursors;
var laserTimer = 0;
var enemies, lasers, explosions;
var scoreText, hpText;
var pewpew, kaboom;

function init(){
  this.enterKeyUp = true;
}

function preload(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.load.image('bg', '../assets/img/cool-space-background.jpg')
  game.load.image('player', '../assets/img/ship.png');
  game.load.image('laser', '../assets/img/beam.png');
  game.load.image('missile', '../assets/img/missile.png');
  game.load.image('enemy', '../assets/img/enemy.png');
  game.load.image('enemy1', '../assets/img/enemy1.png');
  game.load.image('enemy2', '../assets/img/enemy2.png');
  game.load.image('fireball', '../assets/img/Fireball.png');
  game.load.spritesheet('boom', '..assets/img/explode.png', 128, 128);
  game.load.spritesheet('smallboom', '../assets/img/explosion.png', 64, 64);

  game.load.audio('pewpew', ['../assets/audio/laser.mp3', 'assets/laser.ogg']);
  game.load.audio('kaboom', ['../assets/audio/explosion.mp3', 'assets/explosion.ogg']);
}

function create(){
  // Create the background and make it scroll
  bg = game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');
  bg.autoScroll(-30, 0);

  // Create the player and place it inside the world bounds
  player = game.add.sprite(64, 200, 'player');
  player.anchor.setTo(0.5);
  game.physics.arcade.enable(player);
  player.body.collideWorldBounds = true;
  player.score = 0;
  player.life = STARTING_LIFE;

  // Create laser objects for shooting
  lasers = game.add.group();
  lasers.enableBody = true;
  lasers.physicsBodyType = Phaser.Physics.ARCADE;
  lasers.createMultiple(30, 'laser');
  lasers.setAll('anchor.x', 0.5);
  lasers.setAll('anchor.y', 1);
  lasers.setAll('outOfBoundsKill', true);
  lasers.setAll('checkWorldBounds', true);

  // Create enemy objects, destroy when they leave the screen
  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.createMultiple(30, 'enemy');
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds', true);

  // Create explosion objects and their animations
  explosions = game.add.group();
  explosions.createMultiple(20, 'smallboom');
  explosions.setAll('anchor.x', 0.5);
  explosions.setAll('anchor.y', 0.5);
  explosions.forEach(function(explosion){
    explosion.animations.add('smallboom');
  }, this);

  // Keyboard
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER ]);

  // Sounds
  pewpew = game.add.audio('pewpew', 0.4, false);
  kaboom = game.add.audio('kaboom', 0.9, false);

  // Text
  scoreText = game.add.text(GAME_WIDTH - 180, 460,'Score: 0', {fill: '#fff'});
  hpText = game.add.text(GAME_WIDTH - 180, 20,'HP: ' + player.life.toString(), {fill: '#fff'});

  // Spawn Enemies!
  game.time.events.loop(Phaser.Timer.SECOND * 2, spawnEnemy, this);
}

function update(){
  player.body.velocity.set(0);

  if (cursors.left.isDown) {
    player.body.velocity.x = -DEFAULT_SPEED;
  }
  else if (cursors.right.isDown) {
    player.body.velocity.x = DEFAULT_SPEED;
  }
  if (cursors.up.isDown) {
    player.body.velocity.y = -DEFAULT_SPEED;
  }
  else if (cursors.down.isDown) {
    player.body.velocity.y = DEFAULT_SPEED;
  }

  if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
    fireLaser();
  }
  if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
    switchWeapon();
  }

  //Collision detection
  game.physics.arcade.overlap(lasers, enemies, hitEnemy, null, this);
  game.physics.arcade.overlap(player, enemies, selfDamage, null, this);
}
