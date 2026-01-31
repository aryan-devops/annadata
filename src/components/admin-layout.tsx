
'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarInset } from '@/components/ui/sidebar';
import { Sprout, Shield, Tractor, Thermometer, Droplets, Wheat, Settings, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Header } from './header';

const adminNavItems = [
    { href: '/admin/dashboard', icon: <Tractor />, label: 'Dashboard' },
    { href: '/admin/crops', icon: <Wheat />, label: 'Crops' },
    { href: '/admin/seasons', icon: <Thermometer />, label: 'Seasons' },
    { href: '/admin/weather', icon: <Droplets />, label: 'Weather Alerts' },
    { href: '/admin/tips', icon: <BookOpen />, label: 'Farming Tips' },
    { href: '/admin/schemes', icon: <Shield />, label: 'Govt. Schemes' },
    { href: '/admin/settings', icon: <Settings />, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    if (!isAdminRoute) {
        return (
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />
                <main className="flex-1">{children}</main>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                         <Sprout className="h-6 w-6 text-primary" />
                         <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {adminNavItems.map(item => (
                            <SidebarMenuItem key={item.href}>
                                <Link href={item.href} passHref>
                                    <SidebarMenuButton isActive={pathname === item.href}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <SidebarTrigger className="md:hidden"/>
                    <div className="flex-1">
                        {/* You can add breadcrumbs or page titles here */}
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
