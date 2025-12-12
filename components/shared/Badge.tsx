import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  danger: 'bg-red-400',
  info: 'bg-blue-400',
  purple: 'bg-purple-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  style,
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${style ? '' : variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={style}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyles[variant]}`}
        />
      )}
      {children}
    </span>
  );
};

// Pre-configured badges for common statuses
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    draft: { variant: 'default', label: 'Draft' },
    'pending-sharia-review': { variant: 'warning', label: 'Pending Sharia Review' },
    'sharia-approved': { variant: 'success', label: 'Sharia Approved' },
    'pending-legal-review': { variant: 'warning', label: 'Pending Legal Review' },
    'legal-approved': { variant: 'success', label: 'Legal Approved' },
    'pending-risk-review': { variant: 'warning', label: 'Pending Risk Review' },
    'risk-approved': { variant: 'success', label: 'Risk Approved' },
    'pending-deployment': { variant: 'info', label: 'Pending Deployment' },
    deployed: { variant: 'purple', label: 'Deployed' },
    active: { variant: 'success', label: 'Active' },
    suspended: { variant: 'danger', label: 'Suspended' },
    archived: { variant: 'default', label: 'Archived' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

export const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleConfig: Record<string, { variant: BadgeVariant; label: string }> = {
    'product-owner': { variant: 'info', label: 'Product Owner' },
    'sharia-scholar': { variant: 'success', label: 'Sharia Scholar' },
    'legal-compliance': { variant: 'purple', label: 'Legal & Compliance' },
    'risk-audit': { variant: 'danger', label: 'Risk & Audit' },
    engineering: { variant: 'warning', label: 'Engineering' },
    'sales-service': { variant: 'info', label: 'Sales & Service' },
    regulator: { variant: 'default', label: 'Regulator' },
    customer: { variant: 'info', label: 'Customer' },
  };

  const config = roleConfig[role] || { variant: 'default', label: role };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default Badge;
