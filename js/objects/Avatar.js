function Avatar(gl) {
  this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
  this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

  this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

  this.avatarTexture = new Texture2D(gl, "/textures/base.marble.png");

  this.material = new Material(gl, this.texProgram);
  this.material.colorTexture.set(this.avatarTexture);

  this.multiMesh = new MultiMesh(gl, "/models/Sphere.json", [this.material]);

  this.gameObject = new GameObject(this.multiMesh);
  this.gameObject.position.set(0, 3.5, 0);
  this.gameObject.scale.set(7, 7, 7);

  this.gameObject.move = function(t, dt) {
    this.velocity.addScaled(dt, this.accel);
    if(this.position.y <= 3.5) this.velocity.mul(0.96, 1, 0.96);
    this.position.addScaled(dt, this.velocity);
    this.pitch += this.velocity.z * 0.0035;
    this.roll -= this.velocity.x * 0.0035;
  };

  this.gameObject.control = function(t, dt, keysPressed, gameObjects) {
    if(this.position.y <= 3.5 && this.velocity.y <= 10) {
      this.position.y = 3.5;
      this.velocity.y = -this.velocity.y * 0.5;

      if(this.velocity.y < 10 && this.velocity.y > -10) {
        this.velocity.y = 0;
      }

      this.accel.set(0, 0, 0);
    } else {
      this.accel.set(0, -0.8, 0);
    }
    
    if(keysPressed.W) this.accel.add(0, 0, 1);
    if(keysPressed.S) this.accel.sub(0, 0, 1);    
    if(keysPressed.D) this.accel.add(0.8, 0, 0);
    if(keysPressed.A) this.accel.sub(0.8, 0, 0);
    if(keysPressed.SPACE && this.position.y <= 4) {
      this.velocity.y = 80;
    };

    this.accel.mul(190);
    if(keysPressed.P) console.log(this.velocity.storage, this.position.storage);
  };
  
}

Avatar.prototype.draw = function(camera) {
  this.gameObject.draw(camera);
};
