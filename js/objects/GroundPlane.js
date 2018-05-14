function GroundPlane(gl) {
    this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
    this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "inf_fs.essl");

    this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

    this.groundPlaneTexture = new Texture2D(gl, '/textures/map.jpg');

    this.material = new Material(gl, this.texProgram);
    this.material.colorTexture.set(this.groundPlaneTexture);

    this.infiniteQuadGeometry = new InfiniteQuadGeometry(gl);

    this.mesh = new Mesh(this.infiniteQuadGeometry, this.material);

    this.gameObject = new GameObject(this.mesh, null);
};

GroundPlane.prototype.draw = function(camera) {
    this.gameObject.draw(camera);
}

GroundPlane.prototype.move = function(dt, framecount, keysPressed, camera) {

};