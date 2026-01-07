'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Layers, Video, Star, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Loader } from '@/components/ui/loader';

const navItems = [
    { href: '/admin/categories', label: 'Categories', icon: Layers },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/content', label: 'Content (Hero/Video)', icon: Video },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold">Prerna Admin</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                        setIsLoggingOut(true);
                        signOut({ callbackUrl: '/admin/login' });
                    }}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? <Loader size={16} /> : <LogOut className="w-5 h-5" />}
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 bg-white border-r fixed h-full">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b p-4 flex items-center justify-between">
                <h1 className="text-lg font-bold">Prerna Admin</h1>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8">
                {children}
            </main>
        </div>
    );
}
