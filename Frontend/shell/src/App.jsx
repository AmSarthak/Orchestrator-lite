import React, { Suspense } from "react";

const BuilderApp = React.lazy(() => import("builder/BuilderApp"));
const MonitorApp = React.lazy(() => import("monitor/MonitorApp"));

function App() {
  return (
    <div style={{ padding: 40 }}>
      <Suspense fallback={<div>Loading Builder...</div>}>
        <BuilderApp />
      </Suspense>
      <Suspense fallback={<div>Loading Monitor...</div>}>
        <MonitorApp />
      </Suspense>
    </div>
  );
}

export default App;