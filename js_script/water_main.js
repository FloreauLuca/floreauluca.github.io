import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import * as GUIHelper from './utility/gui-helper.js';

function loadTextFile(url) {
    return fetch(url).then(response => response.text());
}

let shaders = [];
let utilityShaders = [];

const utilityURL = [
    './shader/utility/unity_nodes.glsl',
    './shader/utility/water_ref.glsl'
];

const shadersURL = [
    './shader/water/water_roy_vert.glsl',
    './shader/water/water_roy_frag.glsl',
    './shader/water/water_gab_vert.glsl',
    './shader/water/water_gab_frag.glsl',
    './shader/water/water_cyan_vert.glsl',
    './shader/water/water_cyan_frag.glsl',
];

function createWater(camera, canvas, pos, size, renderTarget) {
    const waterShader = new THREE.ShaderMaterial({
        vertexShader: shaders[0],
        fragmentShader: utilityShaders[0] + utilityShaders[1] + shaders[1],
        uniforms: {
            uTime: { value: 0.0 },
            uCamera: { value: camera.position },
            uCameraNear: { value: camera.near },
            uCameraFar: { value: camera.far },
            uWidth: { value: canvas.clientWidth },
            uHeight: { value: canvas.clientHeight },
            uTexDiffuse: { value: renderTarget.texture },
            uTexDepth: { value: renderTarget.depthTexture },

            uDepthMaxDistance: { value: 3.0 },
            uDepthGradientShallow: { value: new THREE.Color(0.1, 0.8, 1.0) },
            uDepthGradientDeep: { value: new THREE.Color(0.0, 0.5, 1.0) },
            uSurfaceNoiseCutoff: { value: 0.75 },
            uFoamDistance: { value: 1.5 },
            uNoiseScale: { value: new THREE.Vector2(0.2, 0.4) },
            uScrollSpeed: { value: new THREE.Vector2(0.1, 0.2) },

            uScale: { value: 2.0 },
            uThickness: { value: 0.02 },
            uSpeed: { value: 0.05 },
            uWaveSpeed: { value: 0.1 },
            uMiddle: { value: 0.5 },
        },
        transparent: true,
        depthTest: true,
        side: THREE.DoubleSide
    });

    const geometry = new THREE.PlaneGeometry(size.x, size.z);
    const water = new THREE.Mesh(geometry, waterShader);
    water.name = "Water";
    water.renderOrder = 2;
    water.position.set(pos.x, pos.y, pos.z);
    water.rotation.set(Math.PI / 2, 0, 0);
    water.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
        //console.log(material)
        material.uniforms.uTime.value += 0.1;
    };
    return water;
}

function drawWaterGUI(gui, water) {
    const waterFolder = gui.addFolder("Water");
    const waterRoyFolder = waterFolder.addFolder("WaterRoy");
    waterRoyFolder.add(water.material.uniforms.uDepthMaxDistance, 'value', 0.0, 5.0, 0.01)
        .name('depthMaxDistance');
    waterRoyFolder.addColor(new GUIHelper.ColorGUIHelper(water.material.uniforms.uDepthGradientShallow, 'value'), 'value')
        .name('depthGradientShallow');
    waterRoyFolder.addColor(new GUIHelper.ColorGUIHelper(water.material.uniforms.uDepthGradientDeep, 'value'), 'value')
        .name('depthGradientDeep');
    waterRoyFolder.add(water.material.uniforms.uSurfaceNoiseCutoff, 'value', 0.0, 5.0, 0.01)
        .name('surfaceNoiseCutoff');
    waterRoyFolder.add(water.material.uniforms.uFoamDistance, 'value', 0.0, 5.0, 0.01)
        .name('foamDistance');
    waterRoyFolder.add(water.material.uniforms.uNoiseScale.value, 'x', 0.0, 2.0, 0.01)
        .name('noiseScaleX');
    waterRoyFolder.add(water.material.uniforms.uNoiseScale.value, 'y', 0.0, 2.0, 0.01)
        .name('noiseScaleY');
    waterRoyFolder.add(water.material.uniforms.uScrollSpeed.value, 'x', 0.0, 5.0, 0.01)
        .name('scrollSpeedX');
    waterRoyFolder.add(water.material.uniforms.uScrollSpeed.value, 'y', 0.0, 5.0, 0.01)
        .name('scrollSpeedY');
    const waterCyanFolder = waterFolder.addFolder("WaterCyan");
    waterCyanFolder.add(water.material.uniforms.uScale, 'value', 0.0, 5.0, 0.01)
        .name('scale');
    waterCyanFolder.add(water.material.uniforms.uThickness, 'value', 0.0, 5.0, 0.01)
        .name('thickness');
    waterCyanFolder.add(water.material.uniforms.uSpeed, 'value', 0.0, 5.0, 0.01)
        .name('speed');
    waterCyanFolder.add(water.material.uniforms.uWaveSpeed, 'value', 0.0, 5.0, 0.01)
        .name('waveSpeed');
    waterCyanFolder.add(water.material.uniforms.uMiddle, 'value', 0.0, 5.0, 0.01)
        .name('middle');
}

