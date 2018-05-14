"use strict";
const Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);

  this.skyCubeTexture = new TextureCube(gl, [
    "textures/skybox/sky_RT.jpg",
    "textures/skybox/sky_LF.jpg",
    "textures/skybox/sky_UP.jpg",
    "textures/skybox/sky_DN.jpg",
    "textures/skybox/sky_FR.jpg",
    "textures/skybox/sky_BK.jpg"
  ]);

  this.bgvs = new Shader(gl, gl.VERTEX_SHADER, "bg_vs.essl");
  this.bgfs = new Shader(gl, gl.FRAGMENT_SHADER, "bg_fs.essl");
  this.bgProgram = new TexturedQuadProgram(gl, this.bgvs, this.bgfs);
  this.backgroundGeometry = new TexturedQuadGeometry(gl);
  this.backgroundMaterial = new Material(gl, this.bgProgram);
  this.backgroundMaterial.envmapTexture.set(this.skyCubeTexture);
  this.backgroundMesh = new Mesh(this.backgroundGeometry, this.backgroundMaterial);
  this.background = new GameObject(this.backgroundMesh);

  this.timeAtLastFrame = new Date().getTime();
  this.frameCount = 0;

  this.avatar = new Avatar(gl);

  this.gameObjects = [
    this.avatar,
    // new Platform(gl),
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

  Material.eyePos.set(this.camera.position);
  Material.rayDirMatrix.set(this.camera.rayDirMatrix);

  this.avatar.gameObject.control(timeAtThisFrame, dt, keysPressed, this.gameObjects);
  this.camera.move(dt, keysPressed);
  this.camera.position.set(this.avatar.gameObject.position.minus(0, -10, 50));
  this.background.draw(this.camera);
  this.gameObjects.forEach(gameObject => {
    gameObject.gameObject.move(timeAtThisFrame, dt);
    gameObject.draw(this.camera);
  });
};


