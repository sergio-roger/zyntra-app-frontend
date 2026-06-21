import {
  LayoutDashboard,
  Users,
UserRound,
  Bot,
  Code,
  MessageSquare,
  Sparkles,
  BarChart3,
  Settings,
  TrendingUp,
  Search,
  Share2,
  Inbox as InboxIcon,
  Filter,
  Zap,
  Layout,
  Target,
  BookOpen,
  Mic,
  Brain,
  PieChart,
  LineChart,
  Tag,
  ClipboardCheck,
  Database,
  ListFilter,
  Briefcase,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export interface SubNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavModule {
  key: string;
  label: string;
  icon: LucideIcon;
  match: string;
  to: string;
  description: string;
  color: string;
  children?: SubNavItem[];
}

export const NAV_MODULES: NavModule[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    match: '/dashboard',
    to: '/dashboard/home',
    description: 'Vista general de tu negocio.',
    color: 'text-primary',
    children: [
      { to: '/dashboard/home', label: 'Inicio', icon: LayoutDashboard, description: 'Vista general e inicio.' },
    ],
  },
  {
    key: 'crm',
    label: 'CRM',
    icon: Users,
    match: '/crm',
    to: '/crm/contacts',
    description: 'Gestiona tu cartera de leads y clientes.',
    color: 'text-primary',
    children: [
      { to: '/crm/contacts', label: 'Contactos', icon: UserRound, description: 'Listado y gestión de contactos.' },
      { to: '/crm/leads', label: 'Inbox Leads', icon: InboxIcon, description: 'Todos los leads entrantes.' },
      { to: '/crm/deals', label: 'Negocios', icon: Briefcase, description: 'Pipeline de ventas y tratos.' },
      { to: '/crm/tags', label: 'Etiquetas', icon: Tag, description: 'Categoriza tus contactos.' },
      { to: '/crm/tasks', label: 'Tareas', icon: ClipboardCheck, description: 'Seguimiento de actividades.' },
      { to: '/crm/fields', label: 'Campos', icon: Database, description: 'Personaliza tus datos.' },
      { to: '/crm/segments', label: 'Segmentos', icon: ListFilter, description: 'Listas inteligentes de leads.' },
    ],
  },
  {
    key: 'agents',
    label: 'Agentes IA',
    icon: Sparkles,
    match: '/agents',
    to: '/agents/strategy',
    description: 'Lanza equipos de IA para crear contenido y análisis.',
    color: 'text-secondary',
    children: [
      { to: '/agents/strategy', label: 'Estrategia', icon: TrendingUp, description: 'Optimización de marca.' },
      { to: '/agents/content', label: 'Contenido', icon: MessageSquare, description: 'Creación de textos y contenidos.' },
      { to: '/agents/analysis', label: 'Análisis', icon: Search, description: 'Insights de negocio.' },
    ],
  },
  {
    key: 'inbox',
    label: 'Inbox',
    icon: InboxIcon,
    match: '/inbox',
    to: '/inbox',
    description: 'Gestiona todas tus conversaciones en un solo lugar.',
    color: 'text-accent',
    children: [
      { to: '/inbox', label: 'Conversaciones', icon: MessageSquare, description: 'Chats en tiempo real.' },
      { to: '/inbox/automations', label: 'Respuestas rápidas', icon: Zap, description: 'Automatiza tus respuestas.' },
      { to: '/inbox/channels', label: 'Canales', icon: Share2, description: 'WhatsApp, Messenger, Web.' },
    ],
  },
  {
    key: 'funnels',
    label: 'Embudos',
    icon: Filter,
    match: '/funnels',
    to: '/funnels/dashboard',
    description: 'Convierte visitas en clientes con flujos optimizados.',
    color: 'text-primary',
    children: [
      { to: '/funnels/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Vista general del funnel.' },
      { to: '/funnels/builder', label: 'Constructor', icon: Layout, description: 'Diseña tus flujos de venta.' },
      { to: '/funnels/templates', label: 'Plantillas', icon: Code, description: 'Modelos listos para usar.' },
      { to: '/funnels/automations', label: 'Automatizaciones', icon: Zap, description: 'Reglas y disparadores.' },
      { to: '/funnels/leads', label: 'Leads', icon: Target, description: 'Prospectos generados.' },
      { to: '/funnels/analytics', label: 'Analítica', icon: BarChart3, description: 'Rendimiento de conversión.' },
    ],
  },
  {
    key: 'avatar',
    label: 'Avatar',
    icon: Bot,
    match: '/avatar',
    to: '/avatar/identity',
    description: 'Define la personalidad y conocimiento de tu IA.',
    color: 'text-secondary',
    children: [
      { to: '/avatar/identity', label: 'Identidad', icon: UserRound, description: 'Personalidad y tono de voz.' },
      { to: '/avatar/knowledge', label: 'Conocimiento', icon: BookOpen, description: 'Entrenamiento y documentos.' },
      { to: '/avatar/voice', label: 'Voz', icon: Mic, description: 'Configuración de audio e IA.' },
      { to: '/avatar/memory', label: 'Memoria', icon: Brain, description: 'Contexto y aprendizaje.' },
    ],
  },
  {
    key: 'analytics',
    label: 'Analítica',
    icon: BarChart3,
    match: '/analytics',
    to: '/analytics/general',
    description: 'Métricas y reportes profundos de tu negocio.',
    color: 'text-info',
    children: [
      { to: '/analytics/general', label: 'General', icon: PieChart, description: 'Vista global del negocio.' },
      { to: '/analytics/conversations', label: 'Conversaciones', icon: MessageSquare, description: 'Rendimiento del chat.' },
      { to: '/analytics/leads', label: 'Leads', icon: Target, description: 'Tasa de conversión.' },
      { to: '/analytics/performance', label: 'Rendimiento', icon: LineChart, description: 'Eficiencia de agentes.' },
    ],
  },
  {
    key: 'settings',
    label: 'Ajustes',
    icon: Settings,
    match: '/settings',
    to: '/settings/users',
    description: 'Configura tu cuenta y preferencias.',
    color: 'text-primary',
    children: [
      { to: '/settings/permissions', label: 'Permisos', icon: ShieldCheck, description: 'Configura qué puede ver cada rol.' },
      { to: '/settings/users', label: 'Usuarios', icon: UserRound, description: 'Gestiona tu equipo y roles.' },
      { to: '/settings/teams', label: 'Equipo', icon: Users, description: 'Organiza usuarios en grupos.' },
      { to: '/settings/lifecycle', label: 'Ciclo de vida', icon: Sparkles, description: 'Etapas de tus contactos.' },
      { to: '/settings/channels', label: 'Canales', icon: Share2, description: 'Conecta tus redes sociales.' },
    ],
  },
];

