function Platform(gl, x, y, z, variant) {
    this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
    this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

    this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

    this.variant = variant;

    if(variant == "start") {
        this.PlatformTexture = new Texture2D(gl, '/textures/platform_start.png');
    } else if(variant == "end") {
        this.PlatformTexture = new Texture2D(gl, '/textures/platform_end.png');
    } else {
        this.PlatformTexture = new Texture2D(gl, '/textures/platform.png');
    }

    this.material = new Material(gl, this.texProgram);
    this.material.colorTexture.set(this.PlatformTexture);

    this.multiMesh = new MultiMesh(gl, '/models/bigplatform.json', [this.material]);

    this.gameObject = new GameObject(this.multiMesh);
    this.gameObject.position.set(x, y, z);

    return this;
};

Platform.prototype.scale = function(x, y, z) {
    this.gameObject.scale.set(x, y, z);
    return this;
}

Platform.prototype.rotate = function(y, p, r) {
    r = r / 360 * Math.PI * 2;
    p = p / 360 * Math.PI * 2;
    y = y / 360 * Math.PI * 2;
    this.gameObject.rotationMatrix.set().rotate(r, 0, 0, 1)
        .rotate(p, 1, 0, 0)
        .rotate(y, 0, 1, 0);
    return this;
}

Platform.prototype.normal = function() {
    // console.log(this.gameObject.rotationMatrix);
    var thing = new Vec3(0, 1, 0).xyz1mul(this.gameObject.rotationMatrix);
    // console.log(thing);
    return thing;
}

Platform.prototype.draw = function(camera) {
    this.gameObject.draw(camera);
}

Platform.prototype.move = function(dt, framecount, keysPressed, camera) {
    // Platforms don't move, silly
};