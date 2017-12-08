var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "game",
  {init:init, preload:preload, create:create, update:update});
var bg, music;
var player;
var cursors; //keyboard input

function init(){
  game.enterKeyUp = true;
  displayHighScores();
}

function preload(){
  //Set physics
  //Load all
}

function create(){
  // Create the background and make it scroll

  // Setup Sounds & Start background music

  // Create the player and place it inside the world bounds

  // Create laser objects for shooting

  // Create missle objects for shooting

  // Create enemy objects, destroy when they leave the screen

  // Create explosion objects and their animations

  // Keyboard Listeners
  // Initial Text
}

function update(){
  //Keyboard detection
  //Collision detection
}
