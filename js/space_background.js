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
    self.width = window.innerWidth;
    self.height = window.innerHeight;

    window.addEventListener('resize', function(event) {
      self.width = window.innerWidth;
      self.height = window.innerHeight;
      self.canvas.width = self.width;
      self.canvas.width = self.height;
      self.draw();
    });

    //Create the canvas
    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },
  start: function() {
    //Lets create some stars
    var stars = [];
    for(var i=0; i < this.stars;i++) {
      stars[i] = new Star(Math.random()*this.width, Math.random() * this.height, Math.random() * 3 + 1, (Math.random()*(this.maxVelocity - this.minVelocity)) + this.minVelocity);
    }
      this.stars = stars;

      var self = this;
      //Now let's start the timer
      self.update();
      self.draw();
    //   this.intervalId = setInterval(function() {
    //     self.update();
    //     self.draw();
    //   }, 1000 / this.fps);

      // this.intervalId = setTimeout(function() {
      //   self.update();
      //   self.draw();
      // }, 1000 / this.fps);
  },
  stop: function() {
    clearInterval(this.intervalId);
  },
  update: function() {
    var passed_time = 1 / this.fps;

    for(var i=0; i < this.stars.length;i++) {
        var star = this.stars[i];
        star.y += passed_time * star.velocity;

        if(star.y > this.height) {
          this.stars[i] = new Star(Math.random() * this.width, 0, Math.random() * 3 + 1, (Math.random()*(this.maxVelocity - this.minVelocity)) + this.minVelocity);
        }
    }
    // console.log('Update Function Working');
  },
  draw: function() {
      // Declare drawing context
      var ctx = this.canvas.getContext('2d');
    //   console.log(ctx);

      //Let's fill-in the background of canvas
      ctx.fillStyle = '#00000';
      ctx.fillRect(0, 0 , this.width, this.height);

      //Now let's get the stars to appear by drawing them in
      ctx.fillStyle = '#ffffff';
      for(var i=0; i < this.stars.length;i++) {
        var star = this.stars[i];
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    //   console.log('Draw Function Working');
    }
  }

  function Star(x, y, size, velocity) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.velocity = velocity;
  }

  function animate(){
    requestAnimationFrame(animate)

    // the drawing loop
    drawBackground();
    drawShip()
    drawAliens()
  }

//Let's make the background animated!
var container = document.getElementById('bg-container');
var space_invader = new SpaceInvader();
space_invader.initialize(container);
space_invader.start();


	// space_invader.stop();
