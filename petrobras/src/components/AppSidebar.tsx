import { LayoutDashboard, Package, TrendingUp, FileText, ClipboardList, LogOut, PackagePlus } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Estoque', url: '/estoque', icon: Package },
  { title: 'Movimentação', url: '/movimentacao', icon: TrendingUp },
  { title: 'Cadastro de Peças', url: '/cadastro-pecas', icon: PackagePlus },
  { title: 'Solicitação de Peças', url: '/solicitacao-pecas', icon: ClipboardList },
  { title: 'Acompanhar Solicitações', url: '/acompanhar-solicitacoes', icon: ClipboardList },
  { title: 'Relatórios', url: '/relatorios', icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout, user } = useAuth();

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="space-y-1">
             <img 
  src="pngwing.com.png" 
  alt="Logo do Sistema"
  className="h-30 w-30"
/>
              <h1 className="text-xs text-sidebar-foreground/70">Sistema de Estoque</h1>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!isCollapsed && user && (
          <div className="mb-3 space-y-1">
            <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
            <p className="text-xs text-sidebar-foreground/70">Matrícula: {user.matricula}</p>
          </div>
        )}
        <SidebarMenuButton onClick={logout} className="w-full hover:bg-sidebar-accent">
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Sair</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
