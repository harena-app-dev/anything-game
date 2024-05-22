'use client'
import * as THREE from 'three';
import Col from '@/components/Col';
import Row from '@/components/Row';
import BackButton from '@/components/BackButton';
import MouseManager from '@/scripts/MouseManager';
import FPCamera from '@/scripts/FPCamera';
import KeyboardState from '@/scripts/KeyboardState';

export default function GamePage() {
  const mouseManager = new MouseManager();
  mouseManager.lockCursor();

  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

//   const map = new THREE.TextureLoader().load('icon.png');
//   const material = new THREE.SpriteMaterial({ map });

//   const sprite = new THREE.Sprite(material);
//   scene.add(sprite);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const fPCamera = new FPCamera(window);
  const keyboardState = new KeyboardState();
  function animation(time: number) {
    renderer.render(scene, fPCamera.camera);

    const mouseDelta = mouseManager.getDeltaMousePosition();
    mouseDelta.x *= -1;
    mouseDelta.y *= -1;
    mouseDelta.multiplyScalar(THREE.MathUtils.DEG2RAD);
    fPCamera.rotate(mouseDelta);
    fPCamera.move(
      new THREE.Vector3(
        keyboardState.isKeyDown('d') - keyboardState.isKeyDown('a'),
        keyboardState.isKeyDown(' ') - keyboardState.isKeyDown('Shift'),
        0 - keyboardState.isKeyDown('s') + keyboardState.isKeyDown('w'),
      ),
    );
    mouseManager.update();
  }
  renderer.setAnimationLoop(animation);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '-1';
  return (
    <Col>
      <Row>
        <BackButton />
      </Row>
      <div ref={(ref) => ref?.appendChild(renderer.domElement)} />
    </Col>
  );
}
