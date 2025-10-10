# Code Style Guidelines

- Use functional components with hooks.
- Prefer named exports for components and utilities.
- Destructure props and state variables for readability.
- Use `PascalCase` for component names and `camelCase` for variables and functions.
- Apply Tailwind CSS classes directly in JSX for styling.

# Project Structure

```
root/
├── app/
│ └── (page name)
├── lib # External integrations (e.g. env, smart contract)
├── domain/
│ └── workflow
│   ├── components/
│   └── hooks/
│ ├── task
│ └── .../
├── common/
│ ├── componnets/ # Pure components only (e.g., shadcn components)
│ └── hooks/ # Pure hooks only (e.g., browser-related)
└── ...
```

- **(page name)**:  Contains page-specific components or logic. Avoid placing components or hooks here that might be reused elsewhere.
- **lib**: Holds external dependencies such as alchemy, env, and pinata etc. this folder is strictly for third-party or system-level integration code.
- **domain**: Divided into subdirectories by feature/domain. (e.g., workflow, task, etc.) Each domain can include its own `components` and `hooks` folders to maintain encapsulation.
- **common**: Contains generic, reusable code that should not include any domain-specific logic. Only pure, decoupled components and hooks should live here
