const launchEnemies = () => {
  // Decide how many enemies to spawn
  let numEnemies = Math.floor(Math.random() * (level + 1))

  for (let i = 0; i < numEnemies; i++) {
    let enemy = enemies.create(GAME_WIDTH, Math.floor(Math.random() * GAME_HEIGHT), 'enemy')
    enemy.body.velocity.x = -(Math.floor(Math.random() * 300) + 100)
    enemy.body.velocity.y = Math.floor(Math.random() * 100) - 50
    enemy.life = STARTING_LIFE_ENEMY
  }
}

const playExplosion = (x, y, type) => {
  let explosion
  if (type === 'big') {
    explosion = bigExplosions.getFirstExists(false)
    explosion.reset(x, y)
    explosion.play('bigExplosion', 30, false, true)
  }
  else {
    explosion = explosions.getFirstExists(false)
    explosion.reset(x, y)
    explosion.play('smallExplosion', 30, false, true)
  }
}

const damagePlayer = (playerObj, enemyObj) => {
  // Play the boom sound
  boomSound.play()

  // Play the explosion animation
  playExplosion(player.body.x, player.body.y)

  // Destroy the enemy
  enemyObj.kill()

  // Add to the player's score and update the text
  addToScore(10)

  // Decrement the player's life and update text
  player.life -= 10
  hpText.text = 'Life: ' + player.life

  // If the player's life less than zero, die
  if (player.life <= 0) {
    gameOver()
  }
  else if (player.life < 25) { // If less than X, tint to red
    player.tint = '0xff0000'
  }
}

const hitEnemy = (enemyObj, weaponObj) => {
  WEAPONS[currentWeapon].doDamage(enemyObj, weaponObj)
}
