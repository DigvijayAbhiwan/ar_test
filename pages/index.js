import { Canvas } from "@react-three/fiber";
import { XR, ARButton } from "@react-three/xr";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useState } from "react";

export default function Home() {
  const [color, setColor] = useState("white");

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      {/* AR Button to start AR Mode */}
      <ARButton />

      {/* 3D Canvas for AR Experience */}
      <Canvas className="w-full h-full">
        <XR>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Model color={color} />
          <OrbitControls />
        </XR>
      </Canvas>

      {/* UI for Customization */}
      <div className="absolute bottom-5 flex gap-4 bg-white p-4 rounded-lg">
        <button onClick={() => setColor("red")} className="p-2 bg-red-500">
          Red
        </button>
        <button onClick={() => setColor("blue")} className="p-2 bg-blue-500">
          Blue
        </button>
        <button onClick={() => setColor("green")} className="p-2 bg-green-500">
          Green
        </button>
      </div>
    </div>
  );
}

function Model({ color }) {
  const { scene } = useGLTF("/dog.glb", true);
  if (!scene) {
    console.error("Model failed to load.");
    return null;
  }
  scene.traverse((child) => {
    if (child.isMesh) child.material.color.set(color);
  });
  return <primitive object={scene} />;
}
