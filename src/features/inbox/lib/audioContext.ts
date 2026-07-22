let audioCtx: AudioContext | null = null;

export const getAudioContext = (): AudioContext | null => {
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  return audioCtx;
};

const unlockOnUserGesture = () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') void ctx.resume();
  document.removeEventListener('pointerdown', unlockOnUserGesture);
  document.removeEventListener('keydown', unlockOnUserGesture);
};

document.addEventListener('pointerdown', unlockOnUserGesture);
document.addEventListener('keydown', unlockOnUserGesture);
