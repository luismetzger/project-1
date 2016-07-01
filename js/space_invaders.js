// Instance for the Game
function Game() {
    // Initial configs on how fast monster invaders will move and size of window
    this.config = {
        gameWidth: 400,
        gameHeight: 300,
        fps: 50,
        levelDifficultyMultiplier: 0.2,
        shipSpeed: 120,
        invaderInitialVelocity: 25,
        invaderAcceleration: 0,
        invaderDropDistance: 20,
        rocketVelocity: 130,
        rocketMaxFireRate: 2,
        invaderRanks: 5,
        invaderFiles: 10

    };
    // All state starts
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBound = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    this.intervalId = 0;
    this.score = 0;
    this.level - 1;
    // Empty object array to hold all key state's being called
    this.stateStack = [];

    // Inputs and canvas to render game
    this.pressedKeys = {};
    this.gameCanvas = null;

    //  All sounds.
    this.sounds = null;
}
Game.prototype = {
    initialize: function(gameCanvas) {
        //Set the game canvas
        this.gameCanvas = gameCanvas;

        // Set the game width and height
        this.width = gameCanvas.width;
        this.height = gameCanvas.height;

        // Set the state of game borders
        this.gameBound = {
            left: gameCanvas.width / 2 - this.config.gameWidth / 2,
            right: gameCanvas.width / 2 + this.config.gameWidth / 2,
            top: gameCanvas.height / 2 + this.config.gameHeight / 2,
            bottom: gameCanvas.height / 2 + this.config.gameHeight / 2
        };
    },
    currentState: function() {
        return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
    },
    moveToState: function(state) {
        // Are we already in a state?
        if(this.currentState() && this.currentState().leave) {
          this.currentState().leave(game);
          this.stateStack.pop();
        }

        if (state.enter) {
          state.enter(game);
        }

        // Set the current state
        this.stateStack.pop();
        this.stateStack.push(state);
    },
    pushState: function(state) {
         // If there is a new ENTER function for the new state call this function.
         if(state.enter) {
             state.enter(game);
         }
         // Set the current state.
         this.stateStack.push(state);
    },
    popState: function() {
        // Leave and pop function states are here
        if(this.currentState()) {
            if(this.currentState().leave) {
                this.currentState().leave(game);
            }
            // Set the current state.
            this.stateStack.pop();
        }
    },
    start: function() {
        // Welcome state
        this.moveToState(new WelcomeState());

        // Set the player life variable.
        this.lives = 3;

        // Start the game loop
        var game = this;
        this.intervalId = setInterval(function() {
            GameLoop(game);
        }, 1000 / this.config.fps);
    },
    // Let's the game know that they key is down
    keyDown: function(keyCode) {
        this.pressedKeys[keyCode] = true;
       //  Delegate to the current state
       if(this.currentState() && this.currentState().keyDown) {
           this.currentState().keyDown(this, keyCode);
       }
      //  console.log('keyDown is working');
    },
    // Let's the game know that the key is up
    keyUp: function(keyCode) {
        delete this.pressedKeys[keyCode];
        //  Delegate to the current state
        if(this.currentState() && this.currentState().keyUp) {
            this.currentState().keyUp(this, keyCode);
        }
        // console.log('keyUp is working');
    }
}

function GameLoop(game) {
    var currentState = game.currentState();

    if(currentState) {
        // Time in frames per second to update and draw game
        var time = 1 / game.config.fps;
        // Get the drawing context from canvas
        var ctx = this.gameCanvas.getContext('2d');
        // Update if we have an update function. Also draw if we have a draw function
        if(currentState.update) {
            currentState.update(game, time);
        }
        if (currentState.draw) {
            currentState.draw(game, time, ctx);
        }
    }
}

function WelcomeState(game, keyCode) {
    if(this.draw) {
      this.introMusic();
      console.log('Music is on playing');
    }
}
WelcomeState.prototype = {
    draw: function(game, time, ctx) {
        // Clear the background of game
        ctx.clearRect(0, 0, game.width, game.height);

          ctx.font = '60px Bungee Shade';
          ctx.fillStyle = '#ffffff';
          ctx.textBaseline = 'center';
          ctx.textAlign = 'center';
          ctx.fillText('Space Invaders', game.width / 2, game.height / 2 - 40);
          ctx.font = '20px Sans-serif';
          ctx.fillText("Press 'Space Bar' to start.", game.width / 2, game.height / 1 - 14);

        // console.log(ctx);
    },
    keyDown: function(game, keyCode) {
        if(keyCode == 32) /*space*/ {
            // Spacebar starts the game.
            game.level = 1;
            game.score = 0;
            game.lives = 3;
            game.moveToState(new IntroState(game.level));

            // console.log('keyDown in WelcomeState is working');
        }
    },
    introMusic: function() {
            document.getElementById('intro_audio').play();
    }
}

