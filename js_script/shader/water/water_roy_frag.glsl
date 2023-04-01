#include <packing>

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform float width;
uniform float height;
uniform float depthMaxDistance;
uniform vec3 depthGradientShallow;
uniform vec3 depthGradientDeep;
uniform float surfaceNoiseCutoff;
uniform float foamDistance;
uniform vec2 scrollSpeed;
uniform vec2 noiseScale;
uniform float time;

varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;

vec2 random2(vec2 st)
{
  st = vec2(dot(st, vec2(127.1, 311.7)),
            dot(st, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st)
{
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                 dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                 dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
             u.y);
}

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
  float surfaceNoise = noise((vPosition.xy) / noiseScale + scrollSpeed * time) * .5 + .5;
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