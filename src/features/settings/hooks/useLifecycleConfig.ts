import api from "@shared/api/axios";
import React, { useEffect, useState } from "react";

export interface LifecycleStage {
  id?: string;
  name: string;
  description: string;
  icon: string;
  type: "active" | "lost";
  is_default: boolean;
  is_won: boolean;
  is_system: boolean;
  position: number;
}

export function useLifecycleConfig() {
  const [stages, setStages] = useState<LifecycleStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [addingTo, setAddingTo] = useState<"active" | "lost" | null>(null);
  const [newStageName, setNewStageName] = useState("");
  const [newStageDesc, setNewStageDesc] = useState("");

  const fetchStages = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/lifecycle/stages");
      setStages(response.data);
    } catch (error) {
      console.error("Error fetching stages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStages();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStages]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post("/lifecycle/stages", stages);
      await fetchStages();
    } catch (error) {
      console.error("Error saving stages:", error);
    } finally {
      setSaving(false);
    }
  };

  const confirmAddStage = () => {
    if (!newStageName.trim()) return;

    const newStage: LifecycleStage = {
      name: newStageName,
      description: newStageDesc,
      icon: addingTo === "active" ? "⚡" : "👋",
      type: addingTo!,
      is_default: false,
      is_won: false,
      is_system: false,
      position: stages.length,
    };

    setStages([...stages, newStage]);
    cancelAdd();
  };

  const cancelAdd = () => {
    setAddingTo(null);
    setNewStageName("");
    setNewStageDesc("");
  };

  const handleDeleteStage = (stageToDelete: LifecycleStage) => {
    if (stageToDelete.is_system) return;
    setStages(stages.filter((s) => s !== stageToDelete));
  };

  const updateStageProperty = <K extends keyof LifecycleStage>(
    stage: LifecycleStage,
    property: K,
    value: LifecycleStage[K],
  ) => {
    setStages((prevStages) =>
      prevStages.map((s) => (s === stage ? { ...s, [property]: value } : s)),
    );
  };

  const setDefaultStage = (stage: LifecycleStage) => {
    const newStages = stages.map((s) => ({
      ...s,
      is_default: s === stage,
    }));
    setStages(newStages);
  };

  const activeStages = stages.filter((s) => s.type === "active");
  const lostStages = stages.filter((s) => s.type === "lost");

  return {
    stages,
    setStages,
    loading,
    saving,
    addingTo,
    setAddingTo,
    newStageName,
    setNewStageName,
    newStageDesc,
    setNewStageDesc,
    activeStages,
    lostStages,
    fetchStages,
    handleSave,
    confirmAddStage,
    cancelAdd,
    handleDeleteStage,
    updateStageProperty,
    setDefaultStage,
  };
}
