import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

test('Button rend son label', () => {
  render(<Button>Envoyer</Button>);
  expect(screen.getByRole('button', { name: 'Envoyer' })).toBeInTheDocument();
});

test('Typography h1 utilise la balise h1', () => {
  render(<Typography as="h1">Titre</Typography>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titre');
});
