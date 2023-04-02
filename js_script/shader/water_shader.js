export function vertexShader() {
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

export function fragmentShader1() {
    return `
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
  uniform float uTime;

  varying vec2 vUv;
  varying vec4 vScreenPos;
  varying vec3 vPosition;

    vec2 random2(vec2 st){
        st = vec2( dot(st,vec2(127.1,311.7)),
                dot(st,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(st)*43758.5453123);
    }

    // Gradient Noise by Inigo Quilez - iq/2013
    // https://www.shadertoy.com/view/XdXGW8
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        vec2 u = f*f*(3.0-2.0*f);

        return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    }

    float readDepth( float fragCoordZ ) {
        float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
        return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
    }

  void main() {
      //gl_FragColor = screenPos;
      //gl_FragColor = vec4(vUv, 1.0, 1.0);
      //gl_FragColor = vec4(vPosition, 1.0);

      vec4 screenPos = vec4(gl_FragCoord.x / width, gl_FragCoord.y / height, gl_FragCoord.z, 1.0);
      float fragCoordZ = texture2D( tDepth, screenPos.xy ).x;
      float depth = readDepth( fragCoordZ );
      float planeDepth = readDepth( gl_FragCoord.z );
      float waterDepth = clamp((depth - planeDepth) * cameraFar/depthMaxDistance, 0.0, 1.0);
      vec3 waterColor = mix(depthGradientShallow, depthGradientDeep, waterDepth);
      float surfaceNoise = noise((vPosition.xy) / noiseScale + scrollSpeed * uTime)*.5+.5;
      float foamDepthDifference01 = clamp((depth - planeDepth) * cameraFar/foamDistance, 0.0, 1.0);
      float surfaceNoiseCutoffProcess = foamDepthDifference01 * surfaceNoiseCutoff;
      surfaceNoise = surfaceNoise > surfaceNoiseCutoffProcess ? 1.0 : 0.0;
      //gl_FragColor.rgb = vec3( depth );
      //gl_FragColor.rgb = vec3( planeDepth );
      //gl_FragColor.rgb = vec3( waterDepth );
      //gl_FragColor = vec4( waterColor.rgb, 1.0 );
      gl_FragColor = vec4( waterColor.rgb + surfaceNoise, 1.0 );
      gl_FragColor.a = 1.0;
  }
  `;
}

export function fragmentShader2() {
    return `
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
  uniform float uTime;

  varying vec2 vUv;
  varying vec4 vScreenPos;
  varying vec3 vPosition;

    vec2 random2(vec2 st){
        st = vec2( dot(st,vec2(127.1,311.7)),
                dot(st,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(st)*43758.5453123);
    }

    // Gradient Noise by Inigo Quilez - iq/2013
    // https://www.shadertoy.com/view/XdXGW8
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        vec2 u = f*f*(3.0-2.0*f);

        return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    }

    float readDepth( float fragCoordZ ) {
        float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
        return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
    }

        vec2 Unity_RadialShear_float(vec2 UV, vec2 Center, vec2 Strength, vec2 Offset)
        {
        vec2 delta = UV - Center;
        float delta2 = dot(delta.xy, delta.xy);
        vec2 delta_offset = delta2 * Strength;
        return UV + vec2(delta.y, -delta.x) * delta_offset + Offset;
        }

        vec2 unity_voronoi_noise_randomVector (vec2 UV, float offset)
        {
        mat2 m = mat2(15.27, 47.63, 99.41, 89.98);
        UV = fract(sin(UV * m) * 46839.32);
        return vec2(sin(UV.y*+offset)*0.5+0.5, cos(UV.x*offset)*0.5+0.5);
        }

        float Unity_Voronoi_float(vec2 UV, float AngleOffset, float CellDensity, out float Out, out float Cells)
        {
        vec2 g = floor(UV * CellDensity);
        vec2 f = fract(UV * CellDensity);
        float t = 8.0;
        vec3 res = vec3(t, 0.0, 0.0);

        for(int y=-1; y<=1; y++)
        {
            for(int x=-1; x<=1; x++)
            {
                vec2 lattice = vec2(x,y);
                vec2 offset = unity_voronoi_noise_randomVector(lattice + g, AngleOffset);
                float d = distance(lattice + offset, f);
                if(d < res.x)
                {
                    res = vec3(d, offset.x, offset.y);
                    Out = res.x;
                    Cells = res.y;
                }
            }
        }
        return Out;
        }

  void main() {
      //gl_FragColor = screenPos;
      gl_FragColor = vec4(vUv, 1.0, 1.0);
      //gl_FragColor = vec4(vPosition, 1.0);
      vec2 radialUV = Unity_RadialShear_float(vUv.xy, vec2(0.5, 0.5), vec2(3.0, 3.0), vec2(0.0, 0.0));
      gl_FragColor = vec4(radialUV, 1.0, 1.0);


      //gl_FragColor.rgb = vec3( depth );
      //gl_FragColor.rgb = vec3( planeDepth );
      //gl_FragColor.rgb = vec3( waterDepth );
      //gl_FragColor = vec4( waterColor.rgb, 1.0 );
      float Out;
      float Cells;
      float voronoi = Unity_Voronoi_float(vUv.xy, uTime * 0.1, 10.0, Out, Cells);
      //voronoi = pow(voronoi / 2.0, 10.0);
      voronoi = voronoi > surfaceNoiseCutoff ? 1.0 : 0.0;
      gl_FragColor.rgb = vec3(voronoi);
      gl_FragColor.a = 1.0;
  }
  `;
}

export function fragmentShader3() {
    return `
    `;
}