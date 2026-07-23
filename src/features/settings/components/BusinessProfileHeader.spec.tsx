import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BusinessProfileHeader } from '@features/settings/components/BusinessProfileHeader';

const business = {
  id: 'business-1',
  name: 'Acme',
  email: 'contact@acme.com',
  phone: '+593 99 999 9999',
  address: 'Av. Siempre Viva 123',
  taxId: '1791234567001',
  website: 'https://acme.com',
  logoUrl: 'https://cdn.test/logo.png',
  coverUrl: 'https://cdn.test/cover.png',
  planStatus: 'trial' as const,
  createdAt: '2026-01-15T00:00:00.000Z',
};

const uploadLogoMutate = vi.fn();
const removeLogoMutate = vi.fn();
const uploadCoverMutate = vi.fn();
const removeCoverMutate = vi.fn();

vi.mock('@features/settings/hooks/useBusiness', () => ({
  useUploadBusinessLogo: vi.fn(() => ({
    mutate: uploadLogoMutate,
    isPending: false,
  })),
  useRemoveBusinessLogo: vi.fn(() => ({
    mutate: removeLogoMutate,
    isPending: false,
  })),
  useUploadBusinessCover: vi.fn(() => ({
    mutate: uploadCoverMutate,
    isPending: false,
  })),
  useRemoveBusinessCover: vi.fn(() => ({
    mutate: removeCoverMutate,
    isPending: false,
  })),
}));

const validFile = new File(['fake'], 'image.png', { type: 'image/png' });

describe('BusinessProfileHeader', () => {
  beforeEach(() => {
    uploadLogoMutate.mockReset();
    removeLogoMutate.mockReset();
    uploadCoverMutate.mockReset();
    removeCoverMutate.mockReset();
  });

  it('muestra el nombre y correo de la business', () => {
    render(
      <BusinessProfileHeader business={business} isAdmin onEdit={vi.fn()} />,
    );

    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('contact@acme.com')).toBeInTheDocument();
  });

  it('llama a onEdit al hacer click en "Editar empresa"', () => {
    const onEdit = vi.fn();
    render(
      <BusinessProfileHeader business={business} isAdmin onEdit={onEdit} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /editar empresa/i }));

    expect(onEdit).toHaveBeenCalled();
  });

  it('sube un nuevo logo al seleccionar un archivo válido', () => {
    render(
      <BusinessProfileHeader business={business} isAdmin onEdit={vi.fn()} />,
    );

    fireEvent.change(screen.getByLabelText('Subir logo'), {
      target: { files: [validFile] },
    });

    expect(uploadLogoMutate).toHaveBeenCalledWith(validFile);
  });

  it('sube una nueva portada al seleccionar un archivo válido', () => {
    render(
      <BusinessProfileHeader business={business} isAdmin onEdit={vi.fn()} />,
    );

    fireEvent.change(screen.getByLabelText('Subir portada'), {
      target: { files: [validFile] },
    });

    expect(uploadCoverMutate).toHaveBeenCalledWith(validFile);
  });

  it('rechaza un archivo con formato no permitido', () => {
    render(
      <BusinessProfileHeader business={business} isAdmin onEdit={vi.fn()} />,
    );
    const invalidFile = new File(['fake'], 'doc.pdf', {
      type: 'application/pdf',
    });

    fireEvent.change(screen.getByLabelText('Subir logo'), {
      target: { files: [invalidFile] },
    });

    expect(uploadLogoMutate).not.toHaveBeenCalled();
  });

  it('quita el logo al hacer click en "Quitar logo"', () => {
    render(
      <BusinessProfileHeader business={business} isAdmin onEdit={vi.fn()} />,
    );

    fireEvent.click(screen.getByLabelText('Quitar logo'));

    expect(removeLogoMutate).toHaveBeenCalled();
  });

  it('quita la portada al hacer click en "Quitar portada"', () => {
    render(
      <BusinessProfileHeader business={business} isAdmin onEdit={vi.fn()} />,
    );

    fireEvent.click(screen.getByLabelText('Quitar portada'));

    expect(removeCoverMutate).toHaveBeenCalled();
  });

  describe('usuario no admin (modo lectura)', () => {
    it('no muestra el botón "Editar empresa"', () => {
      render(
        <BusinessProfileHeader
          business={business}
          isAdmin={false}
          onEdit={vi.fn()}
        />,
      );

      expect(
        screen.queryByRole('button', { name: /editar empresa/i }),
      ).not.toBeInTheDocument();
    });

    it('no muestra los controles de logo ni de portada', () => {
      render(
        <BusinessProfileHeader
          business={business}
          isAdmin={false}
          onEdit={vi.fn()}
        />,
      );

      expect(screen.queryByLabelText('Subir logo')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Subir portada')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Quitar logo')).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('Quitar portada'),
      ).not.toBeInTheDocument();
    });

    it('igual muestra el nombre y correo de la business', () => {
      render(
        <BusinessProfileHeader
          business={business}
          isAdmin={false}
          onEdit={vi.fn()}
        />,
      );

      expect(screen.getByText('Acme')).toBeInTheDocument();
      expect(screen.getByText('contact@acme.com')).toBeInTheDocument();
    });
  });
});
