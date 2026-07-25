import { SubNavItem, NavModule } from '@shared/types/nav';
import { NAV_MODULES } from '@shared/constants/navigation';
export { SubNavItem, NavModule };
export { NAV_MODULES };

export const findActiveModule = (pathname: string): NavModule | undefined => {
  return NAV_MODULES.find((module) => pathname.startsWith(module.match));
};

const PATH_TO_KEY_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/dashboard/home': 'dashboard_home',
  '/crm': 'crm',
  '/crm/contacts': 'crm_contacts',
  '/crm/leads': 'crm_leads',
  '/crm/companies': 'crm_companies',
  '/crm/deals': 'crm_deals',
  '/crm/tags': 'crm_tags',
  '/crm/tasks': 'crm_tasks',
  '/crm/fields': 'crm_fields',
  '/crm/segments': 'crm_segments',
  '/agents/chat': 'agents_chat',
  '/agents/store': 'agents_store',
  '/agents/projects': 'agents_projects',
  '/agents/team': 'agents_team',
  '/inbox': 'inbox_conversations',
  '/inbox/conversations': 'inbox_conversations',
  '/inbox/automations': 'inbox_automations',
  '/drive': 'drive',
  '/drive/me': 'drive_me',
  '/drive/company': 'drive_company',
  '/drive/recent': 'drive_recent',
  '/drive/trash': 'drive_trash',
  '/analytics': 'analytics',
  '/analytics/general': 'analytics_general',
  '/analytics/conversations': 'analytics_convs',
  '/analytics/leads': 'analytics_leads',
  '/analytics/performance': 'analytics_perf',
  '/automations': 'automations',
  '/automations/workflows': 'automations_workflows',
  '/automations/agents': 'automations_agents',
  '/automations/forms': 'automations_forms',
  '/billing': 'billing',
  '/settings/plans': 'billing',
  '/settings': 'settings',
  '/settings/ajustes-generales': 'settings_general',
  '/settings/equipo-accesos': 'settings_team_access',
  '/settings/configuracion-negocio': 'settings_business',
  '/settings/configuracion': 'settings_config',
  '/settings/my-account': 'settings_my_account',
  '/settings/my-company': 'settings_my_company',
  '/settings/users': 'settings_users',
  '/settings/teams': 'settings_teams',
  '/settings/roles': 'settings_roles',
  '/settings/lifecycle': 'settings_lifecycle',
  '/settings/permissions': 'settings_roles',
  '/inbox/channels': 'inbox_channels',
  '/inbox/my-channels': 'inbox_my_channels',
  '/redes-sociales': 'redes_sociales',
  '/redes-sociales/youtube': 'redes_sociales_youtube',
};

export const getMenuKeyFromPath = (path: string): string => {
  const p = path.replace(/\/$/, '');
  return PATH_TO_KEY_MAP[p] || '';
};
