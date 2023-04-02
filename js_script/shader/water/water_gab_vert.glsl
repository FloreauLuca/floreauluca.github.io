varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;

void main()
{
    vUv = uv;
    vPosition = position;
    vec4 glPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenPos = glPos;
    gl_Position = glPos;
}