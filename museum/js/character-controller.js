import * as THREE from 'three';

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let characterController;
export default class CharacterController {
  constructor(camera) {
    this.controls = new PointerLockControls(camera, document.body);
    this.controls.getObject().position.y = 5;
    this.bottomRay;
    this.directionRay;

    this.walkSpeed = 50.0;
    this.sprintSpeed = 150.0;
    this.jumpForce = 5.0;
    this.inputForward = false;
    this.inputBackward = false;
    this.inputLeft = false;
    this.inputRight = false;
    this.inputJump = false;
    this.inputSprint = false;
    this.canJump = false;

    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.position = new THREE.Vector3();
    characterController = this;
  }

  init() {

    const controls = this.controls;
    document.addEventListener('click', function () {

      controls.lock();

    });

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.bottomRay = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 1);
    this.directionRay = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0, 1);
  }

  onKeyDown(event) {
    console.log("onKeyDown", event);
    switch (event.code) {

      case 'ArrowUp':
      case 'KeyW':
        characterController.inputForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        characterController.inputLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        characterController.inputBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        characterController.inputRight = true;
        break;

      case 'Space':
        characterController.inputJump = true;
        break;

      case 'ShiftLeft':
      case 'ShiftRight':
        characterController.inputSprint = true;
        break;

    }
    //console.log("onKeyDown", characterController.inputForward, characterController.inputBackward, characterController.inputRight, characterController.inputLeft);

  };

  onKeyUp(event) {
    console.log("onKeyUp", event);
    switch (event.code) {

      case 'ArrowUp':
      case 'KeyW':
        characterController.inputForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        characterController.inputLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        characterController.inputBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        characterController.inputRight = false;
        break;

      case 'Space':
        characterController.inputJump = false;
        break;

      case 'ShiftLeft':
      case 'ShiftRight':
        characterController.inputSprint = false;
        break;

    }
    //console.log("onKeyUp", characterController.inputForward, characterController.inputBackward, characterController.inputRight, characterController.inputLeft);
  };

  update(deltaTime, scene) {
    if (this.controls.isLocked === true) {

      this.bottomRay.ray.origin.copy(this.controls.getObject().position);
      this.directionRay.ray.origin.copy(this.controls.getObject().position);

      const intersections = this.bottomRay.intersectObjects(scene.children, true);

      const onGround = intersections.length > 0;

      this.velocity.x -= this.velocity.x * 10.0 * deltaTime;
      this.velocity.z -= this.velocity.z * 10.0 * deltaTime;

      this.velocity.y -= 9.8 * 5 * deltaTime; // 100.0 = mass

      this.direction.z = Number(this.inputForward) - Number(this.inputBackward);
      this.direction.x = Number(this.inputRight) - Number(this.inputLeft);
      this.direction.normalize(); // this ensures consistent movements in all directions

      let speed = this.walkSpeed;
      if (this.inputSprint) {
        speed = this.sprintSpeed;
      }

      if (this.inputForward || this.inputBackward) {
        this.velocity.z -= this.direction.z * speed * deltaTime;
      }

      if (this.inputLeft || this.inputRight) {
        this.velocity.x -= this.direction.x * speed * deltaTime;
      }

      if (this.inputJump && this.canJump) {
        this.velocity.y += this.jumpForce;
        this.canJump = false;
      }

      if (onGround === true) {
        this.velocity.y = Math.max(0, this.velocity.y);
        this.canJump = true;
      }

      let dir = new THREE.Vector3();
      dir.set(this.velocity.x, this.velocity.y,this.velocity.z);
      dir.normalize();
      dir = new THREE.Vector3(-dir.x, 0,dir.z).applyQuaternion( this.controls.getObject().quaternion );
      this.directionRay.ray.direction.set(dir.x, 0, dir.z);
      const colliders = this.directionRay.intersectObjects(scene.children, true);
      const isColliding = colliders.length > 0;
      if (isColliding == false)
      {
        this.controls.moveRight(- this.velocity.x * deltaTime);
        this.controls.moveForward(- this.velocity.z * deltaTime);
      }

      this.controls.getObject().position.y += (this.velocity.y * deltaTime); // new behavior

      if (this.controls.getObject().position.y < 0) {

        this.velocity.y = 0;
        this.controls.getObject().position.y = 0;

        this.canJump = true;

      }
      this.position = this.controls.getObject().position;
      //console.log(deltaTime, this.position, this.velocity, this.inputForward, this.inputBackward, this.inputRight, this.inputLeft, this.inputJump, this.inputSprint);

    }
  }
}