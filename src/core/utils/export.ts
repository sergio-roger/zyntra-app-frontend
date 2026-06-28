export const generateExportFilename = (prefix: string): string => {
  const dateStr = new Date().toISOString().slice(0, 10);
  return `${prefix}_${dateStr}`;
};
