import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell = ({ children, title }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Topbar title={title} />
        <div style={{ marginTop: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
