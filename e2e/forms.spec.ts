import { test, expect } from '@playwright/test';
import { mockUser } from './support/fixtures';

const ALLOWED_MENUS = [
  {
    key: 'automations',
    label: 'Automatizaciones',
    path: '/automations',
    parent_key: null,
    description: null,
    access_level: 'full',
    children: [
      {
        key: 'automations_forms',
        label: 'Formularios',
        path: '/automations/forms',
        parent_key: 'automations',
        description: null,
        access_level: 'full',
        children: [],
      },
    ],
  },
];

const mockTemplate = (overrides: Record<string, unknown> = {}) => ({
  id: 'tpl-1',
  businessId: 'biz-1',
  name: 'Contacto landing',
  slug: 'contacto-landing',
  description: null,
  status: 'draft',
  submitAction: 'create_contact',
  targetEntityType: null,
  successMessage: null,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
  ...overrides,
});

test.describe('Formularios', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript((user) => {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: { user, isAuthenticated: true, isLoading: false, allowedMenus: [] },
          version: 0,
        }),
      );
    }, mockUser);

    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ json: { data: mockUser } }),
    );
    await page.route('**/api/auth/menus', (route) =>
      route.fulfill({ json: { data: ALLOWED_MENUS } }),
    );
    await page.route('**/api/crm/fields**', (route) =>
      route.fulfill({ json: { data: [] } }),
    );
  });

  test('muestra el estado vacío y navega a crear un formulario nuevo', async ({
    page,
  }) => {
    await page.route('**/api/forms/templates', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: { data: [] } });
      }
      return route.continue();
    });

    await page.goto('/automations/forms');
    await expect(
      page.getByRole('heading', { name: 'Formularios', exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Todavía no tenés formularios'),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Crear formulario' }).first().click();
    await expect(page).toHaveURL(/\/automations\/forms\/new$/);
    await expect(
      page.getByRole('heading', { name: 'Nuevo formulario' }),
    ).toBeVisible();
  });

  test('crea una plantilla nueva (el slug se autogenera del nombre) y navega al detalle', async ({
    page,
  }) => {
    let createPayload: Record<string, unknown> | null = null;

    await page.route('**/api/forms/templates', (route) => {
      const req = route.request();
      if (req.method() === 'POST') {
        createPayload = req.postDataJSON();
        return route.fulfill({
          json: { data: mockTemplate({ name: createPayload!.name, slug: createPayload!.slug }) },
        });
      }
      if (req.method() === 'GET') {
        return route.fulfill({ json: { data: [] } });
      }
      return route.continue();
    });

    await page.goto('/automations/forms/new');
    await page.getByLabel('Nombre del formulario').fill('Contacto landing');
    await expect(page.getByLabel('Slug')).toHaveValue('contacto-landing');

    await page.getByRole('button', { name: 'Crear formulario' }).click();

    await expect(page).toHaveURL(/\/automations\/forms\/tpl-1$/);
    expect(createPayload).toMatchObject({
      name: 'Contacto landing',
      slug: 'contacto-landing',
    });
  });

  test('agrega un campo desde el sidebar y lo guarda vía PUT /fields', async ({
    page,
  }) => {
    await page.route('**/api/forms/templates/tpl-1', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          json: { data: { ...mockTemplate(), fields: [] } },
        });
      }
      return route.continue();
    });

    let putPayload: { fields: unknown[] } | null = null;
    await page.route('**/api/forms/templates/tpl-1/fields', (route) => {
      putPayload = route.request().postDataJSON();
      return route.fulfill({ json: { data: putPayload!.fields } });
    });

    await page.goto('/automations/forms/tpl-1');
    await page.getByRole('button', { name: 'Campos' }).click();

    await expect(
      page.getByText('Este formulario todavía no tiene campos.'),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Agregar campo', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Nuevo Campo' }),
    ).toBeVisible();

    await page.getByLabel('Etiqueta visible').fill('Nombre completo');
    await expect(page.getByLabel('Field Key (short-code)')).toHaveValue(
      'nombre_completo',
    );

    await page.getByRole('button', { name: 'Agregar Campo', exact: true }).click();

    // La fila aparece en la lista local (todavía no persistida).
    await expect(page.getByText('Nombre completo')).toBeVisible();
    await expect(page.getByText('Sin mapeo', { exact: true })).toBeVisible();

    const saveButton = page.getByRole('button', { name: 'Guardar cambios' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page.getByText('Campos guardados')).toBeVisible();
    expect(putPayload).not.toBeNull();
    expect(putPayload!.fields).toHaveLength(1);
    expect(putPayload!.fields[0]).toMatchObject({
      fieldKey: 'nombre_completo',
      label: 'Nombre completo',
      type: 'text',
    });
  });

  test('elimina una plantilla desde el listado', async ({ page }) => {
    let deleteCalled = false;

    await page.route('**/api/forms/templates', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: { data: [mockTemplate()] } });
      }
      return route.continue();
    });
    await page.route('**/api/forms/templates/tpl-1', (route) => {
      if (route.request().method() === 'DELETE') {
        deleteCalled = true;
        return route.fulfill({ status: 204, body: '' });
      }
      return route.continue();
    });

    await page.goto('/automations/forms');
    await expect(page.getByText('Contacto landing')).toBeVisible();

    await page.getByRole('button', { name: 'Eliminar Contacto landing' }).click();
    await expect(page.getByText('Eliminar formulario')).toBeVisible();

    await page.getByRole('button', { name: 'Eliminar', exact: true }).click();

    await expect(page.getByText('Formulario eliminado')).toBeVisible();
    expect(deleteCalled).toBe(true);
  });
});
