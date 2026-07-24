import { Loader2, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface GoalFormProps {
  onSubmit: (goal: string) => void;
  isPending: boolean;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, isPending }) => {
  const [goal, setGoal] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(goal);
      }}
      className="space-y-4"
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text">¿Qué objetivo querés lograr?</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Ej: Lanzar una campaña de captación de leads B2B"
          required
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div className="modal-action">
        <button type="submit" disabled={isPending} className="btn btn-primary gap-2">
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Generar estrategia
        </button>
      </div>
    </form>
  );
};
