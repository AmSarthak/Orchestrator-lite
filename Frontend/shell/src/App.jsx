import React, { Suspense } from "react";

const BuilderApp = React.lazy(() => import("builder/BuilderApp"));
const MonitorApp = React.lazy(() => import("monitor/MonitorApp"));

function App() {
  return (
    <div style={{ padding: 40 }}>
      <div className="workflow-shell">
         <main className="workflow-grid">
              {/* Left Column: Builder */}
              <section className="workflow-mfe">
                <Suspense>
                  <BuilderApp />
                </Suspense>
              </section>
      
              {/* Right Column: Monitor */}
              <section className="monitor-mfe">
                <div className="scroll-area">
                  <Suspense>
                    <MonitorApp />
                  </Suspense>
                </div>
              </section>
            </main>
          </div>
    </div>
  );
}

export default App;