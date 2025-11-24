/**
 * Mezzanine 3D Viewer Component
 * Interactive 3D visualization using React Three Fiber
 */

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { MezzanineConfig } from '../types';

interface MezzanineViewerProps {
  config: MezzanineConfig;
}

export const MezzanineViewer: React.FC<MezzanineViewerProps> = ({ config }) => {
  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-100 to-gray-200">
      <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />

        {/* Mezzanine Structure */}
        <MezzanineStructure config={config} />

        {/* Grid helper for scale reference */}
        <Grid
          args={[30, 30]}
          cellSize={1}
          cellColor="#999999"
          sectionSize={5}
          sectionColor="#666666"
          fadeDistance={40}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
};

/**
 * Mezzanine Structure Component
 * Renders the platform, columns, and accessories
 */
const MezzanineStructure: React.FC<{ config: MezzanineConfig }> = ({ config }) => {
  // Convert mm to meters
  const lengthM = config.length / 1000;
  const widthM = config.width / 1000;
  const heightM = config.height / 1000;

  // Column positions at corners
  const columnPositions: [number, number, number][] = [
    [-lengthM / 2, heightM / 2, -widthM / 2], // Front-left
    [lengthM / 2, heightM / 2, -widthM / 2],  // Front-right
    [-lengthM / 2, heightM / 2, widthM / 2],  // Back-left
    [lengthM / 2, heightM / 2, widthM / 2],   // Back-right
  ];

  return (
    <group>
      {/* Base platform (ground level - light grey) */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[lengthM, 0.1, widthM]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      {/* Support columns */}
      {columnPositions.map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <cylinderGeometry args={[0.1, 0.1, heightM, 16]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}

      {/* Floor platform (at height - light yellow) */}
      <mesh position={[0, heightM, 0]} receiveShadow castShadow>
        <boxGeometry args={[lengthM, 0.05, widthM]} />
        <meshStandardMaterial color="#ffffcc" />
      </mesh>

      {/* Render accessories */}
      <Accessories config={config} lengthM={lengthM} widthM={widthM} heightM={heightM} />
    </group>
  );
};

/**
 * Accessories Component
 * Renders stairs, railings, and pallet gates
 */
const Accessories: React.FC<{
  config: MezzanineConfig;
  lengthM: number;
  widthM: number;
  heightM: number;
}> = ({ config, lengthM, widthM, heightM }) => {
  // Track positions of stairs and gates on each edge to avoid overlaps
  const occupiedPositions = {
    front: [] as { start: number; end: number }[],
    back: [] as { start: number; end: number }[],
    left: [] as { start: number; end: number }[],
    right: [] as { start: number; end: number }[],
  };

  // Process stairs first
  const stairsElements: JSX.Element[] = [];
  let stairsCount = 0;

  config.accessories
    .filter((a) => a.type === 'stairs')
    .forEach((accessory) => {
      if (accessory.type !== 'stairs') return;

      for (let i = 0; i < accessory.quantity; i++) {
        // Position stairs at front edge, distributed along length
        const stairWidth = 1; // 1m wide
        const spacing = lengthM / (accessory.quantity + 1);
        const xPos = -lengthM / 2 + spacing * (i + 1);
        const zPos = -widthM / 2;

        occupiedPositions.front.push({
          start: xPos - stairWidth / 2,
          end: xPos + stairWidth / 2,
        });

        stairsElements.push(
          <Stairs
            key={`stairs-${stairsCount++}`}
            position={[xPos, 0, zPos]}
            height={heightM}
            stairType={accessory.stairType}
          />
        );
      }
    });

  // Process pallet gates
  const gatesElements: JSX.Element[] = [];
  let gateCount = 0;

  config.accessories
    .filter((a) => a.type === 'pallet_gate')
    .forEach((accessory) => {
      if (accessory.type !== 'pallet_gate') return;

      const gateWidth = parseInt(accessory.width) / 1000; // Convert to meters

      for (let i = 0; i < accessory.quantity; i++) {
        // Position gates at front edge, avoiding stairs
        const spacing = lengthM / (accessory.quantity + 1);
        let xPos = -lengthM / 2 + spacing * (i + 1);

        // Check if position conflicts with stairs, adjust if needed
        const conflicts = occupiedPositions.front.some(
          (occ) => xPos >= occ.start && xPos <= occ.end
        );
        if (conflicts) {
          xPos += gateWidth + 0.5; // Move to the right
        }

        occupiedPositions.front.push({
          start: xPos - gateWidth / 2,
          end: xPos + gateWidth / 2,
        });

        gatesElements.push(
          <PalletGate
            key={`gate-${gateCount++}`}
            position={[xPos, heightM, -widthM / 2]}
            width={gateWidth}
          />
        );
      }
    });

  // Process railings
  const railingElements: JSX.Element[] = [];
  let railingCount = 0;

  config.accessories
    .filter((a) => a.type === 'railing')
    .forEach((accessory) => {
      if (accessory.type !== 'railing') return;

      for (let i = 0; i < accessory.quantity; i++) {
        const railingLength = accessory.lengthMeters;

        // Distribute railings around perimeter, avoiding front edge where stairs/gates are
        // Place on back, left, and right edges
        const edges = ['back', 'left', 'right'] as const;
        const edge = edges[railingCount % edges.length];

        let position: [number, number, number];
        let rotation: number;

        if (edge === 'back') {
          position = [0, heightM, widthM / 2];
          rotation = 0;
        } else if (edge === 'left') {
          position = [-lengthM / 2, heightM, 0];
          rotation = Math.PI / 2;
        } else {
          // right
          position = [lengthM / 2, heightM, 0];
          rotation = Math.PI / 2;
        }

        railingElements.push(
          <Railing
            key={`railing-${railingCount++}`}
            position={position}
            length={railingLength}
            rotation={rotation}
          />
        );
      }
    });

  return (
    <>
      {stairsElements}
      {gatesElements}
      {railingElements}
    </>
  );
};

/**
 * Stairs Component
 * Renders a staircase to access the mezzanine
 */
const Stairs: React.FC<{
  position: [number, number, number];
  height: number;
  stairType: string;
}> = ({ position, height, stairType }) => {
  // Extract depth from stairType (e.g., "Straight 1m" -> 1)
  const depthMatch = stairType.match(/(\d+\.?\d*)/);
  const depth = depthMatch ? parseFloat(depthMatch[0]) : 1;

  const numSteps = 15;
  const stepHeight = height / numSteps;
  const stepDepth = depth / numSteps;
  const stepWidth = 1; // 1m wide

  const steps: JSX.Element[] = [];
  for (let i = 0; i < numSteps; i++) {
    const stepY = stepHeight * (i + 0.5);
    const stepZ = position[2] - stepDepth * (i + 0.5);

    steps.push(
      <mesh key={i} position={[position[0], stepY, stepZ]} castShadow>
        <boxGeometry args={[stepWidth, stepHeight, stepDepth]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    );
  }

  return <group>{steps}</group>;
};

/**
 * Railing Component
 * Renders safety railings around the platform
 */
const Railing: React.FC<{
  position: [number, number, number];
  length: number;
  rotation: number;
}> = ({ position, length, rotation }) => {
  const railingHeight = 1.1; // 1.1m high
  const postRadius = 0.03;
  const railRadius = 0.02;
  const numPosts = Math.ceil(length / 1) + 1; // Post every meter

  const posts: JSX.Element[] = [];
  const rails: JSX.Element[] = [];

  // Create posts
  for (let i = 0; i < numPosts; i++) {
    const offset = (i / (numPosts - 1) - 0.5) * length;
    posts.push(
      <mesh key={`post-${i}`} position={[offset, railingHeight / 2, 0]}>
        <cylinderGeometry args={[postRadius, postRadius, railingHeight, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    );
  }

  // Top rail
  rails.push(
    <mesh key="top-rail" position={[0, railingHeight, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[railRadius, railRadius, length, 8]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );

  // Middle rail
  rails.push(
    <mesh key="mid-rail" position={[0, railingHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[railRadius, railRadius, length, 8]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );

  // Bottom rail
  rails.push(
    <mesh key="bot-rail" position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[railRadius, railRadius, length, 8]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {posts}
      {rails}
    </group>
  );
};

/**
 * Pallet Gate Component
 * Renders a safety gate (same structure as railing but gold color)
 */
const PalletGate: React.FC<{
  position: [number, number, number];
  width: number;
}> = ({ position, width }) => {
  const gateHeight = 1.1; // 1.1m high
  const postRadius = 0.03;
  const railRadius = 0.02;

  return (
    <group position={position}>
      {/* Left post */}
      <mesh position={[-width / 2, gateHeight / 2, 0]}>
        <cylinderGeometry args={[postRadius, postRadius, gateHeight, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Right post */}
      <mesh position={[width / 2, gateHeight / 2, 0]}>
        <cylinderGeometry args={[postRadius, postRadius, gateHeight, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Top rail */}
      <mesh position={[0, gateHeight, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[railRadius, railRadius, width, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Middle rail */}
      <mesh position={[0, gateHeight / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[railRadius, railRadius, width, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Bottom rail */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[railRadius, railRadius, width, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Diagonal cross for gate appearance */}
      <mesh position={[0, gateHeight / 2, 0]} rotation={[0, 0, Math.atan2(gateHeight, width)]}>
        <cylinderGeometry args={[railRadius, railRadius, Math.sqrt(width * width + gateHeight * gateHeight), 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
};

