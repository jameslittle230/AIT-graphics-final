function Balloon(gl, x, z) {
    this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
    this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

    this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

    this.balloonTexture = new Texture2D(gl, '/textures/YadonDh.png');
    this.shadowTexture = new Texture2D(gl, '/textures/shadow.png');

    this.material = new Material(gl, this.texProgram);
    this.material.colorTexture.set(this.balloonTexture);

    this.shadowMaterial = new Material(gl, this.texProgram);
    this.shadowMaterial.colorTexture.set(this.shadowTexture);

    this.multiMesh = new MultiMesh(gl, '/models/slowpoke.json', [this.material, this.material]);
    this.shadowMesh = new MultiMesh(gl, '/models/slowpoke.json', [this.shadowMaterial, this.shadowMaterial]);

    this.gameObject = new GameObject(this.multiMesh, this.shadowMesh);
    this.gameObject.position.set(x, 50, z);
    this.gameObject.scale.set(0.8, 0.8, 0.8);
};

Balloon.prototype.draw = function(camera) {
    this.gameObject.draw(camera);
}

Balloon.prototype.move = function(dt, framecount, keysPressed, camera) {
    this.gameObject.yaw += 0.03/8;
    // this.gameObject.roll += 0.05 * Math.sin(framecount*100);
    this.gameObject.pitch = Math.sin(framecount/30)
    this.gameObject.position.add(this.gameObject.ahead.div(8));
};