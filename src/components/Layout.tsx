import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  LayoutDashboard, 
  ClipboardCheck, 
  User,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Coach', icon: MessageSquare, href: '/coach' },
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Tests', icon: ClipboardCheck, href: '/tests' },
  { name: 'Profile', icon: User, href: '/profile' },
];

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-accent"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r lg:translate-x-0"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <h1 className="text-xl font-bold">AI Coach</h1>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                ))}
              </nav>
              <div className="p-4 border-t">
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5 mr-3" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 mr-3" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`lg:pl-64 ${isSidebarOpen ? 'pl-0' : ''}`}>
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
} 