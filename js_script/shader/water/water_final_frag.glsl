#include <packing>

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform float width;
uniform float height;
uniform float depthMaxDistance;
uniform vec3 uDepthGradientShallow;
uniform vec3 uDepthGradientDeep;
uniform float surfaceNoiseCutoff;
uniform float foamDistance;
uniform vec2 scrollSpeed;
uniform vec2 noiseScale;
uniform float uuTime;

varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;

float readDepth(float fragCoordZ)
{
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

void main()
{
  // gl_FragColor = screenPos;
  // gl_FragColor = vec4(vUv, 1.0, 1.0);
  // gl_FragColor = vec4(vPosition, 1.0);

  vec4 screenPos = vec4(gl_FragCoord.x / width, gl_FragCoord.y / height, gl_FragCoord.z, 1.0);
  float fragCoordZ = texture2D(tDepth, screenPos.xy).x;
  float depth = readDepth(fragCoordZ);
  float planeDepth = readDepth(gl_FragCoord.z);
  float waterDepth = clamp((depth - planeDepth) * cameraFar / depthMaxDistance, 0.0, 1.0);
  vec3 waterColor = mix(depthGradientShallow, depthGradientDeep, waterDepth);
  float surfaceNoise = noise((vPosition.xy) / noiseScale + scrollSpeed * uuTime) * .5 + .5;
  float foamDepthDifference01 = clamp((depth - planeDepth) * cameraFar / foamDistance, 0.0, 1.0);
  float surfaceNoiseCutoffProcess = foamDepthDifference01 * surfaceNoiseCutoff;
  surfaceNoise = surfaceNoise > surfaceNoiseCutoffProcess ? 1.0 : 0.0;
  // gl_FragColor.rgb = vec3( depth );
  // gl_FragColor.rgb = vec3( planeDepth );
  // gl_FragColor.rgb = vec3( waterDepth );
  // gl_FragColor = vec4( waterColor.rgb, 1.0 );
  gl_FragColor = vec4(waterColor.rgb + surfaceNoise, 1.0);
  gl_FragColor.a = 1.0;
}