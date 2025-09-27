import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <div className="h-screen flex">
        <div className="w-1/6 md:w[8%] lg:w-[16%] xl:w-[14%]">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block">School Lama</span>
          </Link>
          <Menu />
        </div>
        <div className="w-5/6 md:w[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
          <Navbar />
          {children}
        </div>
      </div>
    </html>
  );
}
