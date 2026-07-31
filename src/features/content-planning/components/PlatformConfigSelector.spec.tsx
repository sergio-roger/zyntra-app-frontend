import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PlatformConfigSelector } from '@features/content-planning/components/PlatformConfigSelector';
import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';

describe('PlatformConfigSelector', () => {
  it('adds a platform with a default postsPerWeek when checked', () => {
    const onChange = vi.fn();
    render(<PlatformConfigSelector configs={[]} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('instagram'));

    expect(onChange).toHaveBeenCalledWith([
      { platform: ContentPlanPlatform.INSTAGRAM, postsPerWeek: 1 },
    ]);
  });

  it('removes a platform when unchecked', () => {
    const onChange = vi.fn();
    render(
      <PlatformConfigSelector
        configs={[{ platform: ContentPlanPlatform.FACEBOOK, postsPerWeek: 2 }]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('facebook'));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('updates postsPerWeek for a checked platform', () => {
    const onChange = vi.fn();
    render(
      <PlatformConfigSelector
        configs={[{ platform: ContentPlanPlatform.MANUAL, postsPerWeek: 1 }]}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByLabelText('posts por semana · manual'), { target: { value: '3' } });

    expect(onChange).toHaveBeenCalledWith([
      { platform: ContentPlanPlatform.MANUAL, postsPerWeek: 3 },
    ]);
  });
});
