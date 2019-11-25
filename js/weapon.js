class Weapon {
  constructor(delay, velocity, offset, name, group) {
    this.delay = delay
    this.velocity = velocity
    this.offset = offset
    this.name = name
    this.group = group
  }

  fireWeapon() {
    if (game.time.now < weaponTimer || player.life <= 0) {
      return
    }

    var weapon = this.group.getFirstExists(false)
    this.sound.play()

    weapon.reset(player.x, player.y + this.offset)
    weapon.body.velocity.x = this.velocity
    weaponTimer = game.time.now + this.delay //time til next one can fire
  }
}
