var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "game",
  {init:init, preload:preload, create:create, update:update});
var bg, music;
var player;
var cursors; //keyboard input
var enemies, lasers, explosions, nukes; //fighting/shooting
var scoreText, hpText, levelText; //text
var pewpew, kaboom, nukeboom; //sounds
var weaponTimer = 0, switchTimer = 0; //delay firing time
var currentWeapon = 0; //current weapon index
var nextEnemyFire = 2;
var level = 1;

function init(){
  game.enterKeyUp = true;
  displayHighScores();
}

function preload(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.load.image('bg', '/SpaceShooter/assets/img/cool-space-background.jpg')
  game.load.image('player', '/SpaceShooter/assets/img/ship.png');
  game.load.image('laser', '/SpaceShooter/assets/img/beam.png');
  game.load.image('missile', '/SpaceShooter/assets/img/missile.png');
  game.load.image('enemy', '/SpaceShooter/assets/img/enemy.png');
  game.load.image('enemy1', '/SpaceShooter/assets/img/enemy1.png');
  game.load.image('enemy2', '/SpaceShooter/assets/img/enemy2.png');
  game.load.image('fireball', '/SpaceShooter/assets/img/Fireball.png');
  game.load.spritesheet('boom', '/SpaceShooter/assets/img/explode.png', 128, 128);
  game.load.spritesheet('smallboom', '/SpaceShooter/assets/img/explosion.png', 64, 64);

  game.load.audio('pewpew', ['/SpaceShooter/assets/audio/laser.mp3', '/SpaceShooter/assets/laser.ogg']);
  game.load.audio('nukelaunch', ['/SpaceShooter/assets/audio/Missile.mp3']);
  game.load.audio('kaboom', ['/SpaceShooter/assets/audio/explosion.mp3', '/SpaceShooter/assets/explosion.ogg']);
  game.load.audio('nukeboom', ['/SpaceShooter/assets/audio/ExplosionNuke.mp3']);
  game.load.audio('music', ['/SpaceShooter/assets/audio/Shadelike.mp3']);
}

function create(){
  // Create the background and make it scroll
  bg = game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');
  bg.autoScroll(-30, 0);

  // Sounds
  pewpew = game.add.audio('pewpew', 0.01, false);
  kaboom = game.add.audio('kaboom', 0.3, false);
  nukeboom = game.add.audio('nukeboom', 0.6, false);
  nukelaunch = game.add.audio('nukelaunch', 0.5, false);
  music = game.add.audio('music');
  music.play(); //background

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
  lasers.createMultiple(20, 'laser');
  lasers.setAll('anchor.x', 0.5);
  lasers.setAll('anchor.y', 1);
  lasers.setAll('outOfBoundsKill', true);
  lasers.setAll('checkWorldBounds', true);

  // Create missle objects for shooting
  missiles = game.add.group();
  missiles.enableBody = true;
  missiles.physicsBodyType = Phaser.Physics.ARCADE;
  missiles.createMultiple(20, 'missile');
  missiles.setAll('anchor.x', 0.5);
  missiles.setAll('anchor.y', 1);
  missiles.setAll('outOfBoundsKill', true);
  missiles.setAll('checkWorldBounds', true);

  // Create enemy objects, destroy when they leave the screen
  enemies = game.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;
  enemies.createMultiple(50, 'enemy');
  enemies.setAll('outOfBoundsKill', true);
  enemies.setAll('checkWorldBounds', true);

  // Create explosion objects and their animations
  explosions = game.add.group();
  explosions.createMultiple(30, 'smallboom');
  explosions.setAll('anchor.x', 0.5);
  explosions.setAll('anchor.y', 0.5);
  explosions.forEach(function(explosion){
    explosion.animations.add('smallboom');
  }, this);

  nukes = game.add.group();
  nukes.createMultiple(20, 'boom');
  nukes.setAll('anchor.x', 0.5);
  nukes.setAll('anchor.y', 0.5);
  nukes.forEach(function(nuke){
    nuke.animations.add('boom');
  }, this);

  // Keyboard
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER ]);

  // Text
  scoreText = game.add.text(GAME_WIDTH - 180, 460,'Score: 0', {fill: '#fff'});
  hpText = game.add.text(GAME_WIDTH - 180, 20,'HP: ' + player.life.toString(), {fill: '#fff'});

  // Spawn Enemies!
  //game.time.events.loop(Phaser.Timer.SECOND * 2, spawnEnemy, this);
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
    fireWeapon();
  }
  if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
    switchWeapon();
  }

  if(level * LEVEL_INCREMENT < player.score){
    level++;
    console.log('incrementing level', level);
    showLevelText();
    setTimeout(removeLevelText, 1000);
  }

  if(player.life > 0 && nextEnemyFire <= game.time.totalElapsedSeconds()){
    launchRandomlySpacedEnemies();
    nextEnemyFire += Math.floor(Math.random() * 0.5) + 0.5;
  }

  //Collision detection
  game.physics.arcade.overlap(lasers, enemies, hitEnemy, null, this);
  game.physics.arcade.overlap(missiles, enemies, nukeEnemy, null, this);
  game.physics.arcade.overlap(player, enemies, selfDamage, null, this);
}
