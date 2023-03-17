import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import * as WaterShader from './water_shader.js';
import * as PostProcess from './post_process_shader.js';

let waterShader;

function createWater(camera, pos, size) {
    waterShader = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            camera: { value: camera.position },
            cameraNear: { value: camera.near },
            cameraFar: { value: camera.far },
            width: { value: 1.0 },
            height: { value: 1.0 },
            tDiffuse: { value: null },
            tDepth: { value: null },
            depthMaxDistance: { value: 2.0 },
            depthGradientShallow: { value: new THREE.Color(0.1, 0.8, 1.0) },
            depthGradientDeep: { value: new THREE.Color(0.0, 0.5, 1.0) },
            surfaceNoiseCutoff: { value: 0.65 },
            foamDistance: { value: 1.0 },
            noiseScale: { value: new THREE.Vector2(0.2, 0.4) },
            scrollSpeed : {value : new THREE.Vector2(0.1, 0.2)}
        },
        fragmentShader: WaterShader.fragmentShader(),
        vertexShader: WaterShader.vertexShader(),
        transparent: true,
        depthTest: true,
        side: THREE.DoubleSide
    });
    const geometry = new THREE.PlaneGeometry(size.x, size.z);
    const water = new THREE.Mesh(geometry, waterShader);
    water.name = "Water";
    water.renderOrder = 2;
    water.position.set(pos.x, pos.y, pos.z);
    water.rotation.set(Math.PI/2, 0, 0);
    water.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
        //console.log(material)
        material.uniforms.time.value += 0.1;
    };
    return water;
}


function createCube(pos, size, rot) {
    const material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.FrontSide
    });
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Cube";
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.rotation.set(rot.x, rot.y, rot.z);
    return mesh
}


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

export default function main() {
    const stats = new Stats();
    const canvas = document.querySelector('#final_water');
    const container = document.querySelector('#container');

    container.appendChild(stats.dom);

    let camera, controls, renderer, scene;

    let renderTarget;
    let postScene, postCamera, postMaterial;

    const fov = 70;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, -10);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    const gui = new GUI();
    gui.close();

    renderer = new THREE.WebGLRenderer({ canvas });
    scene = new THREE.Scene();
    postScene = new THREE.Scene();
    // Our scene
    setupScene(scene);
    setupScene(postScene);
    postScene.add(createWater(camera, new THREE.Vector3(0, 1, 0), new THREE.Vector3(50, 1, 50)));
        
    // Create a render target with depth texture
    setupRenderTarget();

    // Setup post-processing step
    //setupPost();

    function update() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();
        stats.update();
        renderShader();
        // renderPostProcess();
        requestAnimationFrame(update);
    }

    update();
    console.log(scene);

    function setupRenderTarget() {

        if (renderTarget) renderTarget.dispose();

        const format = parseFloat(THREE.DepthFormat);
        const type = parseFloat(THREE.UnsignedIntType);

        renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        renderTarget.texture.minFilter = THREE.NearestFilter;
        renderTarget.texture.magFilter = THREE.NearestFilter;
        renderTarget.stencilBuffer = (format === THREE.DepthStencilFormat) ? true : false;
        renderTarget.depthTexture = new THREE.DepthTexture();
        renderTarget.depthTexture.format = format;
        renderTarget.depthTexture.type = type;

    }

    function setupPost() {

        // Setup post processing stage
        postCamera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
        postMaterial = new THREE.ShaderMaterial({
            vertexShader: PostProcess.vertexShader(),
            fragmentShader: PostProcess.fragmentShader(),
            uniforms: {
                cameraNear: { value: camera.near },
                cameraFar: { value: camera.far },
                tDiffuse: { value: null },
                tDepth: { value: null }
            }
        });
        const postPlane = new THREE.PlaneGeometry(2, 2);
        const postQuad = new THREE.Mesh(postPlane, waterShader);
        postScene = new THREE.Scene();
        postScene.add(postQuad);
    }

    function setupScene(scene) {
        
        scene.background = new THREE.Color(0x222222);


        let geometry = new THREE.BoxGeometry(50,1, 50);
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xffffff } ));
        mesh.name = "Ground";
        mesh.position.set(0,-1, 0);
        mesh.rotation.set(0, 0, 0);
        scene.add(mesh);
        
        geometry = new THREE.BoxGeometry(2, 2, 2);
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xffffff } ));
        mesh.name = "Cube";
        mesh.position.set(0,0.5, 0);
        mesh.rotation.set(Math.PI/4, 0,0);
        scene.add(mesh);
        
        geometry = new THREE.ConeGeometry(3, 4, 32);
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0x9999c0 } ));
        mesh.name = "Cone";
        mesh.position.set(5,0, 0);
        scene.add(mesh);
        
        geometry = new THREE.OctahedronGeometry(2, 2);
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0x99c099 } ));
        mesh.name = "Sphere";
        mesh.position.set(0,0, 5);
        scene.add(mesh);
        
        geometry = new THREE.TorusGeometry();
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xc09999 } ));
        mesh.name = "Torus";
        mesh.position.set(0,0.8, -5);
        mesh.rotation.set(Math.PI/2, 0,0);
        scene.add(mesh);
        
        geometry = new THREE.TorusKnotGeometry(1, 0.2, 128, 10, 3, 8);
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xf0ccaa } ));
        mesh.name = "TorusKnot";
        mesh.position.set(-5,1, 0);
        mesh.rotation.set(Math.PI/2, 0,0);
        scene.add(mesh);
    }

    function renderPostProcess() {

        // render scene into target
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);

        // render post FX
        postMaterial.uniforms.tDiffuse.value = renderTarget.texture;
        postMaterial.uniforms.tDepth.value = renderTarget.depthTexture;

        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);

        stats.update();

    }
    
    function renderShader() {


        // render scene into target
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);

        // render post FX
        const canvas = renderer.domElement;
        const width = canvas.clientWidth
        const height = canvas.clientHeight;
        waterShader.uniforms.tDiffuse.value = renderTarget.texture;
        waterShader.uniforms.tDepth.value = renderTarget.depthTexture;
        waterShader.uniforms.width.value = width;
        waterShader.uniforms.height.value = height;

        renderer.setRenderTarget(null);
        //renderer.render(scene, camera);
        renderer.render(postScene, camera);

        stats.update();

    }
}