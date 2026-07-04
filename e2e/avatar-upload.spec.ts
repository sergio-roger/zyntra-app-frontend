import { test, expect } from '@playwright/test';
import { makeTestPng, mockUser } from './support/fixtures';

test.describe('Avatar upload modal', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript((user) => {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user,
            isAuthenticated: true,
            isLoading: false,
            allowedMenus: [],
          },
          version: 0,
        }),
      );
    }, mockUser);

    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ json: { data: mockUser } }),
    );
    await page.route('**/api/auth/menus', (route) =>
      route.fulfill({ json: { data: [] } }),
    );

    await page.goto('/settings/my-account');
    await expect(
      page.getByRole('button', { name: 'Cambiar foto' }),
    ).toBeVisible();
  });

  test('shows the initials fallback and dropzone when there is no avatar', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Cambiar foto' }).click();

    const modal = page.getByTestId('avatar-upload-modal');
    await expect(
      modal.getByText('Cambiar foto de perfil', { exact: true }),
    ).toBeVisible();
    await expect(modal.getByText('AP', { exact: true })).toBeVisible();
    await expect(
      modal.getByText('Haz clic para seleccionar una imagen'),
    ).toBeVisible();
  });

  test('rejects a disallowed file type without calling the upload API', async ({
    page,
  }) => {
    let uploadCalled = false;
    await page.route('**/api/auth/me/avatar', (route) => {
      uploadCalled = true;
      return route.fulfill({ json: { data: { avatarUrl: '' } } });
    });

    await page.getByRole('button', { name: 'Cambiar foto' }).click();
    await page
      .locator('input[type="file"][aria-label="Subir avatar"]')
      .setInputFiles({
        name: 'not-an-image.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('not an image'),
      });

    await expect(page.getByText('Formato no permitido')).toBeVisible();
    expect(uploadCalled).toBe(false);
  });

  test('crops and uploads a valid image end-to-end', async ({ page }) => {
    let uploadCalls = 0;
    await page.route('**/api/auth/me/avatar', (route) => {
      uploadCalls += 1;
      return route.fulfill({
        json: { data: { avatarUrl: 'https://cdn.example.com/avatar.jpg' } },
      });
    });

    await page.getByRole('button', { name: 'Cambiar foto' }).click();
    await page
      .locator('input[type="file"][aria-label="Subir avatar"]')
      .setInputFiles({
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: makeTestPng(),
      });

    const zoomSlider = page.getByRole('slider', { name: 'Zoom' });
    await expect(zoomSlider).toBeVisible();
    await zoomSlider.fill('2');

    const saveButton = page.getByRole('button', { name: 'Guardar foto' });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await expect(page.getByText('Avatar actualizado')).toBeVisible();
    await expect(
      page.getByText('Cambiar foto de perfil', { exact: true }),
    ).not.toBeVisible();
    expect(uploadCalls).toBe(1);
  });
});
