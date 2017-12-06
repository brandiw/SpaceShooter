// Weapons Management
function fireWeapon(){
  if(game.time.now < weaponTimer || player.life <= 0){
    return;
  }

  var weapon;
  if(WEAPONS[currentWeapon].name === 'Laser'){
    weapon = lasers.getFirstExists(false);
    pewpew.play();
  }
  else if(WEAPONS[currentWeapon].name === 'Missle'){
    weapon = missiles.getFirstExists(false);
    nukelaunch.play();
  }

  weapon.reset(player.x, player.y + WEAPONS[currentWeapon].offset);
  weapon.body.velocity.x = WEAPONS[currentWeapon].velocity;
  weaponTimer = game.time.now + WEAPONS[currentWeapon].timer; //time til next one can fire
}

function switchWeapon(){
  if(game.time.now < switchTimer){
    return;
  }

  currentWeapon += 1;
  if(currentWeapon >= WEAPONS.length){
    currentWeapon = 0;
  }
  switchTimer = game.time.now + SWITCH_WEAPON_TIMER;
}

// Collision Handling
function hitEnemy(laser, enemy){
  var explosion = explosions.getFirstExists(false);
  explosion.reset(enemy.body.x, enemy.body.y);
  explosion.play('smallboom', 30, false, true);
  kaboom.play();

  laser.kill();
  enemy.life -= 15;

  if(enemy.life <= 0){
    enemy.kill();
    addScore(10);
  }
}

function nukeEnemy(missile, enemy){
  var nuke = nukes.getFirstExists(false);
  nuke.reset(enemy.body.x, enemy.body.y);
  nuke.play('boom', 30, false, true);
  nukeboom.play();

  enemy.life -= 100;

  if(enemy.life <= 0){
    enemy.kill();
    addScore(10);
  }
  missile.kill();
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
  else if(player.life < 50){
    player.tint = '0xff0000';
  }
}

// Enemy Spawning: Simple version
// function spawnEnemy(){
//   var enemy = enemies.getFirstExists(false);
//   enemy.anchor.setTo(0.5);
//   // Uncomment the following lines to change the sprite size
//   // var scale = game.rnd.integerInRange(1, 2);
//   // enemy.scale.setTo(scale);
//   enemy.reset(game.world.width, game.rnd.integerInRange(50, game.world.height - 50));
//   enemy.body.velocity.x = -250;
// }

//Randomized baddies
function launchRandomlySpacedEnemies(thisObj) {
    var numberOfEnemiesToCreate = Math.floor(Math.random() * (level+1));

    for(var i = 0; i < numberOfEnemiesToCreate; i++){
      var enemy = enemies.create(GAME_WIDTH, Math.floor(Math.random() * GAME_HEIGHT), 'enemy');
      enemy.body.velocity.x = Math.floor(Math.random() * ENEMY_SPEED_MAX - ENEMY_SPEED_MIN) + ENEMY_SPEED_MIN;
      enemy.body.velocity.y = game.rnd.integerInRange(-200, 200);
      enemy.body.drag.y = 30;
      enemy.life = 60;
    }
}
