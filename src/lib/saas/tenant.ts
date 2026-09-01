export type OrganizationRole = 'owner' | 'admin' | 'member';

export interface OrganizationContext {
  organizationId: string;
  userId: string;
  role: OrganizationRole;
}

export interface PricingConfig {
  currency: string;
  paintBaseSqm: number | null;
  paintCoatMultiplier: number | null;
  cleaningBaseSqm: number | null;
  windowUnitRate: number | null;
  version: number;
  payload: Record<string, unknown>;
}

export function assertTenantScope(ctx: OrganizationContext | null | undefined): asserts ctx is OrganizationContext {
  if (!ctx?.organizationId || !ctx.userId) throw new Error('Tenant context is required.');
}

export function tenantStoragePath(ctx: OrganizationContext, projectId: string, fileName: string): string {
  assertTenantScope(ctx);
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${ctx.organizationId}/${ctx.userId}/${projectId}/${safe}`;
}

export function canManageOrganization(role: OrganizationRole): boolean {
  return role === 'owner' || role === 'admin';
}
