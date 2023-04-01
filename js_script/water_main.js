import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import * as GUIHelper from './utility/gui-helper.js';

function loadTextFile(url) {
    return fetch(url).then(response => response.text());
  }

let files = [];

const urls = [
'./shader/water/water_roy_vert.glsl',
'./shader/water/water_roy_frag.glsl',
];   

function createWater(camera, canvas, pos, size, renderTarget) {
    const waterShader = new THREE.ShaderMaterial({
        vertexShader: files[0],
        fragmentShader: files[1],
        uniforms: {
            time: { value: 0.0 },
            camera: { value: camera.position },
            cameraNear: { value: camera.near },
            cameraFar: { value: camera.far },
            width: { value: canvas.clientWidth },
            height: { value: canvas.clientHeight },
            tDiffuse: { value: renderTarget.texture },
            tDepth: { value: renderTarget.depthTexture },
            depthMaxDistance: { value: 3.0 },
            depthGradientShallow: { value: new THREE.Color(0.1, 0.8, 1.0) },
            depthGradientDeep: { value: new THREE.Color(0.0, 0.5, 1.0) },
            surfaceNoiseCutoff: { value: 0.75 },
            foamDistance: { value: 0.5 },
            noiseScale: { value: new THREE.Vector2(0.2, 0.4) },
            scrollSpeed: { value: new THREE.Vector2(0.1, 0.2) }
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
        material.uniforms.time.value += 0.1;
    };
    return water;
}

function drawWaterGUI(gui, water)
{
    const waterFolder = gui.addFolder("Water");
    waterFolder.add(water.material.uniforms.depthMaxDistance, 'value', 0.0, 5.0, 0.01)
        .name('depthMaxDistance');
    waterFolder.addColor(new GUIHelper.ColorGUIHelper(water.material.uniforms.depthGradientShallow, 'value'), 'value')
        .name('depthGradientShallow');
    waterFolder.addColor(new GUIHelper.ColorGUIHelper(water.material.uniforms.depthGradientDeep, 'value'), 'value')
        .name('depthGradientDeep');
    waterFolder.add(water.material.uniforms.surfaceNoiseCutoff, 'value', 0.0, 5.0, 0.01)
        .name('surfaceNoiseCutoff');
    waterFolder.add(water.material.uniforms.foamDistance, 'value', 0.0, 5.0, 0.01)
        .name('foamDistance');
    waterFolder.add(water.material.uniforms.noiseScale.value, 'x', 0.0, 2.0, 0.01)
        .name('noiseScaleX');
    waterFolder.add(water.material.uniforms.noiseScale.value, 'y', 0.0, 2.0, 0.01)
        .name('noiseScaleY');
    waterFolder.add(water.material.uniforms.scrollSpeed.value, 'x', 0.0, 5.0, 0.01)
        .name('scrollSpeedX');
    waterFolder.add(water.material.uniforms.scrollSpeed.value, 'y', 0.0, 5.0, 0.01)
        .name('scrollSpeedY');
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
    files = await Promise.all(urls.map(loadTextFile));
    
    
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