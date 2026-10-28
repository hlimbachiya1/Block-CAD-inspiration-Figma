import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type ThreeViewportProps = {
  color: string;
  objectCount: number;
  selectedShape: string;
  zoom: number;
  resetKey: number;
};

function material(color: string, roughness = 0.55) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 });
}

function mesh(
  geometry: THREE.BufferGeometry,
  color: string,
  position: [number, number, number],
  rotation?: [number, number, number],
) {
  const object = new THREE.Mesh(geometry, material(color));
  object.position.set(...position);
  if (rotation) object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function createRobot(headColor: string) {
  const robot = new THREE.Group();
  robot.name = "robot";

  const body = mesh(new THREE.BoxGeometry(1.65, 1.55, 1.15), "#f4f8f8", [0, 1.65, 0]);
  const head = mesh(new THREE.BoxGeometry(1.9, 1.15, 1.25), headColor, [0, 3.05, 0]);
  head.name = "robot-head";

  const dark = "#011627";
  const eyeGeometry = new THREE.SphereGeometry(0.12, 20, 12);
  const leftEye = mesh(eyeGeometry, dark, [-0.43, 3.16, 0.64]);
  const rightEye = mesh(eyeGeometry, dark, [0.43, 3.16, 0.64]);

  const panel = mesh(new THREE.BoxGeometry(0.92, 0.62, 0.08), dark, [0, 1.75, 0.62]);
  const lightGeometry = new THREE.SphereGeometry(0.07, 16, 10);
  const lights = ["#6ba368", "#08a4bd", "#e71d36"].map((color, index) =>
    mesh(lightGeometry, color, [-0.25 + index * 0.25, 1.78, 0.68]),
  );

  const armGeometry = new THREE.CapsuleGeometry(0.2, 1.05, 6, 12);
  const leftArm = mesh(armGeometry, "#e8eeee", [-1.15, 1.68, 0], [0, 0, -0.16]);
  const rightArm = mesh(armGeometry, "#e8eeee", [1.15, 1.68, 0], [0, 0, 0.16]);
  const handGeometry = new THREE.SphereGeometry(0.26, 20, 14);
  const leftHand = mesh(handGeometry, "#e71d36", [-1.26, 0.9, 0]);
  const rightHand = mesh(handGeometry, "#e71d36", [1.26, 0.9, 0]);

  const legGeometry = new THREE.BoxGeometry(0.48, 0.95, 0.62);
  const leftLeg = mesh(legGeometry, "#dfe7e8", [-0.48, 0.35, 0]);
  const rightLeg = mesh(legGeometry, "#dfe7e8", [0.48, 0.35, 0]);
  const footGeometry = new THREE.BoxGeometry(0.72, 0.3, 0.95);
  const leftFoot = mesh(footGeometry, dark, [-0.48, -0.22, 0.14]);
  const rightFoot = mesh(footGeometry, dark, [0.48, -0.22, 0.14]);

  const antenna = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12), "#42515d", [0, 3.9, 0]);
  const antennaTip = mesh(new THREE.SphereGeometry(0.15, 18, 12), "#e71d36", [0, 4.22, 0]);

  robot.add(
    body,
    head,
    leftEye,
    rightEye,
    panel,
    ...lights,
    leftArm,
    rightArm,
    leftHand,
    rightHand,
    leftLeg,
    rightLeg,
    leftFoot,
    rightFoot,
    antenna,
    antennaTip,
  );
  robot.rotation.y = -Math.PI / 8;
  return robot;
}

function shapeGeometry(shape: string) {
  switch (shape) {
    case "Sphere":
      return new THREE.SphereGeometry(0.62, 32, 20);
    case "Cylinder":
      return new THREE.CylinderGeometry(0.58, 0.58, 1.25, 32);
    case "Cone":
      return new THREE.ConeGeometry(0.68, 1.35, 32);
    case "Pyramid":
      return new THREE.ConeGeometry(0.76, 1.35, 4);
    case "Torus":
      return new THREE.TorusGeometry(0.6, 0.22, 18, 40);
    default:
      return new THREE.BoxGeometry(1.15, 1.15, 1.15);
  }
}

export default function ThreeViewport({
  color,
  objectCount,
  selectedShape,
  zoom,
  resetKey,
}: ThreeViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    camera: THREE.OrthographicCamera;
    controls: OrbitControls;
    robotHead: THREE.Mesh;
    addedShape: THREE.Mesh | null;
    scene: THREE.Scene;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#edf2f3");
    scene.fog = new THREE.Fog("#edf2f3", 15, 28);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / Math.max(height, 1);
    const viewSize = 8.2;
    const camera = new THREE.OrthographicCamera(
      (-viewSize * aspect) / 2,
      (viewSize * aspect) / 2,
      viewSize / 2,
      -viewSize / 2,
      0.1,
      100,
    );
    camera.position.set(8, 7, 8);
    camera.lookAt(0, 1.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.55, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minZoom = 0.55;
    controls.maxZoom = 2.5;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.screenSpacePanning = true;
    controls.update();

    scene.add(new THREE.HemisphereLight("#ffffff", "#b9c7c6", 2.2));
    const keyLight = new THREE.DirectionalLight("#ffffff", 4);
    keyLight.position.set(-5, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const ground = mesh(new THREE.PlaneGeometry(40, 40), "#edf2f3", [0, -0.39, 0], [-Math.PI / 2, 0, 0]);
    ground.castShadow = false;
    scene.add(ground);

    const grid = new THREE.GridHelper(40, 80, "#9bb0b5", "#cdd8da");
    grid.position.y = -0.38;
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((gridMaterial) => {
      gridMaterial.transparent = true;
      gridMaterial.opacity = 0.58;
    });
    scene.add(grid);

    const robot = createRobot(color);
    scene.add(robot);
    const robotHead = robot.getObjectByName("robot-head") as THREE.Mesh;

    stateRef.current = { camera, controls, robotHead, addedShape: null, scene };

    const resize = new ResizeObserver(() => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      const nextAspect = nextWidth / Math.max(nextHeight, 1);
      camera.left = (-viewSize * nextAspect) / 2;
      camera.right = (viewSize * nextAspect) / 2;
      camera.top = viewSize / 2;
      camera.bottom = -viewSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    });
    resize.observe(container);

    let frame = 0;
    const render = () => {
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((item) => item.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    (state.robotHead.material as THREE.MeshStandardMaterial).color.set(color);

    if (objectCount > 3) {
      if (state.addedShape) {
        state.scene.remove(state.addedShape);
        state.addedShape.geometry.dispose();
        (state.addedShape.material as THREE.Material).dispose();
      }
      const addedShape = mesh(shapeGeometry(selectedShape), color, [2.6, 0.35, 0.4]);
      addedShape.rotation.y = Math.PI / 7;
      addedShape.name = "added-shape";
      state.scene.add(addedShape);
      state.addedShape = addedShape;
    }
  }, [color, objectCount, selectedShape]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.camera.zoom = zoom / 82;
    state.camera.updateProjectionMatrix();
  }, [zoom]);

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.camera.position.set(8, 7, 8);
    state.controls.target.set(0, 1.55, 0);
    state.camera.zoom = 1;
    state.camera.updateProjectionMatrix();
    state.controls.update();
  }, [resetKey]);

  return (
    <div className="three-viewport" ref={containerRef}>
      <div className="viewport-help">Drag to orbit · Scroll to zoom · Right-drag to pan</div>
    </div>
  );
}
