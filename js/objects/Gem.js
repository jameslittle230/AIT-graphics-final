function Gem(gl, x, y, z) {
    this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
    this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

    this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

    this.PlatformTexture = new Texture2D(gl, '/textures/gem.png');

    this.material = new Material(gl, this.texProgram);
    this.material.colorTexture.set(this.PlatformTexture);

    this.multiMesh = new MultiMesh(gl, '/models/Gem.json', [this.material]);

    this.modelOffset = new Vec3(42, 10, 10);

    this.gameObject = new GameObject(this.multiMesh);
    this.gameObject.position.set(x, y, z).sub(this.modelOffset);
    this.gameObject.scale.mul(0.2);

    this.touched = false;

    return this;
};

Gem.prototype.draw = function(camera) {
    if(!this.touched) this.gameObject.draw(camera);
}

Gem.prototype.move = function(dt, framecount, keysPressed, camera) {
    this.gameObject.rotationMatrix.rotate(0.2, 1, 0, 0);
};