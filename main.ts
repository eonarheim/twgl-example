import * as twgl from 'twgl.js'

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl2')!;

const vertex = `#version 300 es
in vec4 position;
in vec2 texcoord;
out vec2 uv;

void main() {
  uv = texcoord;
  gl_Position = position;
}
`

const fragment = `#version 300 es
precision mediump float;

in vec2 uv;

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

float sdfCircle(vec2 p, float r) {
    return length(p) - r;
}

void main() {
  vec2 pixelCoords = (uv - 0.5);
  vec3 color = vec3(0.);
  float d = sdfCircle(pixelCoords, 0.25);
  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
  fragColor.a = smoothstep(0.1, 0.11, d);
}
`

const programInfo = twgl.createProgramInfo(gl, [vertex, fragment]);

const arrays = {
    // Screen Quad in Clip Space
    // Top left (-1, -1), // Bottom Right (1, 1)
    position: [
        -1, -1, 0, // x, y, z
        1, -1, 0,
        -1, 1, 0,
        -1, 1, 0,
        1, -1, 0,
         1, 1, 0
    ],
    // UV coordinates
    texcoord: [
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ]
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

function render(time) {
    twgl.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const uniforms = {
        time: time * 0.001,
        resolution: [gl.canvas.width, gl.canvas.height],
    };

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);