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
      float fragCoordZ = texture2D( depthSampler, coord.xy ).x;
      float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
      return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
  }

  void main() {
      vec4 screenPos = vec4(gl_FragCoord.x / width, gl_FragCoord.y / height, gl_FragCoord.z, 1.0);
      //vec3 diffuse = texture2D( tDiffuse, screenPos ).rgb;
      float depth = 1.0 - readDepth( tDepth, screenPos.xy );
	  float eyeDepth = 1.0 / mix(cameraNear, cameraFar, depth);

      //float fragCoordZ = texture2D( tDepth, vUv.xy ).x;
      float viewZ = perspectiveDepthToViewZ( gl_FragCoord.z, cameraNear, cameraFar );
      float orthoDepth = viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
      gl_FragColor.rgb = vec3( depth );
      //gl_FragColor.rgb = vec3( eyeDepth );
      //gl_FragColor.rgb = vec3( orthoDepth );
      gl_FragColor.rgb = (clamp(vec3( eyeDepth ) * 2.0, 0.0, 1.0));
      gl_FragColor.a = 1.0;

      //gl_FragColor = screenPos;
      //gl_FragColor = vec4(vUv, 1.0, 1.0);
      //gl_FragColor = vec4(vPosition, 1.0);
  }
  `;
}