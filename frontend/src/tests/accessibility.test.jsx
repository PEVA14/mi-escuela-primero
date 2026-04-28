import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import NavBar from '../components/NavBar';

vi.mock('../services/api', () => ({ login: vi.fn() }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

// ─── Component Accessibility ──────────────────────────────────────────────

describe('Accessibility - LoginForm', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <MemoryRouter><LoginForm /></MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('email input has an associated label', () => {
    const { container } = render(
      <MemoryRouter><LoginForm /></MemoryRouter>
    );
    const input = container.querySelector('#correo');
    const label = container.querySelector('label[for="correo"]');
    expect(input).not.toBeNull();
    expect(label).not.toBeNull();
  });

  it('password input has an associated label', () => {
    const { container } = render(
      <MemoryRouter><LoginForm /></MemoryRouter>
    );
    const label = container.querySelector('label[for="contraseña"]');
    expect(label).not.toBeNull();
    expect(label.textContent.trim()).toBeTruthy();
  });

  it('submit button has an accessible name', () => {
    const { container } = render(
      <MemoryRouter><LoginForm /></MemoryRouter>
    );
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      const hasText = btn.textContent?.trim().length > 0;
      const hasAriaLabel = btn.hasAttribute('aria-label');
      expect(hasText || hasAriaLabel).toBe(true);
    });
  });
});

describe('Accessibility - NavBar', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <MemoryRouter><NavBar /></MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('all buttons have accessible text', () => {
    const { container } = render(
      <MemoryRouter><NavBar /></MemoryRouter>
    );
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      const text = btn.textContent?.trim();
      const ariaLabel = btn.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    });
  });
});
