import { Link } from 'react-router-dom';
import { NAV_MODULES } from '@shared/layouts/nav.config';

const cards = NAV_MODULES.filter(m => m.key !== 'dashboard');

export const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <p className="mt-1 text-base-content/60">Bienvenido a Zyntra</p>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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