function setupScene(scene) {

    scene.background = new THREE.Color(0x222222);

    let geometry = new THREE.BoxGeometry(30, 1, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    mesh.name = "Ground";
    mesh.position.set(-10, -1, 0);
    mesh.rotation.set(0, 0, 0);
    scene.add(mesh);

    geometry = new THREE.BoxGeometry(10, 1, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    mesh.name = "Ground";
    mesh.position.set(10, -0.5, 0);
    mesh.rotation.set(0, 0, 0);
    scene.add(mesh);

    geometry = new THREE.BoxGeometry(10, 1, 50);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    mesh.name = "Ground";
    mesh.position.set(20, 0, 0);
    mesh.rotation.set(0, 0, 0);
    scene.add(mesh);

    geometry = new THREE.BoxGeometry(5, 1, 5);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x777777 }));
    mesh.name = "Ground";
    mesh.position.set(20, 1, 0);
    mesh.rotation.set(0, 0, 0);
    scene.add(mesh);


    geometry = new THREE.BoxGeometry(2, 2, 2);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xaaaaaa }));
    mesh.name = "Cube";
    mesh.position.set(0, 0.5, 0);
    mesh.rotation.set(Math.PI / 4, 0, 0);
    scene.add(mesh);

    geometry = new THREE.ConeGeometry(3, 3, 32);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x9999c0 }));
    mesh.name = "Cone";
    mesh.position.set(5, 1, 0);
    scene.add(mesh);

    geometry = new THREE.OctahedronGeometry(1.5, 2);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x99c099 }));
    mesh.name = "Sphere";
    mesh.position.set(0, 0, 5);
    scene.add(mesh);

    geometry = new THREE.TorusGeometry();
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xc09999 }));
    mesh.name = "Torus";
    mesh.position.set(0, 0.8, -5);
    mesh.rotation.set(Math.PI / 2, 0, 0);
    scene.add(mesh);

    geometry = new THREE.TorusKnotGeometry(1, 0.2, 128, 10, 3, 8);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xf0ccaa }));
    mesh.name = "TorusKnot";
    mesh.position.set(-5, 1, 0);
    mesh.rotation.set(Math.PI / 2, 0, 0);
    scene.add(mesh);

    // Voxel coast
    geometry = new THREE.BoxGeometry(3, 2, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA6600 }));
    mesh.name = "Coast";
    mesh.position.set(-20, 1, 10);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 2.5, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA7550 }));
    mesh.name = "Coast";
    mesh.position.set(-21, 0.5, 9);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 1, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA7700 }));
    mesh.name = "Coast";
    mesh.position.set(-22, 1, 8);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 1, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA7700 }));
    mesh.name = "Coast";
    mesh.position.set(-23, 1, 7);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 1, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA7700 }));
    mesh.name = "Coast";
    mesh.position.set(-23, 1, 6);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 1, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA7700 }));
    mesh.name = "Coast";
    mesh.position.set(-24, 1, 5);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 1, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA7700 }));
    mesh.name = "Coast";
    mesh.position.set(-23, 1, 2);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 1, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA7700 }));
    mesh.name = "Coast";
    mesh.position.set(-22, 1, -1);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 2, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA6600 }));
    mesh.name = "Coast";
    mesh.position.set(-21, 1, -4);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(3, 2, 3);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xA6600 }));
    mesh.name = "Coast";
    mesh.position.set(-20, 1, -5);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(4, 1, 20);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xD4C546 }));
    mesh.name = "Coast";
    mesh.position.set(-22, 0, 5);
    scene.add(mesh);
    geometry = new THREE.BoxGeometry(4, 2, 20);
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xD0972A }));
    mesh.name = "Coast";
    mesh.position.set(-20, -1, 5);
    scene.add(mesh);
}

function createRenderTexture() {
    const format = parseFloat(THREE.DepthFormat);
    const type = parseFloat(THREE.UnsignedIntType);

    let renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    renderTarget.texture.minFilter = THREE.NearestFilter;
    renderTarget.texture.magFilter = THREE.NearestFilter;
    renderTarget.stencilBuffer = (format === THREE.DepthStencilFormat) ? true : false;
    renderTarget.depthTexture = new THREE.DepthTexture();
    renderTarget.depthTexture.format = format;
    renderTarget.depthTexture.type = type;

    return renderTarget;
}

export default async function main() {
    const stats = new Stats();
    const canvas = document.querySelector('#final_water');
    const container = document.querySelector('#container');

    container.appendChild(stats.dom);

    const gui = new GUI();
    gui.close();

    // load shaders
    shaders = await Promise.all(shadersURL.map(loadTextFile));
    utilityShaders = await Promise.all(utilityURL.map(loadTextFile));


    // setup camera and controls
    let camera, controls;
    {
        const fov = 70;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 10, -10);

        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);
    }

    const renderer = new THREE.WebGLRenderer({ canvas });

    // Our scene
    const scene = new THREE.Scene();
    const postScene = new THREE.Scene();
    setupScene(scene);
    setupScene(postScene);

    // Create a render target with depth texture
    const renderTarget = createRenderTexture();

    // Add water with correct render target
    const water = createWater(camera, canvas, new THREE.Vector3(0, 1, 0), new THREE.Vector3(50, 1, 50), renderTarget);
    postScene.add(water);
    drawWaterGUI(gui, water);

    function update() {
        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const pixelRatio = window.devicePixelRatio;
            const width = canvas.clientWidth * pixelRatio | 0;
            const height = canvas.clientHeight * pixelRatio | 0;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            water.material.uniforms.uWidth.value = canvas.clientWidth;
            water.material.uniforms.uHeight.value = canvas.clientHeight;
            return needResize;
        }

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();
        stats.update();

        // render scene into target
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);

        // render scene with water
        renderer.setRenderTarget(null);
        renderer.render(postScene, camera);

        requestAnimationFrame(update);
    }

    update();
    console.log(scene);
}