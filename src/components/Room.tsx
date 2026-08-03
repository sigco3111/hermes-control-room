// 방(Room) 컴포넌트 — 박스 + 색깔 + 라벨 + 캐릭터 2명 + 클릭 핸들러
import { Text } from '@react-three/drei';
import type { Room, CharacterStatus } from '../types';
import { ROOM_SIZE, GRID_SPACING } from '../types';
import { Character } from './Character';

interface RoomProps {
  room: Room;
  statuses: [CharacterStatus, CharacterStatus];
  onSelect: (room: Room) => void;
}

/**
 * 단일 방 — 클릭 가능 영역 (박스 + 라벨 + 캐릭터)
 * 클릭 시 사이드 패널에 상세 표시
 */
export function RoomBox({ room, statuses, onSelect }: RoomProps) {
  // 4×2 그리드 좌표 계산 (월드 좌표)
  // col 0..3 → x: -9, -3, 3, 9  (간격 GRID_SPACING=6)
  // row 0..1 → z: -3, 3
  const x = (room.col - 1.5) * GRID_SPACING;
  const z = (room.row - 0.5) * GRID_SPACING;
  const [w, h, d] = ROOM_SIZE;

  // 캐릭터 두 명 위치 (박스 안쪽, 앞쪽)
  const char1Pos: [number, number, number] = [x - 0.8, h / 2, z + 0.5];
  const char2Pos: [number, number, number] = [x + 0.8, h / 2, z + 0.5];

  return (
    <group position={[x, 0, z]} onClick={(e) => {
      e.stopPropagation();
      onSelect(room);
    }}>
      {/* 바닥 (BoxGeometry 기반 — 격자 위에 살짝 띄움) */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={room.color} />
      </mesh>

      {/* 박스 외벽 — 4면 + 지붕 */}
      {/* 앞벽 */}
      <mesh castShadow position={[0, h / 2, d / 2]}>
        <boxGeometry args={[w, h, 0.15]} />
        <meshStandardMaterial color={room.color} />
      </mesh>
      {/* 뒷벽 */}
      <mesh castShadow position={[0, h / 2, -d / 2]}>
        <boxGeometry args={[w, h, 0.15]} />
        <meshStandardMaterial color={room.color} />
      </mesh>
      {/* 좌측벽 */}
      <mesh castShadow position={[-w / 2, h / 2, 0]}>
        <boxGeometry args={[0.15, h, d]} />
        <meshStandardMaterial color={room.color} />
      </mesh>
      {/* 우측벽 */}
      <mesh castShadow position={[w / 2, h / 2, 0]}>
        <boxGeometry args={[0.15, h, d]} />
        <meshStandardMaterial color={room.color} />
      </mesh>
      {/* 지붕 */}
      <mesh castShadow position={[0, h, 0]}>
        <boxGeometry args={[w, 0.15, d]} />
        <meshStandardMaterial color={darken(room.color, 0.15)} />
      </mesh>

      {/* 라벨 (Text — drei) — 지붕 위 */}
      <Text
        position={[0, h + 0.6, 0]}
        fontSize={0.5}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#ffffff"
      >
        {`${room.emoji} ${room.name}`}
      </Text>

      {/* 캐릭터 2명 */}
      <Character status={statuses[0]} position={char1Pos} label="Worker A" />
      <Character status={statuses[1]} position={char2Pos} label="Worker B" />
    </group>
  );
}

/**
 * hex 색상을 살짝 어둡게 — 지붕/그림자 음영용
 */
function darken(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = Math.max(0, parseInt(h.slice(0, 2), 16) - Math.round(255 * amount));
  const g = Math.max(0, parseInt(h.slice(2, 4), 16) - Math.round(255 * amount));
  const b = Math.max(0, parseInt(h.slice(4, 6), 16) - Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
