import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

// import World from './engine/world.js';
import Light from './engine/light.js';
// import WorldGeneration from './world-generation.js';
import SceneRenderer from './engine/scene-renderer.js';
// import * as Water from './engine/water.js';

function drawCommonGUI(gui, controls) {
    const controlFolder = gui.addFolder("Controls");
    const positionfolder = controlFolder.addFolder('position');
    positionfolder.add(controls.object.position, 'x');
    positionfolder.add(controls.object.position, 'y');
    positionfolder.add(controls.object.position, 'z');
    const quaternionfolder = controlFolder.addFolder('quaternion');
    quaternionfolder.add(controls.object.quaternion, 'x');
    quaternionfolder.add(controls.object.quaternion, 'y');
    quaternionfolder.add(controls.object.quaternion, 'z');
}

export default async function main() {
    const stats = new Stats();
    const canvas = document.querySelector('#museum');
    const container = document.querySelector('#container');
    container.appendChild(stats.dom);

    const gui = new GUI();
    gui.close();

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 64, 0);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    drawCommonGUI(gui, controls);

    const sceneRenderer = new SceneRenderer(camera);
    const renderScene = sceneRenderer.requestRenderIfNotRequested(sceneRenderer);

    //controls.addEventListener('change', renderScene);
    window.addEventListener('resize', renderScene);

    function update() {
        if (sceneRenderer.resizeRendererToDisplaySize()) {
            const canvas = sceneRenderer.renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();
        stats.update();
        renderScene();
        requestAnimationFrame(update);
    }

    update();

    const light = new Light(gui, renderScene);
    sceneRenderer.addToScene(light.ambientLight);
    sceneRenderer.addToScene(light.directionalLight);
    sceneRenderer.addToScene(light.directionalLight.target);
    
    const geometry = new THREE.PlaneGeometry( 10, 10 );
    const material = new THREE.MeshBasicMaterial( {color: 0xdddddd, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.set(Math.PI / 2, 0, 0);
    sceneRenderer.addToScene( plane );

    console.log("generate_terrain");
}