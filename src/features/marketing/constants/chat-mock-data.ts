import {
  ChatAgentRosterItem,
  ChatMessage,
  FileMockItem,
  ProcessTimelineEvent,
  TaskMockItem,
  ToolMockItem,
} from '@features/marketing/types/chat-mock';

export const CHAT_AGENT_ROSTER: ChatAgentRosterItem[] = [
  { slug: 'marketing-strategist', displayName: 'Z-Strategist', role: 'Estrategia de Marketing', status: 'active', color: '#7c3aed' },
  { slug: 'content-creator', displayName: 'Z-Content', role: 'Creador de Contenido', status: 'active', color: '#ec4899' },
  { slug: 'seo-specialist', displayName: 'Z-SEO', role: 'Especialista SEO', status: 'active', color: '#0ea5e9' },
  { slug: 'data-analyst', displayName: 'Z-Analyst', role: 'Analista de Datos', status: 'active', color: '#10b981' },
  { slug: 'automation-agent', displayName: 'Z-Automate', role: 'Automatización', status: 'working', color: '#f59e0b' },
  { slug: 'crm-agent', displayName: 'Z-Support', role: 'Agente de Atención', status: 'active', color: '#8b5cf6' },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    authorDisplayName: 'Tú',
    isFromUser: true,
    time: '10:30 AM',
    text: 'Quiero lanzar una campaña para mi nuevo producto de software de gestión de proyectos. Objetivo: conseguir 500 leads cualificados en 60 días con un presupuesto de $2,000.',
  },
  {
    id: 'msg-2',
    authorDisplayName: 'Z-Strategist',
    isFromUser: false,
    time: '10:31 AM',
    text: 'Entendido. Para alcanzar 500 leads cualificados en 60 días con $2,000, diseñaré una estrategia integral con enfoque en adquisición, conversión y nutrición. Voy a coordinar al equipo.',
    actionPlan: {
      steps: [
        { order: 1, label: 'Investigación', ownerDisplayName: 'Z-Strategist', isCurrent: false },
        { order: 2, label: 'Contenido & Creativos', ownerDisplayName: 'Z-Content', isCurrent: false },
        { order: 3, label: 'SEO & Landing Page', ownerDisplayName: 'Z-SEO', isCurrent: false },
        { order: 4, label: 'Campañas Paid', ownerDisplayName: 'Z-Automate', isCurrent: true },
        { order: 5, label: 'Email & Automatización', ownerDisplayName: 'Z-Automate', isCurrent: false },
        { order: 6, label: 'Análisis & Optimización', ownerDisplayName: 'Z-Analyst', isCurrent: false },
      ],
    },
  },
  {
    id: 'msg-3',
    authorDisplayName: 'Z-Content',
    isFromUser: false,
    time: '10:32 AM',
    text: 'Voy a crear el calendario de contenido y los assets iniciales para la campaña.',
    deliverables: [
      { label: 'Blog post: "Cómo elegir el mejor software de gestión"', status: 'in_progress' },
      { label: '3 Variaciones de anuncios para Facebook/Instagram', status: 'in_progress' },
      { label: 'Guía descargable: "Checklist para optimizar tu gestión de proyectos"', status: 'in_progress' },
    ],
  },
  {
    id: 'msg-4',
    authorDisplayName: 'Z-Analyst',
    isFromUser: false,
    time: '10:33 AM',
    text: 'He conectado los dashboards y definí las métricas clave que vamos a seguir.',
    metrics: [
      { label: 'Leads generados', value: '0', target: '500' },
      { label: 'CPL estimado', value: '$0.00', target: '$4.00' },
      { label: 'Presupuesto usado', value: '$0', target: '$2,000' },
      { label: 'Tasa de conversión', value: '0.00%', target: null },
    ],
  },
];

