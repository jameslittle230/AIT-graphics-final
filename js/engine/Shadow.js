"use strict";
const Shadow = function(mesh) {
    this.mesh = mesh;

    this.position = new Vec3(0, 0, 0);
    this.pitch = 0;
    this.roll = 0;
    this.yaw = 0;
    this.scale = new Vec3(1, 1, 1);

    this.modelMatrix = new Mat4();
};

Object.defineProperty(Shadow.prototype, 'ahead', {
    get: function() {
        var rotationMatrix = new Mat4()
            .rotate(this.roll, 0, 0, 1)
            .rotate(this.pitch, 1, 0, 0)
            .rotate(this.yaw, 0, 1, 0);

        return new Vec3(0, 0, 1).xyz1times(rotationMatrix);
    },
});

Object.defineProperty(Shadow.prototype, 'right', {
    get: function() {
        var rotationMatrix = new Mat4()
            .rotate(this.roll, 0, 0, 1)
            .rotate(this.pitch, 1, 0, 0)
            .rotate(this.yaw, 0, 1, 0);

        return new Vec3(1, 0, 0).xyz1times(rotationMatrix);
    },
});

Shadow.prototype.updateModelMatrix = function() {
    // this.position.y = 0;
    this.modelMatrix.set()
        .scale(this.scale)
        .rotate(this.roll, 0, 0, 1)
        .rotate(this.pitch, 1, 0, 0)
        .rotate(this.yaw, 0, 1, 0)
        .translate(this.position)
        .scale(1, 0.1, 1);
};

Shadow.prototype.draw = function(camera) {
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
};