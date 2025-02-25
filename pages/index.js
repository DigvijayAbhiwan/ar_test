import { Canvas, useFrame } from "@react-three/fiber";
import { XR, ARButton, Hands, Interactive, useXREvent } from "@react-three/xr";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [color, setColor] = useState("white");
  const [modelPosition, setModelPosition] = useState([0, 1, -1]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative">
      <ARButton />

      {/* Camera Frame UI */}
      <div className="absolute w-64 h-64 border-4 border-blue-500 rounded-lg top-20">
        <p className="text-white text-center mt-2">Place Model Here</p>
      </div>

      <Canvas className="w-full h-full">
        <XR>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Hands />
          <PointerIndicator position={modelPosition} />
          <Interactive onSelect={() => console.log("Model Touched")}>
            <Model
              color={color}
              setModelPosition={setModelPosition}
              modelPosition={modelPosition}
            />
          </Interactive>
          <OrbitControls />
        </XR>
      </Canvas>

      {/* Buttons & UI */}
      <div className="absolute bottom-5 flex gap-4 bg-white p-4 rounded-lg">
        <button
          onClick={() => setColor("red")}
          className="p-2 bg-red-500 rounded"
        >
          Red
        </button>
        <button
          onClick={() => setColor("blue")}
          className="p-2 bg-blue-500 rounded"
        >
          Blue
        </button>
        <button
          onClick={() => setColor("green")}
          className="p-2 bg-green-500 rounded"
        >
          Green
        </button>
      </div>
    </div>
  );
}

// Model Component with Dynamic Placement
function Model({ color, setModelPosition, modelPosition }) {
  const { scene } = useGLTF("/dog.glb");
  const modelRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(color);
      }
    });
  }, [color, scene]);

  useXREvent("selectstart", (event) => {
    if (event.inputSource.hand) {
      const pos = event.inputSource.hand.joints["index-finger-tip"].position;
      setModelPosition([pos.x, pos.y, pos.z]);
    }
  });

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.position.set(...modelPosition); // FIXED: Now using the correct state
    }
  });

  return (
    <group ref={modelRef} position={modelPosition} scale={[0.5, 0.5, 0.5]}>
      <primitive object={scene} />
    </group>
  );
}

// Pointer Indicator to Guide Users
function PointerIndicator({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}
