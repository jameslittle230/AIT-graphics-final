function Avatar(gl) {
    this.vsTex = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
    this.fsTex = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");

    this.texProgram = new TexturedQuadProgram(gl, this.vsTex, this.fsTex);

    this.avatarTexture = new Texture2D(gl, '/textures/chevy/chevy.png');
    this.avatarEyeTexture = new Texture2D(gl, '/textures/YadonEyeDh.png');
    this.shadowTexture = new Texture2D(gl, '/textures/shadow.png');

    this.material = new Material(gl, this.texProgram);
    this.material.colorTexture.set(this.avatarTexture);

    this.shadowMaterial = new Material(gl, this.texProgram);
    this.shadowMaterial.colorTexture.set(this.shadowTexture);

    this.eyeMaterial = new Material(gl, this.texProgram);
    this.eyeMaterial.colorTexture.set(this.avatarEyeTexture);

    this.multiMesh = new MultiMesh(gl, '/models/chevy/chassis.json', [this.material]);
    this.wheelMMesh = new MultiMesh(gl, '/models/chevy/wheel.json', [this.material]);
    this.shadowMesh = new MultiMesh(gl, '/models/chevy/chassis.json', [this.shadowMaterial]);

    this.gameObject = new GameObject(this.multiMesh, this.shadowMesh);
    this.gameObject.position.set(0, 5, 0);
    this.gameObject.yaw = Math.PI / 2;

    this.wheelGO1 = new GameObject(this.wheelMMesh);
    this.wheelGO1.position.set(-6.5, -3, 14);
    this.wheelGO1.parent = this.gameObject;

    this.wheelGO2 = new GameObject(this.wheelMMesh);
    this.wheelGO2.position.set(-6.5, -3, -11);
    this.wheelGO2.parent = this.gameObject;

    this.wheelGO3 = new GameObject(this.wheelMMesh);
    this.wheelGO3.position.set(6.5, -3, 14);
    this.wheelGO3.parent = this.gameObject;

    this.wheelGO4 = new GameObject(this.wheelMMesh);
    this.wheelGO4.position.set(6.5, -3, -11);
    this.wheelGO4.parent = this.gameObject;
};

Avatar.prototype.draw = function(camera) {
    this.gameObject.draw(camera);
    this.wheelGO1.draw(camera);
    this.wheelGO2.draw(camera);
    this.wheelGO3.draw(camera);
    this.wheelGO4.draw(camera);
}

Avatar.prototype.move = function(dt, framecount, keysPressed, camera) {
    if (keysPressed.W) {
        this.gameObject.position.addScaled(12*dt, this.gameObject.ahead);
        this.wheelGO1.pitch += 0.3;
        this.wheelGO2.pitch += 0.3;
        this.wheelGO3.pitch += 0.3;
        this.wheelGO4.pitch += 0.3;
    }

    if (keysPressed.S) {
        this.gameObject.position.addScaled(-12*dt, this.gameObject.ahead);
        this.wheelGO1.pitch -= 0.3;
        this.wheelGO2.pitch -= 0.3;
        this.wheelGO3.pitch -= 0.3;
        this.wheelGO4.pitch -= 0.3;
    }

    if (keysPressed.D) {
        this.gameObject.yaw -= 1*dt;
        this.wheelGO1.yaw = -0.4;
        this.wheelGO3.yaw = -0.4;
    }

    if (keysPressed.A) {
        this.gameObject.yaw += 1*dt;
        this.wheelGO1.yaw = 0.4;
        this.wheelGO3.yaw = 0.4;
    }

    if (!keysPressed.D && !keysPressed.A) {
        this.wheelGO1.yaw = 0;
        this.wheelGO3.yaw = 0;
    }

    if(!keysPressed.T) {
        camera.position.set(this.gameObject.position.plus(0, 20, 125));
    }
};