"use strict";
const Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);

  this.timeAtLastFrame = new Date().getTime();
  this.frameCount = 0;

  this.avatar = new Avatar(gl);

  this.gameObjects = [
    this.avatar,
    new GroundPlane(gl),
    new Balloon(gl, 0, 0),
    new Balloon(gl, 25, 25),
    new Balloon(gl, 30, -15),
  ];

  this.camera = new PerspectiveCamera();
};

Scene.prototype.update = function(gl, keysPressed) {
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.frameCount++;

  // Clear screen
  gl.clearColor(1, 1, 1, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.camera.move(dt, keysPressed);
  this.gameObjects.forEach(gameObject => {
    gameObject.move(dt, this.frameCount, keysPressed, this.camera);
    gameObject.draw(this.camera);
  });
};


