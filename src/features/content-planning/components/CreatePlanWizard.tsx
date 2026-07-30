import React, { useState } from 'react';
import { useCreateContentPlan } from '@features/content-planning/hooks/use-create-content-plan';
import { ContentPlan } from '@features/content-planning/interfaces/content-plan.interface';

interface CreatePlanWizardProps {
  onCreated: (plan: ContentPlan) => void;
}

export const CreatePlanWizard: React.FC<CreatePlanWizardProps> = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [brief, setBrief] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const createPlan = useCreateContentPlan();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const plan = await createPlan.mutateAsync({
      name,
      periodType: 'custom',
      startDate,
      endDate,
      brief,
      platformConfigs: [],
    });
    onCreated(plan);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="form-control">
        <span className="label-text">Nombre del plan</span>
        <input
          aria-label="Nombre del plan"
          className="input input-bordered"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="form-control">
        <span className="label-text">Brief</span>
        <textarea
          aria-label="Brief"
          className="textarea textarea-bordered"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
      </label>

      <label className="form-control">
        <span className="label-text">Desde</span>
        <input
          aria-label="Desde"
          type="date"
          className="input input-bordered"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      <label className="form-control">
        <span className="label-text">Hasta</span>
        <input
          aria-label="Hasta"
          type="date"
          className="input input-bordered"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>

      <button type="submit" className="btn btn-primary">
        Crear plan
      </button>
    </form>
  );
};

export default CreatePlanWizard;
