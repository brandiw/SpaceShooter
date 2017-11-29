function addScore(amount){
  player.score += amount;
  scoreText.text = "Score: " + player.score.toString();
}

function gameOver(){
  //record player score
  console.log('game over. score was ' + player.score.toString());
}
