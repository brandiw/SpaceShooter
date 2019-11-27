// Constants
const DEFAULT_SPEED = 250
const GAME_HEIGHT = 350
const GAME_WIDTH = 600
const LEVEL_INCREMENT = 100
const SCORE_SLOTS = 3
const STARTING_LIFE = 50
const STARTING_LIFE_ENEMY = 75
const SWITCH_WEAPON_DELAY = 0.5
const WEAPONS = []

// Globals
let boomSound
let currentWeapon = 0
let cursors
let enemies
let explosions, bigExplosions
let level = 1
let music
let nextEnemyWave = 0, nextWeaponSwitch = 0, nextFire = 0
let player
let scoreText, hpText, levelText
