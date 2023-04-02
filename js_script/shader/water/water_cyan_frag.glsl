uniform float uTime;
uniform vec3 uDepthGradientDeep;
uniform vec3 uDepthGradientShallow;
uniform vec2 uScale;
uniform float uThickness;
uniform vec2 uSpeed;
uniform float uWaveSpeed;
uniform float uMiddle;

uniform sampler2D uTexDepth;
uniform float uCameraNear;
uniform float uCameraFar;
uniform float uDepthMaxDistance;
uniform float uWidth;
uniform float uHeight;
uniform float uFoamDistance;

uniform vec3 uWaterColor;
uniform vec3 uWaterDeepColor;
uniform vec3 uFoamColor;

varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;

void main()
{
  vec2 uv = vPosition.xy / uScale + uSpeed * uTime;
  float value = cyanWaveNoise(uv, uTime, uWaveSpeed, uMiddle, uThickness);
  float waterDepth = royDepthValue(gl_FragCoord.xyz, vec2(uWidth, uHeight), uTexDepth, uCameraNear, uCameraFar, uDepthMaxDistance);
  vec3 color = mix(uDepthGradientShallow, uDepthGradientDeep, waterDepth);
  
  float foamDepth = royDepthValue(gl_FragCoord.xyz, vec2(uWidth, uHeight), uTexDepth, uCameraNear, uCameraFar, uFoamDistance);
  
  //gl_FragColor.rgb = vec3(waterDepth);
  //gl_FragColor.rgb = depthGradient;
  color = mix(color, uDepthGradientShallow, value);
  color = mix(uFoamColor, color, step(uFoamDistance, foamDepth));
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}