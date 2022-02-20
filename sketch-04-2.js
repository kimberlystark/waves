const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true
  //add frame below to 
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const cols = 10;
    const rows = 10;
    const numCells = cols * rows;

    const gridw = width * 0.8;
    const gridh = width * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    //margins of grid
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5

    //now use a forloop to go over each cell of the grid. instead of 2 for loops, using just onewith math
    for (let i = 0; i < numCells; i++) {
      //to calculate column, use %. returns remainder of the division of i by cols
      //while value of i is increasing in steps of 1, value of col is modulated between 0 and 3
      const col = i % cols;
      // because of the direction, in order to find the rows we need to check agains column
      //at every 4 iterations, the value of row is increase by 1
      //which is what we need to find the rows on the y axis
      const row = Math.floor(i / cols);
      //find x and y values using col and row
      const x = col * cellw;
      const y = row * cellh;
      //want the rows to be drawn a little smaller than the actual cells
      const h = cellh * 0.8;
      const w = cellw * 0.8;

      //generate some random noise. we can use n to set the angle of rotation of the lines of our grid
      //the 3rd parameter is called frequency. because the values of x and y are too big, frequency too high, it makes the rotations a bit chaotic
      //lowering it lessens the rotation
      //adding frame begins to animate it slowly.  if mulyiplied by a bigger number, like 10, the animation speeds up
      const n = random.noise2D(x + frame * 10, y, .001);
      //need angle variable to use noise with
      //noise2d returns a number between -1,1
      //when that is multiplied by Math.PI, it is the equivalent of -180deg to 180deg
      //instead of using the amplitude parameter on noise above, we are are adding *0.2 to the angle to lessen the amplitude and make everything flow better
      const angle = n * Math.PI * 0.2;
      // now context.rotate(angle) to see it(listed under translate)

      //now want to create another variable to adjust line width based on noise
      //const scale = (n+1) / 2 * 30;
      //const scale = (n * 0.5 + 0.5) * 30;
      //the above are 2 ways to do this, but the map Range function can do that for us
      const scale = math.mapRange(n, -1, 1, 1, 30);

      context.save();
      //to center
      context.translate(x, y);
      // we need to take into accoun the margins and also translate those to center
      context.translate(margx, margy);
      // we are drawing the lines from the center of each grid cell but we are only translating the origin
      //to the top left of each cell. need another translate to the center of the cell
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.beginPath();
      //start at minus half the width of the line we are drawing
      context.moveTo(w * -0.5, 0)
      context.lineTo(w * 0.5, 0)
      context.stroke();
      context.restore();

    }

  };
};

canvasSketch(sketch, settings);
