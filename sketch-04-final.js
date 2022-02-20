const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true
  //add frame below to 
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.01,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
  background: '#fff',
  strokeStyle: '#000',
};
const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.background;
    context.fillRect(0, 0, width, height);



    const cols = params.cols;
    const rows = params.rows;
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

      //conditional expression. ternary operator.  frame when params.animate is true,  or params.frame when animate is false
      //before the ? is the conditional ? frame is the value when the condition is true : params.frame is the else, when the conditional is false 
      //then we can use f in the n variable statement instead of "frame", below
      const f = params.animate ? frame : params.frame;
      //generate some random noise. we can use n to set the angle of rotation of the lines of our grid
      //the 3rd parameter is called frequency. because the values of x and y are too big, frequency too high, it makes the rotations a bit chaotic
      //lowering it lessens the rotation
      //adding frame begins to animate it slowly.  if mulyiplied by a bigger number, like 10, the animation speeds up
      // const n = random.noise2D(x + frame * 10, y, params.freq);
      const n = random.noise3D(x, y, + f * 10, params.freq);
      //need angle variable to use noise with
      //noise2d returns a number between -1,1
      //when that is multiplied by Math.PI, it is the equivalent of -180deg to 180deg
      //instead of using the amplitude parameter on noise above, we are are adding *0.2 to the angle to lessen the amplitude and make everything flow better
      const angle = n * Math.PI * params.amp;
      // now context.rotate(angle) to see it(listed under translate)

      //now want to create another variable to adjust line width based on noise
      //const scale = (n+1) / 2 * 30;
      //const scale = (n * 0.5 + 0.5) * 30;
      //the above are 2 ways to do this, but the map Range function can do that for us
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

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
      context.lineCap = params.lineCap;
      context.beginPath();
      // context.arc(x, y, 10, 0, Math.PI * 2);
      //start at minus half the width of the line we are drawing
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.strokeStyle = params.strokeStyle;
      context.stroke();
      context.restore();

    }

  };
};

//to create control panel
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addFolder({ title: 'style' });
  folder.addInput(params, 'background', { view: 'color', });
  folder.addInput(params, 'strokeStyle', { view: 'color', });

  folder = pane.addFolder({ title: 'grid' });
  folder.addInput(params, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square' } });
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 1, max: 100 });
  folder.addInput(params, 'scaleMax', { min: 1, max: 100 });

  folder = pane.addFolder({ title: 'noise' });
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01 });
  folder.addInput(params, 'amp', { min: 0, max: 1 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', { min: 0, max: 999 });
}
createPane();
canvasSketch(sketch, settings);
