"use strict";
const GameObject = function(mesh, shadowMesh = null) {
    this.mesh = mesh;

    console.log(this.mesh);

    if(shadowMesh != null) {
        this.shadow = new Shadow(shadowMesh);;
    }

    this.position = new Vec3(0, 0, 0);
    this.pitch = 0;
    this.roll = 0;
    this.yaw = 0;
    this.scale = new Vec3(1, 1, 1);

    this.modelMatrix = new Mat4();

    this.parent = null;
};

Object.defineProperty(GameObject.prototype, 'ahead', {
    get: function() {
        var rotationMatrix = new Mat4()
            .rotate(this.roll, 0, 0, 1)
            .rotate(this.pitch, 1, 0, 0)
            .rotate(this.yaw, 0, 1, 0);

        return new Vec3(0, 0, 1).xyz1times(rotationMatrix);
    },
});

Object.defineProperty(GameObject.prototype, 'right', {
    get: function() {
        var rotationMatrix = new Mat4()
            .rotate(this.roll, 0, 0, 1)
            .rotate(this.pitch, 1, 0, 0)
            .rotate(this.yaw, 0, 1, 0);

        return new Vec3(1, 0, 0).xyz1times(rotationMatrix);
    },
});

GameObject.prototype.updateModelMatrix = function() {
    this.modelMatrix.set()
        .scale(this.scale)
        .rotate(this.roll, 0, 0, 1)
        .rotate(this.pitch, 1, 0, 0)
        .rotate(this.yaw, 0, 1, 0)
        .translate(this.position);

    if(this.parent != null) {
        this.parent.updateModelMatrix();
        this.modelMatrix.mul(this.parent.modelMatrix);
    }
};

GameObject.prototype.updateShadow = function(camera) {
    this.shadow.position = this.position;
    this.shadow.scale = this.scale;
    this.shadow.roll = this.roll;
    this.shadow.pitch = this.pitch;
    this.shadow.yaw = this.yaw;
    // this.shadow.modelMatrix.mul(camera.viewProjMatrix);
    // Material.modelViewProjMatrix.set(this.modelMatrix);
}

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

    if(this.shadow) {
        this.updateShadow(this);
        this.shadow.draw(camera);
    }

    // this.scale.y = 0.01;
    // this.position.y = 0.1;
    // this.updateModelMatrix();
    // Material.modelMatrix.set(this.modelMatrix);
    // this.modelMatrix.mul(camera.viewProjMatrix);
    // Material.modelViewProjMatrix.set(this.modelMatrix);
    // this.mesh.draw();
};