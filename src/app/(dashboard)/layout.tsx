'use client';
import { useState } from 'react';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <html lang="en">
      <div className="h-screen flex">
        <div
          className={`
            bg-white border-r border-gray-200 flex flex-col h-full z-20
            transform transition-transform duration-300 ease-in-out
            fixed w-60 lg:relative lg:translate-x-0
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex justify-center border-b border-gray-200 h-14">
            <Link href="/">
              <Image src="/muiclogo.png" alt="logo" width={180} height={120} />
            </Link>
          </div>
          <Menu />
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="border-b border-gray-200 h-14">
            <Navbar onMenuToggle={toggleMenu} />
          </div>
          <div className="p-6 bg-[#F7F8FA]">{children}</div>
        </div>
      </div>
    </html>
  );
}
