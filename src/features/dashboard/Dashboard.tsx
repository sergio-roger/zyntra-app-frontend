import { Link } from 'react-router-dom';
import { NAV_MODULES } from '@shared/layouts/nav.config';
import { PageHeader } from '@shared/components/PageHeader';

const cards = NAV_MODULES.filter((m) => m.key !== 'dashboard');

export const Dashboard = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <PageHeader title="Dashboard" subtitle="Bienvenido a Zyntra" />

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.to}
          to={card.to}
          className="card bg-base-200/60 transition-all hover:-translate-y-0.5 hover:bg-base-200"
        >
          <div className="card-body">
            <card.icon size={22} className={card.color} />
            <h3 className="card-title text-base">{card.label}</h3>
            <p className="text-sm text-base-content/60">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default Dashboard;
