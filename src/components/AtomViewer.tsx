import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { Atom } from '@/types';

const Colors = {
  red: 0xf25346,
  pink: 0xf5986e,
};

function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  const nucleons = [...Array(protons + neutrons)].map((_, i) => (
    <Sphere key={i} args={[0.08, 32, 32]} position={[
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2
    ]}>
      <meshPhongMaterial color={Colors.red} transparent opacity={0.8} />
    </Sphere>
  ));

  return <group ref={ref}>{nucleons}</group>;
}

function Electron({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = position[0] * Math.cos(state.clock.elapsedTime) - position[2] * Math.sin(state.clock.elapsedTime);
      ref.current.position.z = position[0] * Math.sin(state.clock.elapsedTime) + position[2] * Math.cos(state.clock.elapsedTime);
    }
  });

  return (
    <Sphere ref={ref} args={[0.05, 32, 32]} position={position}>
      <meshPhongMaterial color={Colors.pink} transparent opacity={0.8} />
    </Sphere>
  );
}

function calculateElectronPositions(atom: Atom, baseRadius: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  let electronCount = 0;
  
  atom.electronConfiguration.forEach((shellCount, shellIndex) => {
    const shellRadius = baseRadius * (shellIndex + 1) / atom.electronConfiguration.length;
    for (let i = 0; i < shellCount; i++) {
      const phi = Math.acos(-1 + (2 * (i + 1)) / (shellCount + 1));
      const theta = Math.sqrt(shellCount * Math.PI) * phi;
      positions.push([
        shellRadius * Math.cos(theta) * Math.sin(phi),
        shellRadius * Math.sin(theta) * Math.sin(phi),
        shellRadius * Math.cos(phi)
      ]);
    }
    electronCount += shellCount;
  });

  return positions;
}

function AtomStructure({ atom }: { atom: Atom }) {
  const { size } = useThree();
  const baseRadius = Math.min(size.width, size.height) / 16;

  const electronPositions = calculateElectronPositions(atom, baseRadius);

  return (
    <>
      <Nucleus protons={atom.protons} neutrons={atom.neutrons} />
      {electronPositions.map((position, i) => (
        <Electron key={i} position={position} />
      ))}
    </>
  );
}

export default function AtomViewer({ atom }: { atom: Atom }) {
  const [dimensions, setDimensions] = useState({ width: '100%', height: '100vh' });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
      });
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div style={{ height: dimensions.height }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <AtomStructure atom={atom} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}