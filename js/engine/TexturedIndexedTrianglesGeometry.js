"use strict";
// property vertices: 3n coordinates in continuous array
// property normals: 3n elements in continuous array
// property texturecoords: array (typically with a single element, as the model has one set of texture coordinates) of continuous arrays of 2n elements
// property faces: array of n arrays of 3 indices
const TexturedIndexedTrianglesGeometry = function(gl, jsonObject) {
  this.gl = gl;
  this.indices = [].concat.apply([], jsonObject.faces);

  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(jsonObject.vertices),
    gl.STATIC_DRAW);

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(jsonObject.normals),
    gl.STATIC_DRAW);

    this.vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(jsonObject.texturecoords[0]),
    gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(this.indices),
    gl.STATIC_DRAW);
};

TexturedIndexedTrianglesGeometry.prototype.draw = function() {
    var gl = this.gl;
    // set vertex buffer to pipeline input
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
        3, gl.FLOAT, //< three pieces of float
        false, //< do not normalize (make unit length)
        0, //< tightly packed
        0 //< data starts at array start
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
  gl.enableVertexAttribArray(2); 
  gl.vertexAttribPointer(2, 
    2, gl.FLOAT, //< two pieces of float 
    false, //< do not normalize (make unit length) 
    0, //< tightly packed 
    0 //< data starts at array start 
  );

    // set index buffer to pipeline input 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer); 
  
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

};
