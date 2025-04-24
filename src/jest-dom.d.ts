/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// If the references above don't work, we'll provide explicit type declarations
declare namespace jest {
  interface Matchers<R, T> {
    toBeInTheDocument(): R;
    toHaveTextContent(text: string | RegExp): R;
    toBeVisible(): R;
    // Add other custom matchers as needed
  }
}

export {};