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
            tDepth: { value: null }
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
        // console.log(material)
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
    const near = 0.01;
    const far = 20;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, -10);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    const gui = new GUI();
    gui.close();

    renderer = new THREE.WebGLRenderer({ canvas });

    // Create a render target with depth texture
    setupRenderTarget();

    // Our scene
    setupScene();

    // Setup post-processing step
    setupPost();

    function update() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();
        stats.update();
        renderShader();
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
        const postQuad = new THREE.Mesh(postPlane, postMaterial);
        postScene = new THREE.Scene();
        postScene.add(postQuad);
    }

    function setupScene() {
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x222222);
        scene.add(createCube(new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 1, 5), new THREE.Vector3(0, 0, 0)));
        scene.add(createCube(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 1, 1), new THREE.Vector3(Math.PI/4, 0,0)));
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

        scene.add(createWater(camera, new THREE.Vector3(0, 1, 0), new THREE.Vector3(5, 1, 5)));

        // render post FX
        const canvas = renderer.domElement;
        const width = canvas.clientWidth
        const height = canvas.clientHeight;
        waterShader.uniforms.tDiffuse.value = renderTarget.texture;
        waterShader.uniforms.tDepth.value = renderTarget.depthTexture;
        waterShader.uniforms.width.value = 2.0;
        waterShader.uniforms.height.value = 2.0;

        renderer.setRenderTarget(null);
        renderer.render(scene, camera);

        stats.update();

    }
}