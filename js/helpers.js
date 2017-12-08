function showLevelText(){
  levelText = game.add.text(
    game.world.centerX - 120,
    game.world.centerY,
    "LEVEL " + level.toString() + "!",
    { font: "60px Arial", fill: "#ff0044", align: "center" });
}

function removeLevelText(){
  levelText.destroy();
}
