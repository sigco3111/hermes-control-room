// 에르메스 관제실 — 메인 App 컴포넌트
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { HUD } from './components/HUD';
import './App.css';

export default function App() {
  return (
    <div className="app-root">
      {/* 3D 캔버스 — 전체 화면 배경 */}
      <Canvas
        shadows
        camera={{ position: [15, 12, 15], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 30, 60]} />
        <Scene />
      </Canvas>

      {/* HUD 오버레이 */}
      <HUD />
    </div>
  );
}
