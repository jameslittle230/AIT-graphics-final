"use strict";
const PerspectiveCamera = function() {
  this.avatarOffset = new Vec3(0, 20, -60)
  this.position = new Vec3(0, 0, 0);
  this.originalPosition = new Vec3();
  this.ahead = new Vec3(0.0, 0.0, 1.0);
  this.right = new Vec3(1.0, 0.0, 0.0);
  this.up = new Vec3(0.0, 1.0, 0.0);

  this.yaw = 0;
  this.pitch = -0;
  this.fov = 1.2;
  this.aspect = 1.0;
  this.nearPlane = 0.1;
  this.farPlane = 1000.0;

  this.speed = 0.5;

  this.viewMatrix = new Mat4();
  this.projMatrix = new Mat4();
  this.viewProjMatrix = new Mat4();
  this.rayDirMatrix = new Mat4();
  this.updateRayDirMatrix();
  this.updateViewMatrix();
  this.updateProjMatrix();
};

PerspectiveCamera.worldUp = new Vec3(0, 1, 0);

PerspectiveCamera.prototype.updateRayDirMatrix = function() {
  this.rayDirMatrix
    .set()
    .translate(this.position)
    .translate(this.avatarOffset)
    .mul(this.viewMatrix)
    .mul(this.projMatrix)
    .invert();
};

PerspectiveCamera.prototype.updateViewMatrix = function() {
  this.viewMatrix
    .set(
      this.right.x,
      this.right.y,
      this.right.z,
      0,
      this.up.x,
      this.up.y,
      this.up.z,
      0,
      -this.ahead.x,
      -this.ahead.y,
      -this.ahead.z,
      0,
      0,
      0,
      0,
      1
    )
    .translate(this.position)
    .translate(this.avatarOffset)
    .invert();

  this.viewProjMatrix.set(this.viewMatrix).mul(this.projMatrix);
};

PerspectiveCamera.prototype.updateProjMatrix = function() {
  this.ahead = new Vec3(
    -Math.sin(this.yaw) * Math.cos(this.pitch),
    Math.sin(this.pitch),
    -Math.cos(this.yaw) * Math.cos(this.pitch)
  );

  this.right.setVectorProduct(this.ahead, PerspectiveCamera.worldUp);
  this.right.normalize();
  this.up.setVectorProduct(this.right, this.ahead);

  var yScale = 1.0 / Math.tan(this.fov * 0.5);
  var xScale = yScale / this.aspect;
  var f = this.farPlane;
  var n = this.nearPlane;
  this.projMatrix.set(
    xScale,
    0,
    0,
    0,
    0,
    yScale,
    0,
    0,
    0,
    0,
    (n + f) / (n - f),
    -1,
    0,
    0,
    2 * n * f / (n - f),
    0
  );
  this.viewProjMatrix.set(this.viewMatrix).mul(this.projMatrix);
};

PerspectiveCamera.prototype.move = function(dt, keysPressed, avatar) {
  if(keysPressed.UP) {
    this.avatarOffset.y += dt*10;
  }

  if(keysPressed.DOWN) {
    this.avatarOffset.y -= dt*10;
  }

  if(keysPressed.LEFT) {
    this.avatarOffset.addScaled(dt*-15, this.right);
  }

  if(keysPressed.RIGHT) {
    this.avatarOffset.addScaled(dt*15, this.right);
  }

  this.position = avatar.gameObject.position;
  
  this.updateViewMatrix();
  this.updateProjMatrix();
  this.updateRayDirMatrix();
};

PerspectiveCamera.prototype.mouseDown = function() {
  //   this.isDragging = true;
  //   this.mouseDelta.set();
};

PerspectiveCamera.prototype.mouseMove = function(event) {
  //   this.mouseDelta.x += event.movementX;
  //   this.mouseDelta.y += event.movementY;
  //   event.preventDefault();
};

PerspectiveCamera.prototype.mouseUp = function() {
  //   this.isDragging = false;
};

PerspectiveCamera.prototype.setAspectRatio = function(ar) {
  this.aspect = ar;
  this.updateProjMatrix();
};