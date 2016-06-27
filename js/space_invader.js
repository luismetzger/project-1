function SpaceInvader() {
  //ATD object variables
   this.fps = 30;
   this.canvas = null;
   this.width = 0;
   this.height = 0;
   this.minVelocity = 15;
   this.maxVelocity = 30;
   this.stars = 100;
   this.intervalId = 0;

}
SpaceInvader.prototype = {
  initialize: function(div) {
    var self= this;

    //Storing the DIV container
    this.containerDiv = div;
    self.width = window.InnerWidth;
    self.height = window.InnerHeight;
  },
  start: function() {
    //Lets start the game
  },
  stop: function() {

  },
  pause: function() {

  }
}

var space_invader = new SpaceInvader();
space_invader.start();