// Game Intro State
function IntroState(level) {
  this.level = level;
  this.countdownMessage = '3';

  var stop = document.getElementById('intro_audio').pause();
}
IntroState.prototype = {
  update: function(game, time) {
      if(this.countdown === undefined) {
        this.countdown = 3; // countdown from 3 seconds
      }
      this.countdown -= time;

      if(this.countdown < 2) {
        this.countdownMessage = '2';
      }
      if (this.countdown < 1) {
        this.countdownMessage = '1';
      }
      if (this.countdown <= 0) {
        // Move to Play State - moveToState
        game.moveToState(new PlayState(game.config, this.level));
      }
  },
  draw: function(game, time, ctx) {
    // Let's clear the background
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font = '50px Bungee Shade';
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('Level' + this.level, game.width / 2, game.height / 3);

    ctx.font = '30px Sans-serif';
    ctx.fillText('Ready in ' + this.countdownMessage, game.width / 2, game.height / 2 + 36);
    return;
  }
}

function PlayState(config, level) {
  this.config = config;
  this.level = level

  //Game State
  this.invaderCurrentVelocity = 10;
  this.invaderCurrentDropDistance = 0;
  this.invadersAreDropping = false;
  this.lastRocketTime = null;

  //Game entities
  this.ship = null;
  this.invaders = [];
  this.rockets = [];
}

