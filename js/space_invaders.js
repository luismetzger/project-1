// Instance for the Game
function Game() {
    // Initial configs on how fast monster invaders will move and size of window
    this.config = {
        gameWidth: 600,
        gameHeigth: 500,
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
