import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  LayoutGrid,
  BarChart2,
  TrendingUp,
  Calendar,
  Settings,
  FileText,
  Bot,
  Shield,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  Users,
  MessageSquareText,
  MessageCircleMore,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', icon: LayoutGrid, active: true },
  { name: 'Keyword Tracker', icon: BarChart2 },
  { name: 'Sentiment Trends', icon: TrendingUp },
  { name: 'Data Collection Schedule', icon: Calendar },
  { name: 'API Settings', icon: Shield },
  { name: 'Analytic', icon: FileText },
  { name: 'Settings', icon: Settings },
];

const Menu = () => {
  return (
    <div className="flex flex-col w-60 z-20 transform transition-transform duration-300 ease-in-out h-full">
      <div className="px-4 py-3 flex items-center">
        <img
          src="https://placehold.co/40x40/9333EA/FFFFFF?text=M"
          alt="User Logo"
          className="rounded-lg"
        />
        <div className="ml-3">
          <h1 className="font-bold text-sm">My Workspace</h1>
          <p className="text-xs text-gray-500">MU sentiment Dashboard</p>
        </div>
      </div>
      <div className="px-4 pb-4 flex-1 overflow-y-auto">
        <h2 className="text-xs text-gray-500 font-semibold uppercase mb-2">
          MAIN MENU
        </h2>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <a
                  href="#"
                  className={`flex items-center p-2 rounded-lg text-sm font-medium ${
                    item.active
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <Bot className="mx-auto w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-bold text-sm">Need help?</h3>
          <p className="text-xs text-gray-500 mb-3">
            Please check our assistant
          </p>
          <Link href="https://newmy.muic.io/chatmessage">
            <button className="bg-purple-600 text-white text-sm w-full py-2 rounded-lg">
              AI Copter
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
