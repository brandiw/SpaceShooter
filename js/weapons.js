// Weapons Management
function fireLaser(){
  console.log('fire laser');
}

function switchWeapon(){
  console.log('switch weapon')
}

// Collision Handling
function hitEnemy(){
  console.log('hitEnemy');
}

function collideShips(){
  console.log('collide ships');
}

// Enemy Spawning
function spawnEnemy(){
  console.log('spawn enemy');
  var enemy = enemies.getFirstExists(false);
  enemy.anchor.setTo(0.5);
  // Uncomment the following lines to change the sprite size
  // var scale = game.rnd.integerInRange(1, 2);
  // enemy.scale.setTo(scale);
  enemy.reset(game.world.width, game.rnd.integerInRange(50, game.world.height - 50));
  enemy.body.velocity.x = -250;
}
