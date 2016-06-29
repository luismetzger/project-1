// Instance for the Game
function Game() {
    // Initial configs on how fast monster invaders will move and size of window
    this.config = {
        gameWidth: 400,
        gameHeigth: 300,
        fps: 50
    };
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBound = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    // Empty object array to hold all key state's being called
    this.stateStack = [];

    // Inputs and canvas to render game
    this.pressedKeys = {};
    this.gameCanvas = null;
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
            top: gameCanvas.height / 2 + this.config.gameHeigth / 2,
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
        } else if (state.enter) {
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
    },
    // Let's the game know that the key is up
    keyUp: function(keyCode) {
        delete this.pressedKeys[keyCode];
        //  Delegate to the current state
        if(this.currentState() && this.currentState().keyUp) {
            this.currentState().keyUp(this, keyCode);
        }
    }
}

function GameLoop(game) {
    var currentState = game.currentState();

    if(currentState) {

        // Time in frames per second to update and draw game
        var time = 1 / game.config.fps;

        // Get the drawing context from canvas
        var ctx = game.gameCanvas.getContext('2d');


        // Update if we have an update function. Also draw if we have a draw function
        if(currentState.update) {
            currentState.update(game, time);
        } else if (currentState.draw) {
            currentState.draw(game, time, ctx);
        }

    }
}

function WelcomeState() {
    // No new variables but needed new functions in a new instance
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


        // Using jQuery to make the Game Title Flash
        ctx.font = '20px Sans-serif';
        ctx.fillText("Press 'Space Bar' to start.", game.width / 2, game.height / 2);

        // var canvas = document.getElementById('gameCanvas');
        // var title  = ctx.fillText('Space Invaders', game.width / 2, game.height / 2 - 40);
        // var title_color = ctx.fillStyle = '#ffffff';
        //
        // var ctx = game.gameCanvas.getContext('2d');
        // var width = game.gameCanvas.width;
        // var height = game.gameCanvas.height;
        // var rectSize = width/height;
        //
        // for(var i=0;i<(rectSize/title_color);i++) {
        //     for(var j=0;j<(height/rectSize);j++) {
        //         ctx.fillStyle = 'rgb('
        //         +Math.floor(255-rectSize*i)
        //         +','
        //         +Math.floor(255-rectSize*j)
        //         +',0)';
        //         ctx.fillRect(rectSize*i,rectSize*j,rectSize,rectSize);
        //     }
        // }


        // console.log(ctx);
    },
    keyDown: function(game, keyCode) {
        if(keyCode == 32) /*space*/ {
            // Spacebar starts the game.
        }
    },
    introMusic: function() {
        window.onload = function() {
            document.getElementById('intro_audio').play();
        }
    }
}

// Game Intro State
function IntroState(state) {
  this.level = level;
  this.countdownMessage = '3';
}
IntroState.prototype = {
  draw: function() {
    // Let's clear the background
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.font = '36px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('Level' + this.level, game.width / 2, game.height / 2 + 36);
    ctx.fillText('Ready in' + this.countdownMessage, game.width / 2, game.height / 2 + 36);
  },
  update: function(game, time) {
      if(this.countdown === undefined) {
        this.countdown = 3; // countdown from 3 seconds
      }
      this.countdown -= time;

      if(this.countdown < 2) {
        this.countdownMessage = "2";
      } else if (this.countdown < 1) {
        this.countdownMessage = "1";
      } else if (this.countdow < 0) {
        // Move to Play State - moveToState
      
      }
  }
}

// Setup the canvas
var canvas = document.getElementById('gameCanvas');
canvas.width = 800;
canvas.height = 600;


// Define variable for game instance class
var game = new Game();
var welcome = new WelcomeState();
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
    }
    game.keyDown(keycode);
    console.log(e);
});
window.addEventListener('keyup', function keydown(e) {
    var keycode = e.which || window.event.keyCode;

    game.keyUp(keycode);
    console.log(e);
});