export const findActiveModule = (pathname: string): NavModule | undefined => {
  return NAV_MODULES.find((module) => pathname.startsWith(module.match));
};

export const getMenuKeyFromPath = (path: string): string => {
  const p = path.replace(/\/$/, '');
  
  if (p === '/dashboard') return 'dashboard';
  if (p === '/dashboard/home') return 'dashboard_home';
  if (p === '/crm') return 'crm';
  if (p === '/crm/contacts') return 'crm_contacts';
  if (p === '/crm/leads') return 'crm_leads';
  if (p === '/crm/deals') return 'crm_deals';
  if (p === '/crm/tags') return 'crm_tags';
  if (p === '/crm/tasks') return 'crm_tasks';
  if (p === '/crm/fields') return 'crm_fields';
  if (p === '/crm/segments') return 'crm_segments';
  
  if (p === '/agents' || p === '/agents/strategy') return 'agents_strategy';
  if (p === '/agents/content') return 'agents_content';
  if (p === '/agents/analysis') return 'agents_analysis';
  
  if (p === '/inbox' || p === '/inbox/conversations') return 'inbox_conversations';
  if (p === '/inbox/automations') return 'inbox_automations';
  if (p === '/inbox/channels') return 'inbox_channels';
  
  if (p === '/funnels') return 'funnels';
  if (p === '/funnels/dashboard') return 'funnels_dashboard';
  if (p === '/funnels/builder') return 'funnels_builder';
  if (p === '/funnels/templates') return 'funnels_templates';
  if (p === '/funnels/automations') return 'funnels_automations';
  if (p === '/funnels/leads') return 'funnels_leads';
  if (p === '/funnels/analytics') return 'funnels_analytics';
  
  if (p === '/avatar') return 'avatar';
  if (p === '/avatar/identity') return 'avatar_identity';
  if (p === '/avatar/knowledge') return 'avatar_knowledge';
  if (p === '/avatar/voice') return 'avatar_voice';
  if (p === '/avatar/memory') return 'avatar_memory';
  
  if (p === '/analytics') return 'analytics';
  if (p === '/analytics/general') return 'analytics_general';
  if (p === '/analytics/conversations') return 'analytics_convs';
  if (p === '/analytics/leads') return 'analytics_leads';
  if (p === '/analytics/performance') return 'analytics_perf';
  
  if (p === '/billing') return 'billing';
  
  if (p === '/settings') return 'settings';
  if (p === '/settings/users') return 'settings_users';
  if (p === '/settings/teams') return 'settings_teams';
  if (p === '/settings/lifecycle') return 'settings_lifecycle';
  if (p === '/settings/channels') return 'settings_channels';
  if (p === '/settings/permissions') return 'settings_permissions';

  return '';
};
