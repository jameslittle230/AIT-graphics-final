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

  this.isTouchingGround = true;

  this.move = function(t, dt) {
    this.gameObject.velocity.addScaled(dt, this.gameObject.accel);
    if(this.isTouchingGround) this.gameObject.velocity.mul(0.96, 1, 0.96);
    this.gameObject.position.addScaled(dt, this.gameObject.velocity);
    this.gameObject.pitch += this.gameObject.velocity.z * 0.0035;
    this.gameObject.roll -= this.gameObject.velocity.x * 0.0035;
  };

  this.control = function(t, dt, keysPressed, gameObjects) {
    this.isTouchingGround = this.computeGroundTouches(gameObjects);
    this.gameObject.accel.set(0, -0.8, 0);

    if(this.isTouchingGround) {
      this.gameObject.velocity.y *= -1;
      this.gameObject.accel.set(0, 0, 0);
    }
    
    if(keysPressed.W) this.gameObject.accel.add(0, 0, 1);
    if(keysPressed.S) this.gameObject.accel.sub(0, 0, 1);    
    if(keysPressed.A) this.gameObject.accel.add(0.8, 0, 0);
    if(keysPressed.D) this.gameObject.accel.sub(0.8, 0, 0);

    if(keysPressed.SPACE && this.gameObject.position.y <= 4) {
      this.gameObject.velocity.y = 80;
    };

    this.gameObject.accel.mul(190);
    if(keysPressed.P) console.log(this.gameObject.velocity.storage, this.gameObject.position.storage);
  }; 
}

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

Avatar.prototype.computeGroundTouches = function(gameObjects) {
  // return true;
  for(var i=0; i<gameObjects.length; i++) {
    var platform = gameObjects[i];
    if(!(platform instanceof Platform)) continue;
    const coords = platform.getTransformedCoordinates();

    const minx = Math.min(...coords.map((v) => {return v.x}));
    const maxx = Math.max(...coords.map((v) => {return v.x}));
    const minz = Math.min(...coords.map((v) => {return v.z}));
    const maxz = Math.max(...coords.map((v) => {return v.z}));
    const platformY = coords[0].y; // assuming all y will be the same

    const x = this.gameObject.position.x;
    const y = this.gameObject.position.y;
    const z = this.gameObject.position.z;
    
    if(
      // x coordinate is within platform's computed x boundaries AND
      (x >= minx && x <= maxx) &&
      // z coordinate is within platform's computed z boundaries AND
      (z >= minz && z <= maxz) &&
      // y coordinate is within (0, 14) of platform's computed y position
      (y >= platformY - 7 && y <= platformY + 7)
    ) {return true;}
  }
  return false;
}

Avatar.prototype.draw = function(camera) {
  this.gameObject.draw(camera);
};
