const COMPANY_MUTATION_ROLES = ['admin', 'manager', 'superAdmin'];

export function canMutateCompanyScope(role: string | null | undefined): boolean {
  return !!role && COMPANY_MUTATION_ROLES.includes(role);
}
