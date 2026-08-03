// 3D 캐릭터 컴포넌트 — 캡슐 + 상태 색상 + idle 애니메이션
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
import type { CharacterStatus } from '../types';
import { STATUS_COLOR, CHARACTER_HEIGHT, CHARACTER_RADIUS } from '../types';

interface CharacterProps {
  status: CharacterStatus;
  position: [number, number, number];
  label: string; // 캐릭터 이름 (1단계는 "Worker 1" 등 placeholder)
}

/**
 * 단일 캐릭터 — CapsuleGeometry + 머티리얼 + 상태별 색상
 * idle 상태일 때 위아래로 살짝 흔들리는 애니메이션 (3D 룸이 살아있는 느낌)
 */
export function Character({ status, position, label }: CharacterProps) {
  const meshRef = useRef<Mesh>(null);

  // idle 상태만 부드러운 호흡 애니메이션
  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (status === 'idle') {
      const t = clock.getElapsedTime();
      mesh.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.08;
    } else {
      mesh.position.y = position[1];
    }
  });

  return (
    <group position={position}>
      {/* 캡슐 본체 */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[CHARACTER_RADIUS, CHARACTER_HEIGHT * 0.6, 4, 12]} />
        <meshStandardMaterial color={STATUS_COLOR[status]} />
      </mesh>

      {/* 머리 — 작은 구체 */}
      <mesh position={[0, CHARACTER_HEIGHT * 0.55, 0]} castShadow>
        <sphereGeometry args={[CHARACTER_RADIUS * 0.55, 16, 16]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>

      {/* 상태 라벨 — Html 오버레이 */}
      <Html
        position={[0, CHARACTER_HEIGHT * 1.1, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            fontSize: 10,
            color: '#1f2937',
            background: 'rgba(255,255,255,0.7)',
            padding: '1px 4px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}
