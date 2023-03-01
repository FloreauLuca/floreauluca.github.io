export function vertexShader()
{
    return `
    varying vec2 vUv;
    varying vec4 vScreenPos;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        vec4 glPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vScreenPos = glPos;
        gl_Position = glPos;
    }
    `;
}
export function fragmentShader()
{
  return `
  #include <packing>

  uniform sampler2D tDiffuse;
  uniform sampler2D tDepth;
  uniform float cameraNear;
  uniform float cameraFar;
  uniform float width;
  uniform float height;

  varying vec2 vUv;
  varying vec4 vScreenPos;
  varying vec3 vPosition;

  float readDepth( sampler2D depthSampler, vec2 coord ) {
      float fragCoordZ = texture2D( depthSampler, coord ).x;
      float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
      return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
  }

  void main() {
      vec2 screenPos = vec2(vScreenPos.x / width, vScreenPos.y / height);
      //vec3 diffuse = texture2D( tDiffuse, screenPos ).rgb;
      float depth = readDepth( tDepth, screenPos );

      gl_FragColor.rgb = 1.0 - vec3( depth );
      gl_FragColor.a = 1.0;

      //gl_FragColor = vec4(screenPos, 1.0, 1.0);
      //gl_FragColor = vec4(vUv, 1.0, 1.0);
      //gl_FragColor = vec4(vPosition, 1.0);
  }
  `;
}