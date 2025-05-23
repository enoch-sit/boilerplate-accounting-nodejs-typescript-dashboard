# Getting Started with Simple Accounting Dashboard

A beginner's guide to understanding and contributing to this project.

## Project Overview

This is a TypeScript-based accounting dashboard with authentication features, designed to help you manage users and track financial data.

## Key Technologies

- **TypeScript**: For type-safe JavaScript development
- **React**: UI library for building user interfaces
- **Redux**: State management with Redux Toolkit
- **Material UI**: Component library for consistent UI design
- **Vite**: Build tool for fast development
- **Jest**: Testing framework
- **Docker**: Containerization for deployment

## Project Structure

- **/src**: Main source code
  - **/components**: React components organized by feature
  - **/features**: Redux slices for state management
  - **/services**: API service clients
  - **/types**: TypeScript type definitions
  - **/hooks**: Custom React hooks
  - **/layouts**: Page layout components

## Common TypeScript Issues and Solutions

### Optional Properties

When working with optional properties, use the nullish coalescing operator:

`	ypescript
// Instead of this (causes errors)
functionThatNeedsBoolean(object.maybeUndefined)

// Do this
functionThatNeedsBoolean(object.maybeUndefined ?? false)
`

### Dynamic Object Properties

When adding properties to objects dynamically:

`	ypescript
// Instead of this (causes errors)
const params = { base: 'value' };
params['dynamic'] = otherValue;

// Do this
const params: { base: string; [key: string]: string } = { base: 'value' };
params['dynamic'] = otherValue;
`

## Getting Started

1. Clone the repository
2. Install dependencies with 
pm install
3. Start the development server with 
pm run dev
4. Run tests with 
pm test

## Docker Deployment

The project includes multiple Docker configurations:
- Basic: docker-compose up
- Multi-environment: Uses Dockerfile.multi-env
- Multi-stage builds: Uses Dockerfile.multi-stage

## Common Commands

`ash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
`

## Need Help?

- Check the /Doc folder for more detailed documentation
- Review the /Design/Blueprints for architecture details
- Look at existing components in /src/components for code examples

Happy coding!

