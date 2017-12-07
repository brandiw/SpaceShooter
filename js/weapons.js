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
