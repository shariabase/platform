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
│   ├── /shared                  ← Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Avatar.tsx
│   │   └── index.ts
│   ├── /documents               ← 📄 DOCUMENT MANAGEMENT SYSTEM
│   │   ├── DocumentCard.tsx     ← Individual document display
│   │   ├── DocumentUploader.tsx ← Drag-and-drop upload
│   │   ├── DocumentList.tsx     ← Filterable document list
│   │   ├── DocumentViewer.tsx   ← Document preview modal
│   │   ├── DocumentVersionHistory.tsx ← Version timeline
│   │   ├── DocumentPanel.tsx    ← Self-contained document panel
│   │   └── index.ts
│   ├── /dashboard               ← Dashboard widgets
│   ├── /sharia-board            ← Sharia Scholar components
│   ├── /legal-compliance        ← Legal review components
│   ├── /risk-audit              ← Risk assessment components
│   ├── /workflow                ← Workflow engine components
│   └── /auth                    ← Authentication components
├── /pages
│   ├── ProductOwnerPage.tsx     ← Product Owner dashboard
│   ├── ShariaBoardPage.tsx      ← Sharia review workspace
│   ├── DocumentsPage.tsx        ← Document management page
│   └── index.ts
├── /hooks
│   ├── useAuth.ts               ← Authentication logic
│   ├── useWorkflow.ts           ← Workflow management
│   ├── useDocuments.ts          ← 📄 Document CRUD operations
│   └── index.ts
├── /types
│   ├── index.ts                 ← Core types
│   ├── roles.ts                 ← Role configurations
│   └── documents.ts             ← 📄 Document type definitions
├── /utils
│   ├── constants.ts             ← Labels, configs
│   └── documentHelpers.ts       ← 📄 Document utilities
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 📄 Document Management System

The Document Management System is a core feature that enables all roles to upload, view, and track documents with full version control and audit trail.

### Features

| Feature | Description |
|---------|-------------|
| **Drag & Drop Upload** | Intuitive file upload with validation |
| **Version Control** | Track all versions with change notes |
| **Hash Verification** | SHA-256 hashing for document integrity |
| **Role-Based Permissions** | Control who can upload which document types |
| **Access Logging** | Track who viewed/downloaded documents |
| **Search & Filter** | Find documents by type, date, or keyword |
| **Multiple View Modes** | Grid or list view |

### Document Types

| Type | Icon | Allowed Roles |
|------|------|---------------|
| Research | 📊 | Product Owner, Legal, Risk |
| Fatwa | 📜 | Sharia Scholar only |
| Sharia Opinion | 💭 | Sharia Scholar only |
| Contract Draft | 📝 | Product Owner, Legal |
| Regulatory Filing | 🏛️ | Legal, Risk |
| Audit Report | 🔍 | Risk, Regulator |
| Training Material | 📚 | Product Owner, Sales |
| Customer Disclosure | 📋 | Product Owner, Legal, Sales |

### Usage

```tsx
// Embed DocumentPanel in any page
import { DocumentPanel } from '../components/documents';

<DocumentPanel
  productId="product-123"
  userRole="sharia-scholar"
  userId="user-456"
  userName="Dr. Ahmed"
  title="Product Documents"
  showUploadButton={true}
/>

// Use the hook directly for custom implementations
import { useDocuments } from '../hooks';

const { documents, uploadDocument, uploadNewVersion } = useDocuments('product-123');
```

### Immutability & Compliance

- All documents are hashed using SHA-256
- Documents cannot be modified—only new versions can be added
- Complete audit trail for regulatory compliance
- Tamper-evident logging for all access

## 🏗️ Architecture

### Core Features

1. **Product Workflow Engine**
   - Multi-stage approval workflow
   - Stage transitions: Initiation → Sharia Review → Legal Review → Risk Review → Engineering → Deployment
   - Role-based approval gates

2. **Document Management** ✅ IMPLEMENTED
   - Version control for all documents
   - Immutable audit trail with hash verification
   - Document types: Research, Fatwas, Opinions, Contracts, Audit Reports
   - Role-based upload permissions
   - Search, filter, and sort capabilities

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

## 📊 Current Implementation Status

### ✅ Implemented

- [x] Core type definitions (40+ interfaces)
- [x] Role configuration system
- [x] Shared UI components (Button, Card, Badge, Modal, Avatar)
- [x] Dashboard framework with widgets
- [x] Product Owner dashboard page
- [x] Sharia Board review workspace
- [x] Authentication hook
- [x] Workflow management hook
- [x] **Document Management System** (NEW)
  - [x] DocumentCard component
  - [x] DocumentUploader with drag-and-drop
  - [x] DocumentList with filters
  - [x] DocumentViewer modal
  - [x] DocumentVersionHistory
  - [x] DocumentPanel (reusable)
  - [x] useDocuments hook
  - [x] Document type definitions
  - [x] Document helpers & utilities

### 🔜 Next Up

- [ ] Legal & Compliance workspace
- [ ] Risk Management dashboard
- [ ] Meeting management system
- [ ] Product creation flow
- [ ] Enhanced workflow engine

### 📅 Planned

- [ ] Engineering deployment interface
- [ ] Sales & Customer Service portal
- [ ] Regulator audit interface
- [ ] Customer portal
- [ ] Smart contract integration
- [ ] Real-time notifications

## 🔐 Security Considerations

- All approvals require digital signatures
- Document hashes ensure immutability
- Audit logs are tamper-evident (blockchain-style linking)
- Role-based access control (RBAC) enforced at all levels
- Document access logging for compliance

## 📄 License

Private - Internal Use Only
