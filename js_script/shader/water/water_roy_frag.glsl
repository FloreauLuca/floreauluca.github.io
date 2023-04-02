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

uniform float uScale;
uniform float uThickness;
uniform float uSpeed;
uniform float uWaveSpeed;
uniform float uMiddle;

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
  // gl_FragColor = screenPos;
  // gl_FragColor = vec4(vUv, 1.0, 1.0);
  // gl_FragColor = vec4(vPosition, 1.0);

  vec4 screenPos = vec4(gl_FragCoord.x / uWidth, gl_FragCoord.y / uHeight, gl_FragCoord.z, 1.0);
  float fragCoordZ = texture2D(uTexDepth, screenPos.xy).x;
  float depth = readDepth(fragCoordZ);
  float planeDepth = readDepth(gl_FragCoord.z);
  float waterDepth = clamp((depth - planeDepth) * uCameraFar / uDepthMaxDistance, 0.0, 1.0);
  vec3 waterColor = mix(uDepthGradientShallow, uDepthGradientDeep, waterDepth);
  float foamDepthDifference01 = clamp((depth - planeDepth) * uCameraFar / uFoamDistance, 0.0, 1.0);
  float surfaceNoiseCutoffProcess = foamDepthDifference01 * uSurfaceNoiseCutoff;
  float surfaceNoise = cyanWaveNoise(vPosition.xy, uTime, uSpeed, uScale, uWaveSpeed, uMiddle, uThickness * (1.0/surfaceNoiseCutoffProcess));
  // float surfaceNoise = noise((vPosition.xy) / uNoiseScale + uScrollSpeed * uTime) * .5 + .5;
  // surfaceNoise = surfaceNoise > surfaceNoiseCutoffProcess ? 1.0 : 0.0;
  // gl_FragColor.rgb = vec3( depth );
  // gl_FragColor.rgb = vec3( planeDepth );
  // gl_FragColor.rgb = vec3( waterDepth );
  // gl_FragColor = vec4( waterColor.rgb, 1.0 );
  gl_FragColor = vec4(waterColor.rgb + surfaceNoise, 1.0);
  gl_FragColor.a = 1.0;
}