let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
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

/** Beep corto de dos tonos para notificar un mensaje nuevo en el inbox. */
export function playNewMessageSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const now = ctx.currentTime;
  [880, 1175].forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, now);

    const start = now + i * 0.12;
    const end = start + 0.14;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
    gain.gain.linearRampToValueAtTime(0, end);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(end);
  });
}
