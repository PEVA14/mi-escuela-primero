import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { getInvalidFieldNames, validateFormBeforeSubmit } from '../utils/formValidation';
import * as api from '../services/api';

// ─── Mock API and router ───────────────────────────────────────────────────

vi.mock('../services/api', () => ({ login: vi.fn() }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Helpers ──────────────────────────────────────────────────────────────

function makeInput({ name, value, required = false, type = 'text' }) {
  const el = document.createElement('input');
  el.name = name;
  el.value = value;
  el.type = type;
  if (required) el.required = true;
  return el;
}

function renderLogin() {
  return render(<MemoryRouter><LoginForm /></MemoryRouter>);
}

// ─── Form Validation (unit) ───────────────────────────────────────────────

describe('getInvalidFieldNames', () => {
  it('returns empty array when all required fields are filled', () => {
    const form = { elements: [makeInput({ name: 'nombre', value: 'Test', required: true })] };
    expect(getInvalidFieldNames(form)).toEqual([]);
  });

  it('returns field name when a required field is empty', () => {
    const form = { elements: [makeInput({ name: 'nombre', value: '', required: true })] };
    expect(getInvalidFieldNames(form)).toContain('nombre');
  });

  it('returns field name when a required field contains only whitespace', () => {
    const form = { elements: [makeInput({ name: 'nombre', value: '   ', required: true })] };
    expect(getInvalidFieldNames(form)).toContain('nombre');
  });

  it('does not flag optional empty fields', () => {
    const form = { elements: [makeInput({ name: 'mensaje', value: '' })] };
    expect(getInvalidFieldNames(form)).not.toContain('mensaje');
  });

  it('flags a required unchecked checkbox as invalid via checkValidity()', () => {
    const el = document.createElement('input');
    el.type = 'checkbox';
    el.name = 'acepto';
    el.required = true;
    // not checked → checkValidity() returns false
    const form = { elements: [el] };
    expect(getInvalidFieldNames(form)).toContain('acepto');
  });

  it('does not flag a checked required checkbox as invalid', () => {
    const el = document.createElement('input');
    el.type = 'checkbox';
    el.name = 'acepto';
    el.required = true;
    el.checked = true;
    const form = { elements: [el] };
    expect(getInvalidFieldNames(form)).not.toContain('acepto');
  });

  it('handles multiple fields correctly', () => {
    const form = {
      elements: [
        makeInput({ name: 'nombre', value: '', required: true }),
        makeInput({ name: 'municipio', value: 'Guadalajara', required: true }),
        makeInput({ name: 'cct', value: '', required: true }),
      ],
    };
    const invalid = getInvalidFieldNames(form);
    expect(invalid).toContain('nombre');
    expect(invalid).not.toContain('municipio');
    expect(invalid).toContain('cct');
  });
});

describe('validateFormBeforeSubmit', () => {
  it('returns false and calls setInvalidFields when form is invalid', () => {
    const setInvalidFields = vi.fn();
    const form = { elements: [makeInput({ name: 'nombre', value: '', required: true })] };
    const event = { currentTarget: form, preventDefault: vi.fn() };

    const result = validateFormBeforeSubmit(event, null, setInvalidFields);

    expect(result).toBe(false);
    expect(setInvalidFields).toHaveBeenCalledWith(['nombre']);
  });

  it('returns true and clears invalid fields when form is valid', () => {
    const setInvalidFields = vi.fn();
    const form = { elements: [makeInput({ name: 'nombre', value: 'Test', required: true })] };
    const event = { currentTarget: form, preventDefault: vi.fn() };

    const result = validateFormBeforeSubmit(event, null, setInvalidFields);

    expect(result).toBe(true);
    expect(setInvalidFields).toHaveBeenCalledWith([]);
  });
});

// ─── LoginForm (component) ────────────────────────────────────────────────

describe('LoginForm - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows validation error when fields are empty on submit', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(screen.getAllByText('Por favor llena este espacio').length).toBeGreaterThan(0);
  });

  it('shows API error message when credentials are wrong', async () => {
    api.login.mockRejectedValue({
      response: { data: { mensaje: 'Credenciales incorrectas' } },
    });

    renderLogin();
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });
  });

  it('shows fallback message when API returns no error detail', async () => {
    api.login.mockRejectedValue(new Error('Network error'));

    renderLogin();
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });
  });

  it('stores token and navigates to /admin on successful login', async () => {
    api.login.mockResolvedValue({ data: { token: 'test-token-abc' } });

    renderLogin();
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'admin@test.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'correct123');
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('test-token-abc');
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('clears field error when user starts typing again', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(screen.getAllByText('Por favor llena este espacio').length).toBeGreaterThan(0);

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'a');
    expect(screen.queryAllByText('Por favor llena este espacio').length).toBeLessThan(2);
  });
});
