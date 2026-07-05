const DOMAIN_REGEX =
  /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63}(?<!-))+(:\d{1,5})?$/;

const LOCALHOST_REGEX = /^localhost(:\d{1,5})?$/;

export const isValidDomain = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return LOCALHOST_REGEX.test(trimmed) || DOMAIN_REGEX.test(trimmed);
};
