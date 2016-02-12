var TokenEnum = {
  Empty: 0,
  X: 1,
  O: -1
};

var field_object = {
  0: TokenEnum.Empty,
  1: TokenEnum.Empty,
  2: TokenEnum.Empty,
  3: TokenEnum.Empty,
  4: TokenEnum.Empty,
  5: TokenEnum.Empty,
  6: TokenEnum.Empty,
  7: TokenEnum.Empty,
  8: TokenEnum.Empty,
  length: 9
};

var player = TokenEnum.O;
var ai = TokenEnum.X;
var ai_last_played_position = null;
var game_over = false;

function setup() {
  $("#0").click(function(event) {
    user_click(event);
  });
  $("#1").click(function(event) {
    user_click(event);
  });
  $("#2").click(function(event) {
    user_click(event);
  });
  $("#3").click(function(event) {
    user_click(event);
  });
  $("#4").click(function(event) {
    user_click(event);
  });
  $("#5").click(function(event) {
    user_click(event);
  });
  $("#6").click(function(event) {
    user_click(event);
  });
  $("#7").click(function(event) {
    user_click(event);
  });
  $("#8").click(function(event) {
    user_click(event);
  });
  $("#reset").click(function(event) {
    reset();
  });
  //Ask player what they would like to play as
  var results = confirm("Would you like to play as X? Hit Cancel for O!");
  if (results) {
    player = TokenEnum.X;
    ai = TokenEnum.O;
  } else {
    player = TokenEnum.O;
    ai = TokenEnum.X;
  }
  ai_move();
}

function user_click(event) {
  //Check if move is legal
  if (field_object[event.target.id] != TokenEnum.Empty || game_over) {
    return;
  }
  //Place Token
  field_object[event.target.id] = player;
  updateDisplay();
  if (!game_over)
    ai_move();
}

function ai_move() {
  var current_places = calculateSpaces();
  var turn_over = false;
  var corner_locations = [0, 2, 6, 8];
  //Check if 1 move away from winning/losing!
  if (current_places.indexOf(2) != -1 || current_places.indexOf(-2) != -1) {
    var variable = current_places.indexOf(2 * ai) != -1 ? 2 * ai : -2 * ai;
    placeAvailable(current_places.indexOf(variable));
    turn_over = true;
  }
  //ai has not played yet, play first turn
  if (!turn_over && ai_last_played_position == null) {
    var position = corner_locations[Math.floor(Math.random() * 4)];
    field_object[position] = ai;
    ai_last_played_position = corner_locations[position];
    turn_over = true;
  }

  if (!turn_over) {
    var last_corner_played = corner_locations.indexOf(ai_last_played_position);
    //finds the next corner to play going up one, if to large then goes down one
    var next_corner = (last_corner_played + 1 <= corner_locations.length) ? last_corner_played + 1 : last_corner_played - 1;
    if (field_object[corner_locations[next_corner]] == TokenEnum.Empty) {
      field_object[corner_locations[next_corner]] = ai;
      ai_last_played_position = corner_locations[next_corner];
    } else { //If spot is taken then go the other way!
      next_corner = (last_corner_played - 1 <= -1) ? last_corner_played + 3 : last_corner_played - 1;
      //If that corner is also taken then go to the diagnal corner!
      if (field_object[corner_locations[next_corner]] != TokenEnum.Empty) {
        next_corner = (last_corner_played + 2 <= corner_locations.length) ? last_corner_played + 2 : last_corner_played - 2;
      }
      //Process next_corner
      field_object[corner_locations[next_corner]] = ai;
      ai_last_played_position = corner_locations[next_corner];
    }
  }

  updateDisplay();
}

//triggered if there are 2 in a row to block/win by calculating and placing in 3rd spot
function placeAvailable(row) {
  var offset;
  var count_incrament;
  var count;
  //Horzontal row placement
  if (row < 3) {
    offset = row * 3;
    count_incrament = 1;
    count = 0;
    //Virticle row placement
  } else if (row >= 3 && row < 6) {
    offset = row - 3
    count_incrament = 3;
    count = 0;
    //Diagnal row placement
  } else {
    row = row - 6;
    offset = 0;
    count = (row > 0) ? 6 : 0;
    count_incrament = 4 - (row * 6);
  }
  var turn_over = false;
  while (!turn_over && count < 10 && count > -1) {
    if (field_object[count + offset] == TokenEnum.Empty) {
      field_object[count + offset] = ai;
      turn_over = true;
    }
    count += count_incrament;
  }
}

//returns array [hr1, hr2, h3, vr1, vr2, vr3, dr0, dr1]
function calculateSpaces() {
  var results = [];
  //Horizontal Checks
  results.push(field_object[0] + field_object[1] + field_object[2]);
  results.push(field_object[3] + field_object[4] + field_object[5]);
  results.push(field_object[6] + field_object[7] + field_object[8]);
  //Virtical Checks
  results.push(field_object[0] + field_object[3] + field_object[6]);
  results.push(field_object[1] + field_object[4] + field_object[7]);
  results.push(field_object[2] + field_object[5] + field_object[8]);
  //Diagnal Checks
  results.push(field_object[0] + field_object[4] + field_object[8]);
  results.push(field_object[6] + field_object[4] + field_object[2]);

  return results;
}

function updateDisplay() {
  var empty_spaces = 0;
  for (var i = 0; i < field_object.length; ++i) {
    var token;
    switch (field_object[i]) {
      case TokenEnum.X:
        token = "X";
        break;
      case TokenEnum.O:
        token = "O";
        break;
      default:
        token = "";
        break;
    };
    $("#" + i).html(token);
    if (field_object[i] == TokenEnum.Empty) {
      ++empty_spaces;
    }
  }
  //Checks for win condition or tie
  if (empty_spaces == 0 || (calculateSpaces()).indexOf(3) != -1 || (calculateSpaces()).indexOf(-3) != -1) {
    game_over = true;
    alertOfGameEnd();
  }
}

function alertOfGameEnd() {
  var message;
  //Figure out winner or tie
  var winner;
  if ((calculateSpaces()).indexOf(3) != -1) {
    winner = 1;
  } else if ((calculateSpaces()).indexOf(-3) != -1) {
    winner = -1;
  } else {
    winner = 0
  }
  //make message
  switch (winner) {
    case 0:
      message = "Tie Game! Care to play again?";
      break;
    default:
      message = ai == winner ? "Computer wins! Care to play again?" : "Player wins! Care to play again?";
      //note player sould never win, but putting in to be proper
  }
  //Show screen and handle response
  var response = confirm(message);
  if (response) {
    reset();
  }
}

function reset() {
  for (var i = 0; i < field_object.length; ++i) {
    field_object[i] = TokenEnum.Empty;
  }
  game_over = false;
  ai_move();
}

$(document).ready(setup());