PlayState.prototype = {
  enter: function(game) {
    document.getElementById('game_audio').play();

    //Create the Ship
    this.ship = new Ship(game.width / 2, game.gameBound.bottom);

    //  Setup initial state.
    this.invaderCurrentVelocity =  10;
    this.invaderCurrentDropDistance =  0;
    this.invadersAreDropping =  false;

    //Ship speed for this level and object properties for the invaders
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    this.shipSpeed = this.config.shipSpeed;
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + (levelMultiplier * this.config.invaderInitialVelocity);


    //Now lets create the invader Monsters
    var ranks = this.config.invaderRanks;
    var files = this.config.invaderFiles;
    var invaders =[];
      for(var rank = 0; rank < ranks; rank++) {
        for(var file = 0; file < files; file++) {
          invaders.push(new Invader(
            (game.width / 2) + ((files / 2 - file) * 200 / files),
            ((game.gameBound.top / 2) + rank * 20),
            rank, file, 'Invader'));
        }
      }
      this.invaders = invaders;
      this.invaderCurrentVelocity = this.invaderInitialVelocity;
      this.invaderVelocity = {
                                x: -this.invaderInitialVelocity,
                                y:0
                              };
      this.invaderNextVelocity = null;
  },
  update: function(game, time) {
    //If the left or right key arrows are pressed move the ship.
    // Check this rather than keydown
    // Event smooth movement, otherwise the ship will move all jankie
    if(game.pressedKeys[37]) {
      this.ship.x -= this.shipSpeed * time;
    }
    if(game.pressedKeys[39]) {
      this.ship.x += this.shipSpeed * time;
    }
    if(game.pressedKeys[32]) {
      //Fire Rocket
    }

    // Keep the ship within game bounds
    if(this.ship.x < game.gameBound.left) {
      this.ship.x = game.gameBound.left;
    }
    if(this.ship.x > game.gameBound.right) {
      this.ship.x = game.gameBound.right;
    }

    //  Move each rocket.
   for(i=0; i<this.rockets.length; i++) {
       var rocket = this.rockets[i];
       rocket.y -= time * rocket.velocity;

       //  If the rocket has gone off the screen remove it.
       if(rocket.y < 0) {
           this.rockets.splice(i--, 1);
       }
   }

    //Let's Move invaders
    var hitLeft = false;
    var hitRight = false;
    var hitBottom = false;

        for(i=0; i < this.invaders.length;i++) {
          var invader = this.invaders[i];
          var new_x = invader.x + this.invaderVelocity.x * time;
          var new_y = invader.y + this.invaderVelocity.y * time;
            if(hitLeft === false && new_x < game.gameBound.left) {
                hitLeft = true;
            } else if (hitRight === false && new_x > game.gameBound.right) {
              hitRight = true;
            } else if (hitBottom === false && new_y > game.gameBound.bottom) {
              hitBottom = true;
            }
            if(!hitLeft && !hitRight && !hitBottom) {
              invader.x = new_x;
              invader.y = new_y;
            }
          }
            // Invader Velocity
            if(this.invadersAreDropping) {
              this.invaderCurrentDropDistance += this.invaderVelocity.y * time;
                if(this.invaderCurrentDropDistance >= this.config.invaderDropDistance) {
                  this.invadersAreDropping = false;
                  this.invaderVelocity = this.invaderNextVelocity;
                  this.invaderCurrentDropDistance = 0;
                }
            }

            // If we've hit the left side of gameBound then move down then right
            if(hitLeft) {
              this.invaderCurrentVelocity += this.config.invaderAcceleration;
              this.invaderVelocity = {
                x: 0,
                y: this.invaderCurrentVelocity
              };
              this.invadersAreDropping = true;
              this.invaderNextVelocity = {
                x: this.invaderCurrentVelocity,
                y: 0
              };
            }

            // Same thing but for the other side
            if(hitRight) {
              this.invaderCurrentVelocity += this.config.invaderAcceleration;
              this.invaderVelocity = {
                x: 0,
                y: this.invaderCurrentVelocity
              };
              this.invadersAreDropping = true;
              this.invaderNextVelocity = {
                x: -this.invaderCurrentVelocity,
                y: 0
              };
            }

  },
  draw: function(game, time, ctx) {
    // Clear Background once again
    ctx.clearRect(0, 0, game.width, game.height);

    //Draw the effin Ship
    // console.log(this.ship)
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(this.ship.x - (this.ship.width / 2), this.ship.y - (this.ship.height / 2), this.ship.width, this.ship.height);

    //  Draw invaders.
    ctx.fillStyle = '#006600';
    for(var i=0; i<this.invaders.length; i++) {
        var invader = this.invaders[i];
        ctx.fillRect(invader.x - invader.width / 2, invader.y - invader.height / 2, invader.width, invader.height);
    }

    //  Draw rockets.
    ctx.fillStyle = '#c0392b';
      for(var i=0; i<this.rockets.length; i++) {
          var rocket = this.rockets[i];
          ctx.fillRect(rocket.x + 2, rocket.y - 1, 4, 6);
      }
  },
  keyDown: function(game, keyCode) {
    if(keyCode == 32) {
        // Fire!!!!!
        this.fireRocket();
    }
  },
  keyUp: function(game, keyCode) {

  },
  fireRocket: function() {
    if(this.lastRocketTime === null || ((new Date()).valueOf() - this.lastRocketTime) > (1000 / this.config.rocketMaxFireRate)) {
          //  Add a rocket.
          this.rockets.push(new Rocket(this.ship.x, this.ship.y - 12, this.config.rocketVelocity));
          this.lastRocketTime = (new Date()).valueOf();

          //  Play the 'shoot' sound.
          document.getElementById('laser_audio').play();
      }
  }
}

// The Ship Position
function Ship(x, y) {
  this.x = x;
  this.y = y;
  this.height = 30;
  this.width = 26;
}

// Rocket Fire From Ship to Destroy Invader Monsters Positions
function Rocket(x, y, velocity) {
  this.x = x;
  this.y = y;
  this.velocity = velocity;
}

// Invader Bombs being droped Position
function Bomb(x, y , velocity) {
  this.x = x;
  this.y = y;
  this.velocity = velocity;
}

// Invading Monsters Position
function Invader(x, y, rank, file, type) {
  this.x = x;
  this.y = y;
  this.rank = rank;
  this.file = file;
  this.type = type;
  this.width = 18;
  this.height = 14;
}



// Setup the canvas
var canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;


// Define variable for game instance class
var game = new Game();
// var welcome = new WelcomeState();
// Let's start the game
game.initialize(canvas);

// Start the game
game.start();
// welcome.introMusic();


// Event Listeners for the keyboard
window.addEventListener('keydown', function keydown(e) {
    var keycode = e.which || window.event.keycode;

    if(keycode == 37 || keycode == 39 || keycode == 32) {
        e.preventDefault();
        console.log('yay keydown');
    }
    game.keyDown(keycode);
});
window.addEventListener('keyup', function keydown(e) {
    var keycode = e.which || window.event.keyCode;

    game.keyUp(keycode);
    console.log('yay keyup');
});
