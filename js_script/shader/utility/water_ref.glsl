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
