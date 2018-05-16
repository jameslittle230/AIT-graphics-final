function Avatar(gl) {
  this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
  this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

  this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

  this.avatarTexture = new Texture2D(gl, "/textures/base.marble.png");

  this.material = new Material(gl, this.texProgram);
  this.material.colorTexture.set(this.avatarTexture);

  this.multiMesh = new MultiMesh(gl, "/models/Sphere.json", [this.material]);

  this.gameObject = new GameObject(this.multiMesh);
  this.gameObject.position.set(0, 30, 0);
  this.gameObject.scale.set(7, 7, 7);

  this.isTouchingGround = true;
  this.onEndPlatform = 0;

  this.move = function(t, dt) {
    this.gameObject.velocity.addScaled(dt, this.gameObject.accel);

    if(this.isTouchingGround) {
      this.gameObject.velocity.mul(0.96, 1, 0.96);
    }

    if(!this.isTouchingGround) {
      this.gameObject.velocity.mul(1, 1, 1);
    }

    this.gameObject.position.addScaled(dt, this.gameObject.velocity);

    let vel = this.gameObject.velocity;

    var rotationAxis = new Vec3(vel.z, 0, -1 * vel.x);
    var rotationSpeed = Math.sqrt(vel.x*vel.x+vel.z*vel.z);
    this.gameObject.rotationMatrix.rotate(dt * 0.3 * rotationSpeed, rotationAxis);
  };

  this.control = function(t, dt, keysPressed, gameObjects, cam) {
    this.isTouchingGround = this.computeGroundTouches(gameObjects);
    // if(this.isTouchingGround) console.log("Touching the ground")
    this.gameObject.accel.set(0, -0.8, 0);

    if(this.isTouchingGround) {
      this.gameObject.velocity.y = 0;
      this.gameObject.accel.set(0, 0, 0);
  
      if(keysPressed.SPACE) {
        this.gameObject.position.y += 1;
        this.gameObject.velocity.y = 80;
      };
    }

    if(keysPressed.W) this.gameObject.accel.add(new Vec3(cam.ahead.x, 0, cam.ahead.z).normalize());
    if(keysPressed.S) this.gameObject.accel.sub(new Vec3(cam.ahead.x, 0, cam.ahead.z).normalize());    
    if(keysPressed.A) this.gameObject.accel.sub(new Vec3(cam.right.x, 0, cam.right.z).normalize());
    if(keysPressed.D) this.gameObject.accel.add(new Vec3(cam.right.x, 0, cam.right.z).normalize());

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
    gameObjects[i].gameObject.updateModelMatrix();
    const coords = this.gameObject.position.xyz1times(gameObjects[i].gameObject.modelMatrix.invert());
    // console.log(gameObjects[i].gameObject.position.storage);
    // gameObjects[i].gameObject.modelMatrix.p;
    // console.log(coords);
    // debugger;
    
    if(
      // x coordinate is within platform's computed x boundaries AND
      (coords.x >= 0 && coords.x <= 100) &&
      // z coordinate is within platform's computed z boundaries AND
      (coords.z >= -100 && coords.z <= 0) &&
      // y coordinate is within (0, 14) of platform's computed y position
      (coords.y >= 0 && coords.y <= 10)
    ) {
      if(platform.variant == "end") {
        this.onEndPlatform++;
      }
      return true;
    }
  }
  return false;
}

Avatar.prototype.draw = function(camera) {
  this.gameObject.draw(camera);
};

Avatar.prototype.reset = function() {
  this.onEndPlatform = 0;
  this.gameObject.accel = new Vec3();
  this.gameObject.velocity = new Vec3().set(0, 0, 0);
  this.gameObject.position.set(0, 30, 0);
}
