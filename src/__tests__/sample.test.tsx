import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

describe('Basic Test', () => {
  it('passes a simple test', () => {
    expect(true).toBe(true);
  });

  it('can render a simple component', () => {
    render(<div data-testid="test-element">Test</div>);
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
  });
});