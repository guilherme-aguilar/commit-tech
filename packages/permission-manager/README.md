# Permission Manager

A flexible permission management system for controlling access to resources based on user permissions and conditions.

## Features

- Role-based access control
- Condition-based permissions
- Support for multiple tenant adapters
- Flexible permission evaluation

## Installation

\`\`\`bash
npm install @commit-tech/permission-manager
\`\`\`

## Usage

\`\`\`typescript
import { PermissionManager, OriginalDataAdapter } from '@commit-tech/permission-manager';

// Create an adapter
const adapter = new OriginalDataAdapter();

// Initialize the permission manager
const permissionManager = new PermissionManager([adapter]);

// Check if a user can perform an action on a resource
const canUpdate = permissionManager.canPerformAction(
  userData,
  "update",
  "manage_customer",
  customerResource
);

if (canUpdate) {
  // Proceed with the update
} else {
  // Show access denied message
}
\`\`\`

## API

### PermissionManager

The main class for managing permissions.

#### Methods

- `canPerformAction(userData, action, subject, resource?)`: Checks if the user can perform the specified action on the subject/resource
- `can(userData, action, subject, resource?)`: Alias for canPerformAction
- `addTenantAdapter(adapter)`: Adds a new tenant adapter

### OriginalDataAdapter

A default adapter implementation for the standard user data format.

## License

MIT
