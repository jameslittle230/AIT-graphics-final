"use strict";
const PerspectiveCamera = function () {
    this.position = new Vec3(0.0, 20.0, 85.0);
    this.originalPosition = new Vec3();
    this.ahead = new Vec3(0.0, 0.0, -1.0);
    this.right = new Vec3(1.0, 0.0, 0.0);
    this.up = new Vec3(0.0, 1.0, 0.0);

    this.yaw = 0.0;
    this.pitch = 0.0;
    this.fov = 1.0;
    this.aspect = 1.0;
    this.nearPlane = 0.1;
    this.farPlane = 1000.0;

    this.speed = 0.5;

    this.isDragging = false;
    this.trackingFirstFrame = true;
    this.mouseDelta = new Vec2(0.0, 0.0);

    this.viewMatrix = new Mat4();
    this.projMatrix = new Mat4();
    this.viewProjMatrix = new Mat4();
    this.updateViewMatrix();
    this.updateProjMatrix();
};

PerspectiveCamera.worldUp = new Vec3(0, 1, 0);

PerspectiveCamera.prototype.updateViewMatrix = function () {
    this.viewMatrix.set(
        this.right.x, this.right.y, this.right.z, 0,
        this.up.x, this.up.y, this.up.z, 0,
        -this.ahead.x, -this.ahead.y, -this.ahead.z, 0,
        0, 0, 0, 1)
        .translate(this.position).invert();

    this.viewProjMatrix.set(this.viewMatrix).mul(this.projMatrix);
};

PerspectiveCamera.prototype.updateProjMatrix = function () {
    var yScale = 1.0 / Math.tan(this.fov * 0.5);
    var xScale = yScale / this.aspect;
    var f = this.farPlane;
    var n = this.nearPlane;
    this.projMatrix.set(
        xScale, 0, 0, 0,
        0, yScale, 0, 0,
        0, 0, (n + f) / (n - f), -1,
        0, 0, 2 * n * f / (n - f), 0);
    this.viewProjMatrix.set(this.viewMatrix).mul(this.projMatrix);
};

PerspectiveCamera.prototype.move = function (dt, keysPressed) {
    if(keysPressed.T) {
        if(this.trackingFirstFrame) {
            console.log("First frame of tracking shot");
            this.trackingFirstFrame = false;
            this.originalPosition.set(this.position);
            this.position.set(this.originalPosition.plus(-25, 5, 0));
        }

        console.log("Another frame of tracking shot");
        this.position.add(dt*5, dt*-1, 0);

        if(this.position.y < 0.1) {
            this.position.set(this.originalPosition.plus(-25, 5, 0));
        }
    }

    if(!keysPressed.T) {
        if(!this.trackingFirstFrame) {
            console.log("Last frame of tracking shot");
            this.trackingFirstFrame = true;
            this.position.set(this.originalPosition);
        }
    }
    if (this.isDragging) {
        this.yaw -= this.mouseDelta.x * 0.002;
        this.pitch -= this.mouseDelta.y * 0.002;

        if (this.pitch > 3.14 / 2.0) {
            this.pitch = 3.14 / 2.0;
        }
        if (this.pitch < -3.14 / 2.0) {
            this.pitch = -3.14 / 2.0;
        }

        this.mouseDelta = new Vec2(0.0, 0.0);

        this.ahead = new Vec3(
            -Math.sin(this.yaw) * Math.cos(this.pitch),
            Math.sin(this.pitch),
            -Math.cos(this.yaw) * Math.cos(this.pitch));
        
        this.right.setVectorProduct(this.ahead, PerspectiveCamera.worldUp);
        this.right.normalize();
        this.up.setVectorProduct(this.right, this.ahead);
    }

    this.updateViewMatrix();
};

PerspectiveCamera.prototype.mouseDown = function () {
    this.isDragging = true;
    this.mouseDelta.set();
};

PerspectiveCamera.prototype.mouseMove = function (event) {
    this.mouseDelta.x += event.movementX;
    this.mouseDelta.y += event.movementY;

    // console.log(event.clientX);
    // if(event.movementX < 5 || event.movementX > (window.innerWidth - 5) || event.movementY < 5 || event.movementY > (window.innerHeight - 5)) {
    //     this.mouseUp();
    // }
    event.preventDefault();
};

PerspectiveCamera.prototype.mouseUp = function () {
    this.isDragging = false;
};

PerspectiveCamera.prototype.setAspectRatio = function (ar) {
    this.aspect = ar;
    this.updateProjMatrix();
};