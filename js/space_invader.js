// function SpaceInvader() {
//   //ATD object variables
//    this.fps = 30;
//    this.canvas = null;
//    this.width = 0;
//    this.height = 0;
//    this.minVelocity = 15;
//    this.maxVelocity = 30;
//    this.stars = 100;
//    this.intervalId = 0;
//    this.context = null;
// }
// SpaceInvader.prototype = {
//   initialize: function(div) {
//     var self= this;

//     //Storing the DIV container
//     this.containerDiv = div;
//     self.width = window.innerWidth;
//     self.height = window.innerHeight;

//     window.addEventListener('resize', function(event) {
//       self.width = window.innerWidth;
//       self.height = window.innerHeight;
//       self.canvas.width = self.width;
//       self.canvas.width = self.height;
//       self.draw();
//     });

//     //Create the canvas
//     var canvas = document.createElement('canvas');
//     div.appendChild(canvas);
//     this.canvas = canvas;
//     this.canvas.width = this.width;
//     this.canvas.height = this.height;
//     this.context = this.canvas.getContext('2d');
//   },
//   start: function() {
//     //Lets create some stars
//     var stars = [];
//     for(var i=0; i < this.stars;i++) {
//       stars[i] = new Star(Math.random()*this.width, Math.random() * this.height, Math.random() * 3 + 1, (Math.random()*(this.maxVelocity - this.minVelocity)) + this.minVelocity);
//       // stars[i] = new Star(Math.random() * this.width, Math.random() * this.height, 10, (Math.random()*(this.maxVelocity - this.minVelocity)) + this.minVelocity);
//     }
//       this.stars = stars;

//       this.context.fillStyle = 'white';

//       for(var i=0; i < this.stars.length;i++) {
//         var star = this.stars[i];
//         this.context.fillRect(star.x, star.y, star.size, star.size);
//       }
//   }
// }  

function Star(x, y, size) {
    var maxVelocity = 30;
    var minVelocity = 15;

    this.x = x;
    this.y = y;
    this.size = size;
    this.velocity = Math.round(Math.random()*(maxVelocity - minVelocity) + minVelocity, 0);
}

Star.prototype = {
  draw: function(context){
    context.fillStyle = 'white';
    console.log(this);
    context.clearRect(this.x, this.y, this.size, this.size);
    this.fall();
    context.fillRect(this.x, this.y, this.size, this.size);
  },
  fall: function(){
    this.y = this.y + this.velocity;
    if(this.y > canvasHeight){
      this.x = Math.round(Math.random() * canvasWidth,2);
      this.y = 0;
    }
  }
}

//Let's make the background animated!
var container = document.getElementById('bg-container');
// var space_invader = new SpaceInvader();
// space_invader.initialize(container);
// space_invader.start();

var canvasHeight = 500;
var canvasWidth = 500;
var canvas = document.getElementById('space-invaders');
var context = canvas.getContext('2d');

function Background(stars){
  this.starCount = stars;
  this.stars = [];
}

Background.prototype = {
  initialize: function() {
    for(var i=0; i < this.starCount; i++) {
      this.stars.push(new Star(Math.round(Math.random()*canvasWidth,0), 
                               Math.round(Math.random()*canvasHeight,0), 
                               Math.round(Math.random() * 3 + 1),0));
    }
  },
  draw: function(context) {
    this.stars.forEach(function(star){
      star.draw(context);
    });
  }
}

var myBackground = new Background(30);
myBackground.initialize();

function animate() {
  requestAnimationFrame(animate);

  myBackground.draw(context);
}

animate();

// for(var i=0; i < 30; i++){
//  myBackground.draw(context); 
// }

	// space_invader.stop();
