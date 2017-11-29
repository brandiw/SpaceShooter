// Weapons Management
function fireLaser(){
  if(game.time.now < laserTimer){
    return;
  }
  pewpew.play();
  var laser = lasers.getFirstExists(false);
  laser.reset(player.x, player.y + 10);
  laser.body.velocity.x = 400;
  laserTimer = game.time.now + 180; //time til next lazer can fire
}

function switchWeapon(){
  console.log('switch weapon');
}

// Collision Handling
function hitEnemy(laser, enemy){
  console.log('hitEnemy');
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x, enemy.body.y);
  explosion.play('smallboom', 30, false, true);
  kaboom.play();

  laser.kill();
  enemy.kill();
  addScore(10);
}

function selfDamage(player, object){
  var explosion = explosions.getFirstExists(false);
  explosion.reset(player.body.x, player.body.y);
  explosion.play('smallboom', 50, false, true);
  kaboom.play();

  addScore(10);
  object.kill();

  player.life -= 25;
  hpText.text = "HP: " + player.life.toString();
  if(player.life <= 0){
    player.kill();
    gameOver();
  }
  else if(player.life < 150){
    player.tint = '0xff0000';
  }
}

// Enemy Spawning
function spawnEnemy(){
  var enemy = enemies.getFirstExists(false);
  enemy.anchor.setTo(0.5);
  // Uncomment the following lines to change the sprite size
  // var scale = game.rnd.integerInRange(1, 2);
  // enemy.scale.setTo(scale);
  enemy.reset(game.world.width, game.rnd.integerInRange(50, game.world.height - 50));
  enemy.body.velocity.x = -250;
}
