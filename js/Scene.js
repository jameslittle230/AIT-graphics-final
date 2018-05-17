"use strict";
const Scene = function(gl) {
  this.gl = gl;
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
  ];

  this.levels = [
    [
      new Platform(gl, -25, 0, 25, "start").scale(0.5, 1, 0.5),
      new Platform(gl, -150, 20, 50),
      new Platform(gl, -250, 40, 190, "end"),
    ],
    [
      new Platform(gl, -25, 0, 25, "start").scale(0.5, 1, 0.5),
      new Platform(gl, -50, 0, 50).scale(0.5, 1, 3).rotate(45, 45, 0),
      new Platform(gl, -160, 160, 120).scale(0.6, 1, 1),
      new Platform(gl, -220, 180, 240, "end")
    ],
    [
      new Platform(gl, -25, 0, 25, "start").scale(0.5, 1, 0.5),
    ]
  ]

  this.currentLevel = 1;
  this.timer = 0;

  // this.avatar.gameObject.position.y = 20;
  this.camera = new PerspectiveCamera();
  this.camera.pitch = 0;
  this.camera.yaw = Math.PI;
};

Scene.prototype.update = function(gl, keysPressed) {
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.frameCount++;
  this.timer += dt;

  console.log(this.timer);

  document.getElementById("levelOverlay").innerHTML = "Level " + (this.currentLevel + 1);
  document.getElementById("timerOverlay").innerHTML = "" + this.timer.toFixed(2);

// Clear screen
  gl.clearColor(1, 1, 1, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  Material.eyePos.set(this.camera.position);
  Material.rayDirMatrix.set(this.camera.rayDirMatrix);

  this.camera.move(dt, keysPressed, this.avatar);
  this.avatar.control(timeAtThisFrame, dt, keysPressed, this.levels[this.currentLevel], this.camera);

  this.background.draw(this.camera);
  
  this.gameObjects.forEach(gameObject => {
    gameObject.move(timeAtThisFrame, dt);
    gameObject.draw(this.camera);
  });

  this.levels[this.currentLevel].forEach(go => {
    go.draw(this.camera);
  })

  if(this.avatar.onEndPlatform > 10) {
    this.currentLevel++;
    this.resetScene();
  }

  if(this.avatar.gameObject.position.y < -100) {
    this.resetScene();
  }

  // if(this.frameCount == 10) console.log(this.gameObjects[1].getTransformedCoordinates().map((v) => {return v.storage.map((c) => c.toFixed(1)).join(", ")}));
  // if(this.frameCount % 10 == 0) console.log(this.camera.avatarOffset.storage, this.avatar.gameObject.position.storage);
};

Scene.prototype.resetScene = function() {
  this.timer = 0;
  this.avatar.reset();
  this.camera.reset();
}
