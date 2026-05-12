import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  IndianRupee, 
  FileText, 
  Settings,
  LogOut,
  ShoppingBag,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: Users, label: 'Customers', path: '/dashboard/customers' },
    { icon: ShoppingCart, label: 'Sales Log', path: '/dashboard/sales' },
    { icon: ShoppingBag, label: 'Retail Sale', path: '/dashboard/retail' },
    { icon: IndianRupee, label: 'Advances', path: '/dashboard/advances' },
    { icon: FileText, label: 'Billing', path: '/dashboard/billing' },
    { icon: BarChart3, label: 'Reports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="sidebar flex flex-col h-screen sticky top-0 overflow-hidden bg-navy">
      <div className="sidebar-logo p-8 pb-12">
        <h1 className="text-3xl font-display italic text-white tracking-tight">TraderPro</h1>
      </div>
      
      <nav className="sidebar-nav flex-1 overflow-y-auto px-4">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${isActive ? 'active bg-navy-mid text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            end={item.path === '/dashboard'}
          >
            <item.icon size={20} />
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer p-4 mt-auto border-t border-white/5">
        <button 
          onClick={signOut} 
          className="nav-item w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-white/40 hover:text-red hover:bg-red/10 transition-all cursor-pointer bg-transparent border-none"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold tracking-tight">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
