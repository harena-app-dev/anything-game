'use client'
import * as THREE from 'three';

export default class FPCamera {
  camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);

  cameraPitch = 0;

  cameraYaw = 0;

  movementSpeed = 0.01;

  rotateSpeed = 0.1;

  onWindowResize(window: Window) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  constructor(window: Window) {
    this.camera.position.z = 1;
    this.onWindowResize(window);
    window.addEventListener(
      'resize',
      this.onWindowResize.bind(this, window),
      false,
    );
  }

  rotate(radians: THREE.Vector2) {
    this.cameraPitch += radians.y * this.rotateSpeed;
    this.cameraPitch = THREE.MathUtils.clamp(
      this.cameraPitch,
      -Math.PI / 2 + 0.01,
      Math.PI / 2 - 0.01,
    );
    this.cameraYaw += radians.x * this.rotateSpeed;
    const defaultForward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.cameraYaw,
    );
    const forward = defaultForward
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw)
      .applyAxisAngle(right, this.cameraPitch);

    this.camera.lookAt(forward.add(this.camera.position));
  }

  move(localMoveVector: THREE.Vector3) {
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.cameraYaw,
    );
    // Log.debug(`forward: ${forward.x}, ${forward.y}, ${forward.z}`);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.cameraYaw,
    );
    const moveVector = forward
      .multiplyScalar(localMoveVector.z)
      .add(right.multiplyScalar(localMoveVector.x))
      .add(new THREE.Vector3(0, 1, 0).multiplyScalar(localMoveVector.y));
    this.camera.position.add(moveVector.multiplyScalar(this.movementSpeed));
  }
}
