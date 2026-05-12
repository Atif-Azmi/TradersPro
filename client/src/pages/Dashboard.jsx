import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppShell from '../components/Layout/AppShell';

// Sub-pages (to be implemented)
import Products from './Products';
import DashboardHome from './DashboardHome';
import Customers from './Customers';
import Sales from './Sales';
import Retail from './Retail';
import Advances from './Advances';
import Billing from './Billing';
import Settings from './Settings';
import Subscription from './Subscription';

const Dashboard = () => {
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/products')) return 'Inventory Management';
    if (path.includes('/customers')) return 'Customer Directory';
    if (path.includes('/sales')) return 'Daily Sales Entries';
    if (path.includes('/retail')) return 'Retail Counter';
    if (path.includes('/advances')) return 'Advances & Dues';
    if (path.includes('/billing')) return 'Professional Billing';
    if (path.includes('/settings')) return 'Business Settings';
    return 'Business Overview';
  };

  return (
    <AppShell title={getTitle()}>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/retail" element={<Retail />} />
        <Route path="/advances" element={<Advances />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/subscription" element={<Subscription />} />
        {/* Other routes will be added here */}
      </Routes>
    </AppShell>
  );
};

export default Dashboard;