export const PROCESS_TIMELINE: ProcessTimelineEvent[] = [
  {
    id: 'evt-1',
    time: '10:30 AM',
    actorDisplayName: 'Tú',
    actorRole: null,
    description: 'Objetivo recibido — Lanzar campaña para nuevo producto de software. Meta: 500 leads cualificados en 60 días. Presupuesto: $2,000.',
    status: 'completed',
  },
  {
    id: 'evt-2',
    time: '10:31 AM',
    actorDisplayName: 'Z-Strategist',
    actorRole: 'Estrategia de Marketing',
    description: 'generó el plan de acción',
    status: 'completed',
  },
  {
    id: 'evt-3',
    time: '10:31 AM',
    actorDisplayName: 'Orquestador',
    actorRole: null,
    description: 'delegó tareas al equipo',
    status: 'completed',
  },
  {
    id: 'evt-4',
    time: '10:32 AM',
    actorDisplayName: 'Z-Content',
    actorRole: 'Creador de Contenido',
    description: 'creó contenido inicial',
    status: 'in_progress',
    tools: ['generate_blog_post', 'generate_ad_creatives', 'create_guide_outline'],
  },
  {
    id: 'evt-5',
    time: '10:33 AM',
    actorDisplayName: 'Z-SEO',
    actorRole: 'Especialista SEO',
    description: 'optimizó la landing page',
    status: 'completed',
    tools: ['keyword_research', 'on_page_optimization', 'internal_linking_suggestions'],
  },
  {
    id: 'evt-6',
    time: '10:34 AM',
    actorDisplayName: 'Z-Automate',
    actorRole: 'Automatización',
    description: 'configuró campañas y automatizaciones',
    status: 'in_progress',
    tools: ['create_facebook_campaign', 'create_google_campaign', 'create_email_sequence'],
  },
  {
    id: 'evt-7',
    time: '10:34 AM',
    actorDisplayName: 'Z-Analyst',
    actorRole: 'Analista de Datos',
    description: 'configuró dashboards y métricas',
    status: 'completed',
    tools: ['create_dashboard', 'connect_data_source', 'define_kpis'],
  },
  {
    id: 'evt-8',
    time: '10:35 AM',
    actorDisplayName: 'Z-Support',
    actorRole: 'Agente de Atención',
    description: 'preparó respuestas y base de conocimiento',
    status: 'pending',
    tools: ['search_knowledge_base', 'create_faq_entry', 'setup_livechat_flows'],
  },
];

export const TOOLS_TAB_MOCK: ToolMockItem[] = [
  { name: 'generate_blog_post', ownerDisplayName: 'Z-Content', usageCount: 4 },
  { name: 'keyword_research', ownerDisplayName: 'Z-SEO', usageCount: 7 },
  { name: 'create_facebook_campaign', ownerDisplayName: 'Z-Automate', usageCount: 2 },
  { name: 'create_dashboard', ownerDisplayName: 'Z-Analyst', usageCount: 1 },
  { name: 'search_knowledge_base', ownerDisplayName: 'Z-Support', usageCount: 3 },
];

export const TASKS_TAB_MOCK: TaskMockItem[] = [
  { label: 'Definir estrategia de lanzamiento', ownerDisplayName: 'Z-Strategist', status: 'completed' },
  { label: 'Redactar blog post principal', ownerDisplayName: 'Z-Content', status: 'in_progress' },
  { label: 'Optimizar landing page', ownerDisplayName: 'Z-SEO', status: 'completed' },
  { label: 'Configurar campañas de Ads', ownerDisplayName: 'Z-Automate', status: 'in_progress' },
  { label: 'Armar base de conocimiento de soporte', ownerDisplayName: 'Z-Support', status: 'pending' },
];

export const FILES_TAB_MOCK: FileMockItem[] = [
  { name: 'plan_lanzamiento_v1.md', ownerDisplayName: 'Z-Strategist', sizeLabel: '18 KB' },
  { name: 'guia-checklist-gestion-proyectos.pdf', ownerDisplayName: 'Z-Content', sizeLabel: '640 KB' },
  { name: 'dashboard-campana.json', ownerDisplayName: 'Z-Analyst', sizeLabel: '4 KB' },
];
