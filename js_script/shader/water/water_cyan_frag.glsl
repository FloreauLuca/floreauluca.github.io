#include <packing>

float cyanWaveNoise(vec2 uv, float time, float speed, float scale, float waveSpeed, float middle, float thickness)
{
  uv += time * speed;
  float value = 0.0;
  unitySimpleNoiseFloat(uv, scale, value);
  float wave = sin(time * waveSpeed)*0.05 + middle;
  float min = step(wave - thickness, value);
  float max = step(wave + thickness, value);
  return min - max;
}

uniform float uTime;
uniform vec3 uDepthGradientDeep;
uniform vec3 uDepthGradientShallow;
uniform float uScale;
uniform float uThickness;
uniform float uSpeed;
uniform float uWaveSpeed;
uniform float uMiddle;

varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;

void main()
{
  float value = cyanWaveNoise(vPosition.xy, uTime, uSpeed, uScale, uWaveSpeed, uMiddle, uThickness);
  vec3 color = mix(uDepthGradientDeep, uDepthGradientShallow, value);
  gl_FragColor.rgb = vec3(value);
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}