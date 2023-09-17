import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

// import World from './engine/world.js';
import Light from './engine/light.js';
// import WorldGeneration from './world-generation.js';
import SceneRenderer from './engine/scene-renderer.js';
import CharacterController from './character-controller.js';
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

let stats;
let character;

let controls;

let camera;
let sceneRenderer;
let renderScene;
let prevTime;

export default async function main() {
    init();
    update();
}

function init()
{
    stats = new Stats();
    const canvas = document.querySelector('#museum');
    const container = document.querySelector('#container');
    container.appendChild(stats.dom);

    const gui = new GUI();
    gui.close();

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    //drawCommonGUI(gui, controls);
    
    sceneRenderer = new SceneRenderer(camera);
    renderScene = sceneRenderer.requestRenderIfNotRequested(sceneRenderer);

    character = new CharacterController(camera);
    character.init();
    controls = character.controls;
    console.log(character);
    console.log(controls);
    sceneRenderer.addToScene(controls.getObject());
    //controls.addEventListener('change', renderScene);
    window.addEventListener('resize', renderScene);
    prevTime = performance.now();

    const light = new Light(gui, renderScene);
    sceneRenderer.addToScene(light.ambientLight);
    sceneRenderer.addToScene(light.directionalLight);
    sceneRenderer.addToScene(light.directionalLight.target);
    
    buildMuseum();
}

function update() {
    const time = performance.now();
    const deltaTime =  ( time - prevTime ) / 1000;
    if (sceneRenderer.resizeRendererToDisplaySize()) {
        const canvas = sceneRenderer.renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    character.update(deltaTime, sceneRenderer.scene);
    // controls.update();
    stats.update();
    renderScene();
    requestAnimationFrame(update);
    prevTime = time;
}

function createTexture(xScale, yScale) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./assets/texture/UV-Block.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( xScale, yScale );
    const material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.FrontSide
    });

    return material;
}

function buildMuseum()
{
    const geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    geometry.rotateX( - Math.PI / 2 );
    const material = createTexture(2000, 2000);
    const plane = new THREE.Mesh( geometry, material );
    sceneRenderer.addToScene( plane );
    
    const wallGeometry = new THREE.BoxGeometry( 0.25, 10, 50);
    const wallMat = createTexture(50, 10);
    const wall1 = new THREE.Mesh( wallGeometry, wallMat );
    wall1.position.set(10, 5, 0);
    sceneRenderer.addToScene( wall1 );
    
    const wall2= new THREE.Mesh( wallGeometry, wallMat );
    wall2.position.set(-10, 5, 0);
    sceneRenderer.addToScene( wall2 );
    
    const cubeGeometry = new THREE.BoxGeometry( 1, 3, 1 );
    const cube = new THREE.Mesh( cubeGeometry, material );
    cube.position.set(0, 1.5, 10);
    sceneRenderer.addToScene( cube );

}