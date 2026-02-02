
'use client';

import { useEffect } from 'react';
import { usePathname, redirect } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarInset, SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { Leaf, Home, Tractor, Droplets, Wheat, BookOpen, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Header } from './header';
import Preloader from './preloader';

const adminNavItems = [
    { href: '/admin/dashboard', icon: <Tractor />, label: 'Dashboard' },
    { href: '/admin/crops', icon: <Wheat />, label: 'Crops' },
    { href: '/admin/weather', icon: <Droplets />, label: 'Weather Alerts' },
    { href: '/admin/tips', icon: <BookOpen />, label: 'Farming Tips' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');
    const { user, isUserLoading } = useUser();
    const auth = useAuth();

    useEffect(() => {
        if (!isUserLoading && !user && isAdminRoute) {
            redirect('/login');
        }
    }, [user, isUserLoading, isAdminRoute]);

    if (!isAdminRoute) {
        return (
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />
                <main className="flex-1">{children}</main>
            </div>
        )
    }
    
    // From here, we are on an admin route.
    
    if (isUserLoading || !user) {
        // Show preloader while checking auth or if user is null (before redirect kicks in)
        return <Preloader />;
    }

    const handleLogout = () => {
        auth.signOut();
    };
    
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 p-2">
                         <Leaf className="h-6 w-6 text-primary" />
                         <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {adminNavItems.map(item => (
                            <SidebarMenuItem key={item.href}>
                                <Link href={item.href} passHref>
                                    <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarSeparator />
                <SidebarFooter>
                     <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/" passHref>
                                <SidebarMenuButton>
                                    <Home />
                                    <span>Back to App</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleLogout}>
                                <LogOut />
                                <span>Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
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
