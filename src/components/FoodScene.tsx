import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({ color, position, speed, size }: { color: string; position: [number, number, number]; speed: number; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  // Create a target color for subtle shifts
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const targetColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.offsetHSL(0, 0.1, 0.1); // Shift lightness and saturation slightly
    return c;
  }, [color]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Complex rotation
    meshRef.current.rotation.x = Math.cos(t / 4) * 0.5;
    meshRef.current.rotation.y = Math.sin(t / 4) * 0.5;
    meshRef.current.rotation.z += 0.01;
    
    // Floating movement
    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.8;
    meshRef.current.position.x = position[0] + Math.cos(t * speed * 0.5) * 0.3;
    
    // Dynamic distortion
    materialRef.current.distort = THREE.MathUtils.lerp(0.3, 0.6, (Math.sin(t * speed) + 1) / 2);
    
    // Subtle color shifting
    const colorMix = (Math.sin(t * 0.5) + 1) / 2;
    materialRef.current.color.lerpColors(baseColor, targetColor, colorMix);
  });

  return (
    <Float speed={speed * 4} rotationIntensity={1.5} floatIntensity={2.5}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          ref={materialRef}
          color={color}
          speed={speed * 3}
          distort={0.4}
          radius={1}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function MovingLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.getElapsedTime();
    lightRef.current.position.x = Math.sin(t) * 10;
    lightRef.current.position.y = Math.cos(t * 0.5) * 10;
    lightRef.current.position.z = Math.sin(t * 0.3) * 5;
  });

  return <pointLight ref={lightRef} intensity={2} color="#F4C430" />;
}

export default function FoodScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-70">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        <MovingLight />
        
        {/* Background depth */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Abstract 3D shapes representing "flavors" */}
        <FloatingShape color="#006847" position={[-5, 3, 0]} speed={0.4} size={1.4} />
        <FloatingShape color="#F4C430" position={[5, -3, 2]} speed={0.6} size={1.0} />
        <FloatingShape color="#006847" position={[3, 4, -3]} speed={0.3} size={0.7} />
        <FloatingShape color="#F4C430" position={[-4, -4, 1]} speed={0.5} size={0.8} />
        <FloatingShape color="#006847" position={[0, 0, -5]} speed={0.2} size={2.0} />
      </Canvas>
    </div>
  );
}
