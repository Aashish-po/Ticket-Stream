import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * Layout Component
 * Design: Gradient Elegance - Main layout wrapper with sidebar and top navigation
 * Structure: Sidebar (left) + TopBar (top) + Content area
 */
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 mt-16 p-6 md:ml-0 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
