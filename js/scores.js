function addScore(amount){
  player.score += amount;
  scoreText.text = "Score: " + player.score.toString();
}

function gameOver(){
  var scores = getHighScores();

  if(scores.length < SCORE_SLOTS || scores[SCORE_SLOTS - 1].score < player.score){
    //Add initials prompt
    swal({
      title: "New High Score!",
      text: "Please enter your initials:",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      inputPlaceholder: "Write something"
    },
    function(inputValue){
      if (!inputValue) return false;

      if (inputValue.length < 3 || inputValue.length > 25) {
        swal.showInputError("You need to write between 3 and 25 letters!");
        return false;
      }

      addNewScore(inputValue, player.score, scores);

      swal({
        title: "Nice!",
        text: "Thanks " + inputValue + ", your victory has been recorded!!",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Sweet! Thanks!",
        closeOnConfirm: true
      },
      function(){
        displayHighScores();
      });
    });
  }
  else{
    swal({
        title: "Nice Try!",
        text: "You didn't get a high score... better luck next time!",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Oh well!",
        closeOnConfirm: true
      },
      function(){
        displayHighScores();
      });
  }
}

function getHighScores(){
  var scores;
  if(localStorage.spaceshooterScores){
    scores = JSON.parse(localStorage.spaceshooterScores)
  }

  if(!scores){
    scores = [];
  }

  return scores;
}

function displayHighScores(){
  var scores = getHighScores();
  document.getElementById('score-table').innerHTML = '';

  for(var i = 0; i < scores.length; i++){
    var tr = document.createElement('tr');
    var tdInitials = document.createElement('td');
    var tdScore = document.createElement('td');

    tdInitials.textContent = scores[i].initials;
    tdScore.textContent = scores[i].score;

    tr.appendChild(tdInitials);
    tr.appendChild(tdScore);
    document.getElementById('score-table').appendChild(tr);
  }
}

function addNewScore(initials, score, allScores){
  allScores.push({initials: initials, score: score});
  allScores.sort(function(a, b){
    return b.score > a.score;
  });

  allScores = allScores.slice(0, SCORE_SLOTS);
  localStorage.spaceshooterScores = JSON.stringify(allScores);
}
