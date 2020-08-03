const horizontal = 25;
const vertical = 25;
const width = 500;
const height = 500;
const panel = 50;
let matrix;
let ratioX;
let ratioY;
let ruleBirth = [3];
let ruleDeath = [0,1,4,5,6,7,8];
let fr = 60;
let play = false;

let buttonPlay;
let buttonReset;
let slider;

function setup() {
  createCanvas(width, height+panel);
  
  ratioX = width/horizontal;
  ratioY = height/vertical;
  matrix = new Array(vertical);
  
  for (var x = 0; x < matrix.length; x++) {
    matrix[x] = new Array(horizontal);
    for (var y = 0; y < matrix[x].length; y++) {
      matrix[x][y] = 255;
    }
  }
  
  background(244, 248, 252);
  slider = createSlider(1, 60, 10);
  slider.position(width-150, 10);
  slider.style('width', '100px');
  buttonPlay = createButton('Play');
  buttonPlay.position(10, 10);
  buttonPlay.mousePressed(buttonPressed);
  
  buttonReset = createButton('Reset');
  buttonReset.position(75, 10);
  buttonReset.mousePressed(reset);
}

function draw() {
  if (play)
  {
  fr = slider.value();
  let newMatrix = new Array(vertical);
  for (var x = 0; x < newMatrix.length; x++) {
    newMatrix[x] = new Array(horizontal);
    for (var y = 0; y < newMatrix[x].length; y++) {
      newMatrix[x][y] = matrix[x][y];
    }
  }
  for (let x = 0; x < horizontal; x++) {
    for (let y = 0; y < vertical; y++) {
      let value = matrix[x][y];
      let neighbor = 0;
      for (let i = x-1; i <= x+1; i++) {
        for (let j = y-1; j <= y+1; j++) {
          if (i > 0 && i < horizontal && j > 0 && j < vertical && (i != x || j != y))
          {
            if (matrix[i][j]==0)
            {
              neighbor++;
            }
          }
        }
      }
      if (value==255)
      {
        for (let i = 0; i < ruleBirth.length; i++) {
          if (ruleBirth[i] == neighbor)
          {
            newMatrix[x][y] = 0;
          }
        }
      } else {
        for (let i = 0; i < ruleDeath.length; i++) {
          if (ruleDeath[i] == neighbor)
          {
            newMatrix[x][y] = 255;
          }
        }
      }
    }
  }
  matrix = newMatrix;
  }
  
  for (let x = 0; x < horizontal; x++) {
    for (let y = 0; y < vertical; y++) {
      fill(matrix[x][y]);
      rect(x*ratioX, y*ratioY+panel, ratioX, ratioY);
    }
  }
  
  print(fr);
  frameRate(fr);
}

function mousePressed()
{
    var value = matrix[floor((mouseX)/ratioX)][floor((mouseY-panel)/ratioY)];
    if (value == 255)
    {
      value = 0;
    } else {
      value = 255;
    }
    matrix[floor(mouseX/ratioX)][floor((mouseY-panel)/ratioY)] = value;
}

function buttonPressed() {
  if (play)
  {
    fr = 60;
    play = false;
    buttonPlay.label = "Play";
  } else {
    play = true;
    buttonPlay.label = "Stop";
  }
}

function reset() {
  play = false;
  fr = 60;
  for (var x = 0; x < matrix.length; x++) {
    matrix[x] = new Array(horizontal);
    for (var y = 0; y < matrix[x].length; y++) {
      matrix[x][y] = 255;
    }
  }
}