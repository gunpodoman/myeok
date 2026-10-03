import { Link, Route, Routes } from 'react-router-dom';

const preservedRoutes = [
  '/', '/product', '/create-pack', '/ai-evaluation', '/app', '/app/packs',
  '/app/import', '/app/setup', '/app/device-test', '/app/interview',
  '/app/result/:id', '/app/history', '/app/compare', '/guide', '/privacy', '/terms'
];

function FoundationStatus() {
  return (
    <main style={{ maxWidth: 880, margin: '64px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ color: '#3155e7', fontWeight: 800 }}>PHASE 1 · PARALLEL FOUNDATION</p>
      <h1>React 전환 기반이 준비되었습니다.</h1>
      <p style={{ lineHeight: 1.7 }}>
        현재 검증된 Vanilla SPA는 계속 authoritative entry point로 유지됩니다. 이 화면은 PHASE 2의
        안전한 이전을 위한 React Router Declarative Mode 기반이며, PHASE 1 Pack/Settings 모듈을 공유합니다.
      </p>
      <h2>보존 대상 Route</h2>
      <ul>{preservedRoutes.map(route => <li key={route}><code>{route}</code></li>)}</ul>
      <Link to="/foundation/about">기반 정보</Link>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="*" element={<FoundationStatus />} />
    </Routes>
  );
}
