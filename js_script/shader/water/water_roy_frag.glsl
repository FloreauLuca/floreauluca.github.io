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
uniform vec2 uSpeed;
uniform vec2 uScale;
uniform float uTime;
uniform float uWaveSpeed;

varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
  vec2 uv = vPosition.xy / uScale + uSpeed * uTime;

  float waterDepth = royDepthValue(gl_FragCoord.xyz, vec2(uWidth, uHeight), uTexDepth, uCameraNear, uCameraFar, uDepthMaxDistance);
  vec3 waterColor = mix(uDepthGradientShallow, uDepthGradientDeep, waterDepth);

  float foamDepth = royDepthValue(gl_FragCoord.xyz, vec2(uWidth, uHeight), uTexDepth, uCameraNear, uCameraFar, uFoamDistance);
  float surfaceNoise = royWaveNoise(uv, uTime, uWaveSpeed, uSurfaceNoiseCutoff, foamDepth);

  gl_FragColor.rgb = waterColor.rgb + surfaceNoise;
  gl_FragColor.a = 1.0;
}