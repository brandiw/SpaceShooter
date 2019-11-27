let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "game", {
  init: init,
  preload: preload,
  create: create,
  update: update
})

function init() {
  displayHighScores()
}

function preload() {
  // Set physics
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // Load all images
  game.load.image('bg', '../assets/img/cool-space-background.jpg')
  game.load.image('player', '../assets/img/ship.png')
  game.load.image('enemy', '../assets/img/enemy.png')
  game.load.image('laser', '../assets/img/beam.png')
  game.load.image('missile', '../assets/img/missile.png')

  // Load animation assets
  game.load.spritesheet('smallExplosion', '../assets/img/explosion.png', 64, 64)
  game.load.spritesheet('bigExplosion', '../assets/img/explode.png', 128, 128)

  // Load all sounds
  game.load.audio('music', '../assets/audio/Shadelike.mp3')
  game.load.audio('boomSound', '../assets/audio/explosion.mp3')
  game.load.audio('nukeSound', '../assets/audio/ExplosionNuke.mp3')
  game.load.audio('launchLaser', '../assets/audio/laser.mp3')
  game.load.audio('launchMissile', '../assets/audio/Missile.mp3')

  // Load Fonts
  game.load.bitmapFont('carrierCommand', '../assets/fonts/carrier_command.png', '../assets/fonts/carrier_command.xml')
}

function create() {
  // Create the background and make it scroll
  let background = game.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg')
  background.autoScroll(-20, 0)

  // Setup Sounds & Start background music
  boomSound = game.add.audio('boomSound', 0.3)
  music = game.add.audio('music')
  music.play()

  // Create laser objects for shooting
  let lasers = game.add.group()
  lasers.enableBody = true
  lasers.physicsBodyType = Phaser.Physics.ARCADE
  lasers.createMultiple(30, 'laser')
  lasers.setAll('outOfBoundsKill', true)
  lasers.setAll('checkWorldBounds', true)

  // Create missle objects for shooting
  let missiles = game.add.group()
  missiles.enableBody = true
  missiles.physicsBodyType = Phaser.Physics.ARCADE
  missiles.createMultiple(30, 'missile')
  missiles.setAll('outOfBoundsKill', true)
  missiles.setAll('checkWorldBounds', true)

  // Initialize WEAPONS array
  WEAPONS.push(new Weapon('laser',
    450,
    25,
    0.210,
    lasers,
    game.add.audio('launchLaser', 0.2),
    boomSound,
    { x: 10, y: 20}))
  WEAPONS.push(new Weapon('missile',
    275,
    100,
    0.550,
    missiles,
    game.add.audio('launchMissile', 1.5),
    game.add.audio('nukeSound', 0.5),
    { x: 10, y: 25}))

  // Create the player and place it inside the world bounds
  player = game.add.sprite(50, Math.floor(GAME_HEIGHT / 2) - 64, 'player')
  game.physics.arcade.enable(player)
  player.body.collideWorldBounds = true
  player.life = STARTING_LIFE
  player.score = 0

  // Create enemy objects, destroy when they leave the screen
  enemies = game.add.group()
  enemies.enableBody = true
  enemies.physicsBodyType = Phaser.Physics.ARCADE
  enemies.createMultiple(50, 'enemy')
  enemies.setAll('outOfBoundsKill', true)
  enemies.setAll('checkWorldBounds', true)

  // Create explosion objects and their animations
  explosions = game.add.group()
  explosions.createMultiple(20, 'smallExplosion')
  explosions.forEach(ex => {
    ex.animations.add('smallExplosion')
  })

  bigExplosions = game.add.group()
  bigExplosions.createMultiple(10, 'bigExplosion')
  bigExplosions.forEach(ex => {
    ex.animations.add('bigExplosion')
  })

  // Keyboard Listeners
  cursors = game.input.keyboard.createCursorKeys()
  game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER])

  // Initial Text
  initializeText()
}

function update() {
  // Stop the player
  // player.body.velocity.set(0) // Stop entirely
  player.body.drag.set(DEFAULT_SPEED) // Stop slowly

  // Keyboard detection
  if (cursors.left.isDown) { // Move left
    player.body.velocity.x = -DEFAULT_SPEED
  }
  else if (cursors.right.isDown) { // Move right
    player.body.velocity.x = DEFAULT_SPEED
  }
  if (cursors.up.isDown) { // Move up
    player.body.velocity.y = -DEFAULT_SPEED
  }
  else if (cursors.down.isDown) { // Move down
    player.body.velocity.y = DEFAULT_SPEED
  }

  // Check if the level should be incremented
  if (player.score > level * LEVEL_INCREMENT) {
    level++
    updateLevelText()
    setTimeout(removeLevelText, 2000)
  }

  // Listen for spacebar and enter keys
  if (nextFire <= game.time.totalElapsedSeconds() && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
    nextFire = game.time.totalElapsedSeconds() + WEAPONS[currentWeapon].delay
    WEAPONS[currentWeapon].fire()
  }
  if (nextWeaponSwitch <= game.time.totalElapsedSeconds() && game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
    nextWeaponSwitch = game.time.totalElapsedSeconds() + SWITCH_WEAPON_DELAY
    currentWeapon++
    if (currentWeapon >= WEAPONS.length) {
      currentWeapon = 0
    }
    console.log('Current Weapon', WEAPONS[currentWeapon].name)
  }

  // Launch enemy waves
  if (player.life > 0 && nextEnemyWave <= game.time.totalElapsedSeconds()) {
    launchEnemies()
    nextEnemyWave = game.time.totalElapsedSeconds() + Math.random() + 0.5
  }

  // Collision detection
  game.physics.arcade.overlap(player, enemies, damagePlayer)
  for (let i = 0; i < WEAPONS.length; i++) {
    game.physics.arcade.overlap(enemies, WEAPONS[i].group, hitEnemy)
  }
}







