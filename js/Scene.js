"use strict";
const Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);

  this.timeAtLastFrame = new Date().getTime();
  this.frameCount = 0;

  this.avatar = new Avatar(gl);

  this.gameObjects = [
    this.avatar,
    new GroundPlane(gl),
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
  this.avatar.gameObject.control(timeAtThisFrame, dt, keysPressed, this.gameObjects);
  this.camera.position.set(this.avatar.gameObject.position.minus(0, -10, 50));
  this.gameObjects.forEach(gameObject => {
    gameObject.gameObject.move(timeAtThisFrame, dt);
    gameObject.draw(this.camera);
  });
};


