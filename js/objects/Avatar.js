function Avatar(gl) {
  this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
  this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

  this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

  this.avatarTexture = new Texture2D(gl, "/textures/marbletexture.png");

  this.material = new Material(gl, this.texProgram);
  this.material.colorTexture.set(this.avatarTexture);

  this.multiMesh = new MultiMesh(gl, "/models/Sphere.json", [this.material]);

  this.gameObject = new GameObject(this.multiMesh);
  this.gameObject.position.set(0, 3.5, 0);
  this.gameObject.scale.set(7, 7, 7);

  this.gameObject.move = function(t, dt) {
    this.velocity.addScaled(dt, this.accel);
    this.velocity.mul(0.9);
    this.position.addScaled(dt, this.velocity);
  };

  this.gameObject.control = function(t, dt, keysPressed, gameObjects) {
    this.accel.set(0, 0, 0);
    if(keysPressed.W) this.accel.add(0, 0, 1);
    if(keysPressed.S) this.accel.sub(0, 0, 1);    
    if(keysPressed.D) this.accel.add(1, 0, 0);
    if(keysPressed.A) this.accel.sub(1, 0, 0);
    if(keysPressed.SPACE) this.jump();
    this.accel.normalize().mul(230);
    if(keysPressed.P) console.log(this.velocity, 1/this.backDrag);
  };
  
}

Avatar.prototype.draw = function(camera) {
  this.gameObject.draw(camera);
};

// Avatar.prototype.move = function(dt, framecount, keysPressed, camera) {
//   if (keysPressed.W) {
//     this.gameObject.position.addScaled(12 * dt, this.gameObject.ahead);
//   }

//   if (keysPressed.S) {
//     this.gameObject.position.addScaled(-12 * dt, this.gameObject.ahead);
//   }

//   if (keysPressed.D) {
//     this.gameObject.yaw -= 1 * dt;
//   }

//   if (keysPressed.A) {
//     this.gameObject.yaw += 1 * dt;
//   }

//   if (!keysPressed.T) {
//     camera.position.set(this.gameObject.position.plus(0, 20, 125));
//   }
// };
