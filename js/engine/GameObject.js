"use strict";
const GameObject = function(mesh) {
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);
  this.rotationMatrix = new Mat4().set();
  this.scale = new Vec3(1, 1, 1);

  this.modelMatrix = new Mat4();

  this.parent = null;

  this.move = function() {};
  this.control = function() {};
  this.accel = new Vec3();
  this.velocity = new Vec3().set(0, 0, 0);
  this.backDrag = 5;
  this.jumpBuffer = 0;
};

GameObject.prototype.updateModelMatrix = function() {
  this.modelMatrix
    .set()
    .scale(this.scale)
    .mul(this.rotationMatrix)
    .translate(this.position);

  if (this.parent != null) {
    this.parent.updateModelMatrix();
    this.modelMatrix.mul(this.parent.modelMatrix);
  }
};

GameObject.prototype.draw = function(camera) {
  this.updateModelMatrix();

  // Set model matrix uniform
  Material.modelMatrix.set(this.modelMatrix);

  // Set model matrix inverse uniform
  let modelMatrixInverse = this.modelMatrix.clone();
  modelMatrixInverse.invert();
  Material.modelMatrixInverse.set(modelMatrixInverse);

  // Set model view projection matrix uniform
  this.modelMatrix.mul(camera.viewProjMatrix);
  Material.modelViewProjMatrix.set(this.modelMatrix);

  this.mesh.draw();

  // this.scale.y = 0.01;
  // this.position.y = 0.1;
  // this.updateModelMatrix();
  // Material.modelMatrix.set(this.modelMatrix);
  // this.modelMatrix.mul(camera.viewProjMatrix);
  // Material.modelViewProjMatrix.set(this.modelMatrix);
  // this.mesh.draw();
};
