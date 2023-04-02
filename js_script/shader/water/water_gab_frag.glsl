#include <packing>

uniform sampler2D uTexDiffuse;
uniform sampler2D uTexDepth;
uniform float uCameraNear;
uniform float uCameraFar;
uniform float uWidth;
uniform float uHeight;
uniform float uDepthMaxDistance;
uniform vec3 uDepthGradientShallow;
uniform vec3 uDepthGradientDeep;
uniform float uSurfaceNoiseCutoff;
uniform float uFoamDistance;
uniform vec2 uScrollSpeed;
uniform vec2 uNoiseScale;
uniform float uTime;

varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;

float readDepth(float fragCoordZ)
{
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, uCameraNear, uCameraFar);
  return viewZToOrthographicDepth(viewZ, uCameraNear, uCameraFar);
}

void main()
{
  vec2 UV = vPosition.xy;
  float AngleOffset = uTime * 0.25;
  float CellDensity = 0.1;
  float Out = 0.0;
  float Cells = 0.0;
  unityVoronoiFloat(UV, AngleOffset, CellDensity, Out, Cells);
  gl_FragColor.rgb = vec3(Out);
  gl_FragColor.a = 1.0;
}