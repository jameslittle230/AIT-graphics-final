function Platform(gl, x, y, z) {
    this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
    this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

    this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

    this.PlatformTexture = new Texture2D(gl, '/textures/platform.png');

    this.material = new Material(gl, this.texProgram);
    this.material.colorTexture.set(this.PlatformTexture);

    this.multiMesh = new MultiMesh(gl, '/models/bigplatform.json', [this.material]);

    this.gameObject = new GameObject(this.multiMesh);
    this.gameObject.position.set(x, y-7, z);

    this.coordinates = [[0, 7, 0], [100, 7, 0], [0, 7, -100], [100, 7, -100]];
};

Platform.prototype.draw = function(camera) {
    this.gameObject.draw(camera);
}

Platform.prototype.move = function(dt, framecount, keysPressed, camera) {
    // Platforms don't move, silly
};

Platform.prototype.getTransformedCoordinates = function() {
    this.gameObject.updateModelMatrix();
    return this.coordinates.map((c) => {
        var vec = new Vec3(c[0], c[1], c[2]);
        vec.xyz0mul(this.gameObject.modelMatrix);
        return vec;
    });
}