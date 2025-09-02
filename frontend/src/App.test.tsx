import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  const element = screen.getByText('Microservice App');
  expect(element).toBeInTheDocument();
});
