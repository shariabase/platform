# Sharia-Compliant Financial Product Management Platform

A multi-role platform for managing Islamic finance product workflows, approvals, and compliance.

## 🎯 Overview

This platform streamlines the end-to-end lifecycle of Sharia-compliant financial products, from inception through deployment. It provides role-specific workspaces for all stakeholders involved in the product approval process.

## 👥 Personas / Roles

| Role | Description | Primary Features |
|------|-------------|------------------|
| **Business/Product Owner** | Initiates workflows, selects templates | Product creation, workflow monitoring |
| **Sharia Scholar / SSB** | Reviews structures, issues fatwas | Threaded discussions, document versioning |
| **Legal & Compliance** | Regulatory checks, contract review | AAOIFI/IFSB compliance checking |
| **Risk Management & Audit** | Risk evaluation, internal audit | Risk assessment, audit packs |
| **IT/Engineering** | Smart contract deployment | Code implementation, integrations |
| **Sales & Customer Service** | Customer onboarding, training | KYC workflows, training modules |
| **Regulator / External Auditor** | Compliance verification | Immutable logs, audit trails |
| **End Customer** | Product interaction | Simplified portal, contract signing |

## 📁 Project Structure

```
/workspace
├── /components
│   ├── /shared              ← Reusable UI components (Button, Card, Modal, etc.)
│   ├── /dashboard           ← Dashboard widgets and layouts
│   ├── /product-owner       ← Product owner specific components
│   ├── /sharia-board        ← Sharia scholar workspace components
│   ├── /legal-compliance    ← Legal review components
│   ├── /risk-audit          ← Risk assessment components
│   ├── /engineering         ← Smart contract/deployment components
│   ├── /sales-service       ← Customer service components
│   ├── /regulator           ← Auditor/regulator components
│   ├── /customer-portal     ← End customer components
│   ├── /meetings            ← Meeting management components
│   ├── /documents           ← Document management components
│   ├── /workflow            ← Workflow engine components
│   └── /auth                ← Authentication components
├── /pages                   ← Page-level components
│   ├── ProductOwnerPage.tsx
│   ├── ShariaBoardPage.tsx
│   └── [other role pages]
├── /hooks                   ← Custom React hooks
│   ├── useAuth.ts
│   └── useWorkflow.ts
├── /utils                   ← Helper functions, constants
│   └── constants.ts
└── /types                   ← TypeScript definitions
    ├── index.ts             ← Core types
    └── roles.ts             ← Role configurations
```

## 🏗️ Architecture

### Core Features

1. **Product Workflow Engine**
   - Multi-stage approval workflow
   - Stage transitions: Initiation → Sharia Review → Legal Review → Risk Review → Engineering → Deployment
   - Role-based approval gates

2. **Document Management**
   - Version control for all documents
   - Immutable audit trail with hash verification
   - Document types: Research, Fatwas, Opinions, Contracts, Audit Reports

3. **Collaboration Workspace**
   - Threaded comments with @mentions
   - Real-time notifications
   - Meeting scheduling and management

4. **Compliance Engine**
   - AAOIFI standard compliance checking
   - IFSB regulatory compliance
   - Central bank circular tracking
   - Automated conflict detection

5. **Audit Trail**
   - Blockchain-style immutable logging
   - Complete approval history
   - Digital signatures for approvals

### Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **Build Tool**: Vite
- **Testing**: Vitest

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📋 Development Guidelines

### Adding New Features

Before creating components, document:
1. **Target folder** for new components
2. **Shared components** to reuse or create
3. **Integration points** with existing features

### Component Rules

1. **One Feature = One Folder**: Each major feature has its own folder in `/components`
2. **Shared Components**: Components used by 2+ features go in `/components/shared`
3. **Clear File Names**: Use descriptive names (e.g., `MeetingCalendar.tsx`, not `Calendar.tsx`)
4. **No Giant Files**: Keep components under 300 lines
5. **Role-Based Organization**: Role-specific components go in that role's folder

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `WorkflowStatusWidget.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useWorkflow.ts`)
- Utils: `camelCase.ts` (e.g., `constants.ts`)
- Types: `camelCase.ts` (e.g., `index.ts`, `roles.ts`)

## 📊 Current State

### Implemented

- [x] Core type definitions
- [x] Role configuration system
- [x] Shared UI components (Button, Card, Badge, Modal, Avatar)
- [x] Dashboard layout and widgets
- [x] Product Owner dashboard page
- [x] Sharia Board review workspace
- [x] Authentication hook
- [x] Workflow management hook

### Planned

- [ ] Legal & Compliance workspace
- [ ] Risk Management dashboard
- [ ] Engineering deployment interface
- [ ] Sales & Customer Service portal
- [ ] Regulator audit interface
- [ ] Customer portal
- [ ] Meeting management system
- [ ] Document upload/versioning UI
- [ ] Smart contract integration
- [ ] Real-time notifications

## 🔐 Security Considerations

- All approvals require digital signatures
- Document hashes ensure immutability
- Audit logs are tamper-evident (blockchain-style linking)
- Role-based access control (RBAC) enforced at all levels

## 📄 License

Private - Internal Use Only
