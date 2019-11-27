class Weapon {
  constructor(name, velocity, damage, delay, group, launchSound, boomSound, offset) {
    this.name = name
    this.velocity = velocity
    this.damage = damage
    this.delay = delay
    this.group = group
    this.launchSound = launchSound
    this.boomSound = boomSound
    this.offset = offset
  }

  fire() {
    if (player.life > 0) {
      // Play a launch sound
      this.launchSound.play()

      // Grab an instance of the weapon from weapon group
      let weapon = this.group.getFirstExists(false)

      // Set the weapon instance into the game world, starting at the player's x, y coords
      weapon.reset(player.x + this.offset.x, player.y + this.offset.y)

      // Give the weapon a velocity (this.velocity)
      weapon.body.velocity.x = this.velocity
    }
  }

  doDamage(enemyObj, weaponObj) {
    // Destroy weapon
    weaponObj.kill()

    // Play explosion on enemy
    playExplosion(enemyObj.body.x, enemyObj.body.y)

    // Play the boom sound
    this.boomSound.play()

    // Decrement the enemy's life
    enemyObj.life -= this.damage

    // Find out if the enemy has life left
    if (enemyObj.life <= 0) {
      // Play big explosion on enemy
      playExplosion(enemyObj.body.x, enemyObj.body.y, 'big')
      enemyObj.kill()
      addToScore(25)
    }
  }
}
