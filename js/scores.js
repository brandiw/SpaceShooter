const getHighScores = () => {
  let allScores
  if (localStorage.spaceGameScores) {
    allScores = JSON.parse(localStorage.spaceGameScores)
  }
  console.log('ALLSCORES', allScores)
  return allScores || []
}

const addNewHighScore = (initials, allScores) => {
  // Adding new score
  allScores.push({
    initials: initials,
    score: player.score,
    level: level
  })

  // Sorting by score
  allScores.sort((a, b) => {
    return b.score - a.score
  })

  // Limit to number of SCORE_SLOTS available
  allScores = allScores.slice(0, SCORE_SLOTS)

  // Write out to the localStorage
  localStorage.spaceGameScores = JSON.stringify(allScores)
}

const gameOver = () => {
  // Remove player from game
  player.kill()

  // Stop the music
  music.pause()

  // Get the high scores, decide whether current score is worthy
  let allScores = getHighScores()
  if (allScores.length < SCORE_SLOTS || allScores[SCORE_SLOTS - 1].score < player.score) {
    // This is a new high score
    swal({
      title: 'New High Score!',
      text: 'Please enter your initials',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      inputPlaceholder: 'Your initials here'
    }, input => {
      if (!input || input.length < 2 || input.length > 5) {
        swal.showInputError('You need to provide 2 to 5 characters')
        return false
      }

      addNewHighScore(input, allScores)

      // Tell the user their score was recorded
      swal({
        title: 'Nice!',
        text: `Thanks ${input}, your victory has been recorded!`,
        type: 'warning',
        showCancelButton: false,
        closeOnConfirm: true,
        confirmButtonText: 'Sweet, thanks'
      }, () => {
        displayHighScores()
      })
    })
  }
  else {
    // Not a high score, show a consolation phrase
    swal({
      title: 'Nice Try!',
      text: 'Not a high score; try again next time!',
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Oh Well!',
      closeOnConfirm: true
    })
  }
}

const displayHighScores = () => {
  // Get the scores from the browser's localStorage
  let allScores = getHighScores()

  // Empty the score table
  document.getElementById('score-table').innerHTML = ''

  // For each score; create HTML elements to display it
  for (let i = 0; i < allScores.length; i++) {
    // Create the DOM elements
    let tr = document.createElement('tr')
    let tdInitials = document.createElement('td')
    let tdScore = document.createElement('td')
    let tdLevel = document.createElement('td')

    // Set the text of the table cells
    tdInitials.textContent = allScores[i].initials
    tdScore.textContent = allScores[i].score
    tdLevel.textContent = allScores[i].level

    // Add row to table in the DOM
    tr.append(tdInitials)
    tr.append(tdScore)
    tr.append(tdLevel)
    document.getElementById('score-table').append(tr)
  }
}

const addToScore = amount => {
  player.score += amount
  scoreText.text = 'Score: ' + player.score
}

const initializeText = () => {
  scoreText = game.add.bitmapText(GAME_WIDTH - 180, 300, 'carrierCommand', 'Score: 0', 12)
  scoreText.tint = '0xffffff'
  hpText = game.add.bitmapText(GAME_WIDTH - 180, 325, 'carrierCommand', 'Life: ' + player.life, 12)
  hpText.tint = '0xffffff'
  levelText = game.add.bitmapText(GAME_WIDTH / 2 - 50, GAME_HEIGHT / 2 - 50, 'carrierCommand', 'Level ' + level, 16)
  levelText.tint = '0xffffff'
  setTimeout(removeLevelText, 2000)
}

const updateLevelText = () => {
  levelText.text = 'Level ' + level
}

const removeLevelText = () => {
  levelText.text = ''
}
