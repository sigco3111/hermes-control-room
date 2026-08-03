// 3D 씬 — 그리드 바닥 + 8개 방 + OrbitControls + 조명
import { OrbitControls } from '@react-three/drei';
import { useControlRoom, CHARACTER_STATUS, ROOMS } from '../store';
import { RoomBox } from './Room';
import type { Room } from '../types';

/**
 * Canvas 내부에 들어가는 실제 3D 씬
 * - 그리드 바닥 (30×30 PlaneGeometry, 회색)
 * - 8개 방 (4×2 그리드, 간격 6단위)
 * - OrbitControls (enableDamping, maxPolarAngle 제한)
 */
export function Scene() {
  const setSelectedRoom = useControlRoom((s) => s.setSelectedRoom);

  // 빈 공간 클릭 시 선택 해제
  const handleMissed = () => setSelectedRoom(null);

  return (
    <>
      {/* 환경광 + 방향광 */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={['#bcd4ff', '#3a2e1f', 0.3]} />

      {/* 그리드 바닥 (30×30) */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handleMissed}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* 그리드 라인 (가이드) — 얇은 격자 */}
      <gridHelper args={[30, 30, '#6b7280', '#4b5563']} position={[0, 0.005, 0]} />

      {/* 8개 방 */}
      {ROOMS.map((room: Room) => {
        const statuses = CHARACTER_STATUS[room.id] ?? ['idle', 'idle'];
        return (
          <RoomBox
            key={room.id}
            room={room}
            statuses={statuses as ['idle' | 'waiting' | 'inactive' | 'error', 'idle' | 'waiting' | 'inactive' | 'error']}
            onSelect={setSelectedRoom}
          />
        );
      })}

      {/* 카메라 컨트롤 — 회전/줌/팬 */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2 - 0.1} // 지면 아래로 회전 방지
        target={[0, 0, 0]}
      />
    </>
  );
}
