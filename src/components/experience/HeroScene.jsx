import { useRef, useEffect } from "react";
// React Three Fiber built-ins: Canvas creates WebGL; useFrame runs the animation loop.
import { Canvas, useFrame } from "@react-three/fiber";
// Three.js built-in interpolation utility. No external 3D models or textures are loaded.
import { MathUtils } from "three";

function Portal({ progress, pointerX, pointerY, onReady }) {
  const world = useRef();
  const rings = useRef();
  const core = useRef();
  const cubes = useRef();
  const firstFrame = useRef(true);
  const elapsed = useRef(0);
  useEffect(
    () => () => {
      firstFrame.current = true;
    },
    [],
  );

  useFrame((state, delta) => {
    if (!world.current) return;
    const step = Math.min(delta, 0.04);
    elapsed.current += step;
    const time = elapsed.current;
    const scroll = progress.get();
    world.current.rotation.y = MathUtils.damp(
      world.current.rotation.y,
      pointerX.get() * 0.25 + scroll * 1.15,
      4,
      step,
    );
    world.current.rotation.x = MathUtils.damp(
      world.current.rotation.x,
      -0.18 + pointerY.get() * 0.15 + scroll * 0.3,
      4,
      step,
    );
    world.current.position.y = Math.sin(time * 0.65) * 0.08;
    rings.current.rotation.z = time * 0.09 + scroll * 0.8;
    core.current.rotation.y = time * 0.3;
    core.current.rotation.x = time * 0.18;
    cubes.current.rotation.z = -time * 0.07;
    state.camera.position.z = MathUtils.damp(
      state.camera.position.z,
      7.1 - scroll * 0.6,
      3,
      step,
    );
    if (firstFrame.current) {
      firstFrame.current = false;
      onReady();
    }
  });

  return (
    <group ref={world}>
      <group ref={rings}>
        <mesh rotation={[0.45, 0.35, -0.5]}>
          <torusGeometry args={[1.76, 0.21, 18, 100]} />
          <meshStandardMaterial
            color="#4268ff"
            metalness={0.55}
            roughness={0.2}
          />
        </mesh>
        <mesh rotation={[1.15, -0.4, 0.55]}>
          <torusGeometry args={[1.76, 0.11, 16, 100]} />
          <meshStandardMaterial
            color="#d7e2ff"
            metalness={0.7}
            roughness={0.21}
          />
        </mesh>
        <mesh rotation={[-0.45, 1.05, 0.2]}>
          <torusGeometry args={[2.14, 0.024, 8, 100]} />
          <meshStandardMaterial
            color="#bfdcff"
            emissive="#5481ff"
            emissiveIntensity={0.35}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshStandardMaterial
          color="#c7fa76"
          metalness={0.25}
          roughness={0.3}
          flatShading
        />
      </mesh>
      <group ref={cubes}>
        <mesh position={[-1.85, 1.3, 0.3]} rotation={[0.4, 0.4, 0.4]}>
          <boxGeometry args={[0.31, 0.31, 0.31]} />
          <meshStandardMaterial
            color="#ff784e"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[1.9, -1.45, 0]} rotation={[0.2, 0.8, 0.2]}>
          <octahedronGeometry args={[0.24]} />
          <meshStandardMaterial
            color="#c7fa76"
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[1.4, 1.8, -0.7]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
export default function HeroScene({
  active,
  onReady,
  progress,
  pointerX,
  pointerY,
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7.1], fov: 43 }}
      dpr={[1, 1.35]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 4, 5]} intensity={4} />
      <pointLight position={[-4, -2, 2]} color="#527dff" intensity={18} />
      <Portal
        progress={progress}
        pointerX={pointerX}
        pointerY={pointerY}
        onReady={onReady}
      />
    </Canvas>
  );
}
