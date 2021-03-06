/*================================================================
  #GLOBAL
  ================================================================*/

// constant
var BLOCK_WIDTH = 101,
    BLOCK_HEIGHT = 83,
    CANVAS_WIDHT = 505,
    CANVAS_HEIGHT = 606,
    NUM_COLS = 5,
    NUM_ROWS = 6,
    MAX_NUM_ENEMIES = 3;

// global variable
var score = 0,
    nDies = 0,
    nGems = 0;

var i = 0,
    j = 0;

/*================================================================
  #GAME OBJ
  ================================================================*/

// super class for every objects in the game
var GameObject = function(sprite, pos) {
  this.sprite = sprite;
  this.pos = pos;
};

GameObject.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite),
    this.pos.x,
    this.pos.y
  );
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 *
 * @see http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 * 
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
GameObject.prototype.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * [getColByXPos description]
 * 
 * @param  {number} xPos
 * @return {number}
 */
GameObject.prototype.getColByXPos = function(xPos) {
  return Math.floor(xPos / BLOCK_WIDTH) + 1;
};

/**
 * Game Position class for returning
 * position object (in 2d)
 */
GameObject.prototype.getGameRenderPosition = function(objType, objCol, objRow, offsetX, offsetY) {
  return {
    type: objType,
    col: objCol,
    row: objRow,
    x: objCol * BLOCK_WIDTH + offsetX,
    y: objRow * BLOCK_HEIGHT + offsetY
  };
};

/*================================================================
  #GAME OBJ - BLOCK
  ================================================================*/

var Block = function(imagePath, col, row) {
  var sprite = imagePath,
      pos = this.getRenderPosition(col, row);

  GameObject.call(this, sprite, pos);
};

Block.prototype = Object.create(GameObject.prototype);
Block.prototype.constructor = Block;

Block.prototype.getRenderPosition = function(col, row) {
  return this.getGameRenderPosition('block', col, row, 0, 20);
};

/*================================================================
  #GAME OBJ - GEM
  ================================================================*/

var Gem = function() {
  var sprite = 'images/gem-blue.png',
      pos = this.getRandomRenderPosition();

  GameObject.call(this, sprite, pos);
};

Gem.prototype = Object.create(GameObject.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.reset = function() {
  this.pos = this.getRandomRenderPosition();
};

Gem.prototype.getRenderPosition = function(col, row) {
  return this.getGameRenderPosition('gem', col, row, 0, 0);
};

Gem.prototype.getRandomRenderPosition = function() {
  var col = this.getRandomInt(0, 4),
      row = this.getRandomInt(1, 3);

  return this.getRenderPosition(col, row);
};

Gem.prototype.isCollision = function(obj) {
  if (obj.pos.col === this.pos.col &&
    obj.pos.row === this.pos.row) {
    return true;
  }

  return false;
};

/*================================================================
  #GAME OBJ - ENEMY
  ================================================================*/

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  var sprite = 'images/enemy-bug.png',
      pos = this.getRandomRenderPosition();

  GameObject.call(this, sprite, pos);
  this.speed = this.getRandomSpeed();
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.pos.x += this.speed * dt;
  this.pos.col = this.getColByXPos(this.pos.x);

  if (this.pos.x >= CANVAS_WIDHT) {
    this.reset();
  }
};

Enemy.prototype.reset = function() {
  this.pos = this.getRandomRenderPosition();
  this.speed = this.getRandomSpeed();
};

Enemy.prototype.getRenderPosition = function(row) {
  return this.getGameRenderPosition('enemy', 0, row, -BLOCK_WIDTH * 2, 0);
};

Enemy.prototype.getRandomRenderPosition = function() {
  var row = this.getRandomInt(1, 3);

  return this.getRenderPosition(row);
};

Enemy.prototype.getRandomSpeed = function() {
  return this.getRandomInt(100, 240);
};

Enemy.prototype.isCollision = function (obj) {
  // tricky
  var enemyWidth = 101 / 2;

  // if collide with enemy
  // - check the row
  // - check when obj in front of enemy
  // - check when obj behind enemy
  if (obj.pos.row === this.pos.row &&
    (
      (obj.pos.x > this.pos.x && obj.pos.x < this.pos.x + enemyWidth) ||
      (obj.pos.x < this.pos.x && obj.pos.x > this.pos.x - enemyWidth)
    )) {

    return true;
  }

  return false;
};

/*================================================================
  #GAME OBJ - PLAYER
  ================================================================*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  var sprite = 'images/char-boy.png',
      pos = this.getStartedRenderPosition();

  GameObject.call(this, sprite, pos);
};

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  // check gem collision
  if (gem.isCollision(this)) {
    nGems++;
    gem.reset();
  }

  // check enemy collision
  for (i = 0; i < MAX_NUM_ENEMIES; i++) {
    var enemy = enemies[i];
    if (enemy.isCollision(this)) {
      nDies++;
      this.reset();
    }
  }
};

Player.prototype.getRenderPosition = function(col, row) {
  return this.getGameRenderPosition('player', col, row, 0, 0);
};

Player.prototype.getStartedRenderPosition = function() {
  var col = 2,
      row = 5;

  return this.getRenderPosition(col, row, 0, 0);
};

Player.prototype.moveLeft = function() {
  this.pos.col--;
  this.pos.x -= BLOCK_WIDTH;
};

Player.prototype.moveRight = function() {
  this.pos.col++;
  this.pos.x += BLOCK_WIDTH;
};

Player.prototype.moveUp = function() {
  this.pos.row--;
  this.pos.y -= BLOCK_HEIGHT;
};

Player.prototype.moveDown = function() {
  this.pos.row++;
  this.pos.y += BLOCK_HEIGHT;
};

Player.prototype.reset = function() {
  this.pos = this.getStartedRenderPosition();
};

Player.prototype.handleInput = function(key) {
  switch (key) {
    case 'left':
      if (this.pos.col > 0) this.moveLeft();
      break;
    case 'right':
      if (this.pos.col < NUM_COLS - 1) this.moveRight();
      break;
    case 'up':
      if (this.pos.row === 1) {
        score++;
        this.reset();

      } else if (this.pos.row > 1) {
        this.moveUp();
      }
      break;
    case 'down':
      if (this.pos.row < NUM_ROWS - 1) this.moveDown();
      break;
  }
};

/*================================================================
  #START
  ================================================================*/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var gem = new Gem(),
    player = new Player(),
    blocks = [], // 2d array
    enemies = [];

function setupEnemy() {
  for (i = 0; i < MAX_NUM_ENEMIES; i++) {
    var enemy = new Enemy();
    enemies.push(enemy);
  }
}

function setupBackground() {
  /**
   * This array holds the relative URL to the image used
   * for that particular row of the game level.
   */
  var rowImages = [
    'images/water-block.png', // Top row is water
    'images/stone-block.png', // Row 1 of 3 of stone
    'images/stone-block.png', // Row 2 of 3 of stone
    'images/stone-block.png', // Row 3 of 3 of stone
    'images/grass-block.png', // Row 1 of 2 of grass
    'images/grass-block.png'  // Row 2 of 2 of grass
  ];

  // prepare 2d array
  // http://stackoverflow.com/questions/11345954/push-a-two-dimensional-array-with-javascript
  for (i = 0; i < NUM_COLS; i++) {
    blocks.push([]);
  }

  for (i = 0; i < NUM_COLS; i++) {
    for (j = 0; j < NUM_ROWS; j++) {
      var block = new Block(rowImages[j], i, j);
      blocks[i].push(block);
    }
  }
}

setupEnemy();
setupBackground();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
