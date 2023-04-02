uniform float uTime;
uniform vec3 uDepthGradientDeep;
uniform vec3 uDepthGradientShallow;
uniform vec2 uScale;
uniform float uThickness;
uniform vec2 uSpeed;
uniform float uWaveSpeed;
uniform float uMiddle;

uniform vec3 uWaterColor;
uniform vec3 uWaterDeepColor;
uniform vec3 uFoamColor;

varying vec2 vUv;
varying vec4 vScreenPos;
varying vec3 vPosition;

void main()
{
  vec2 uv = vPosition.xy / uScale + uSpeed * uTime;
  vec2 dist = waveUV(uv, uTime, vec2(0.05, 0.1), vec2(1.0,1.0), vec2(0.0, 0.1));
  float waterDeep = cyanWaveNoise(uv + dist.xy, uTime, uWaveSpeed, uMiddle, uThickness);
  float foam = cyanWaveNoise(vec2(1.0) - uv - dist.yx, uTime, uWaveSpeed, uMiddle, uThickness);

  vec3 color = mix(uWaterColor, uWaterDeepColor,waterDeep);
  color = mix(color, uFoamColor,foam);
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}