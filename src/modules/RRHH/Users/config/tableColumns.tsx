// JSX pragma needed for TSX
import { Badge } from 'reactstrap';
import { TFunction } from 'i18next';
import { UserModel } from '../models/UserModel';
import UserAvatar from '@/components/Common/UserAvatar';

/**
 * Genera el texto del tooltip para roles
 */
const getRolesTooltipText = (roles: UserModel['roles']): string => {
  if (!roles || roles.length === 0) return '';
  return roles.map((role, idx) => `${idx + 1}. ${role.name}`).join('\n');
};

/**
 * Genera el texto del tooltip para permisos
 */
const getPermissionsTooltipText = (
  directPermissions: UserModel['permissions'],
  inheritedCount: number,
  t?: TFunction
): string => {
  const parts: string[] = [];

  if (directPermissions && directPermissions.length > 0) {
    const directLabel = t ? t('users.permissions.directPermissions') : 'Permisos Directos';
    parts.push(`${directLabel}:`);
    directPermissions.slice(0, 5).forEach(perm => {
      parts.push(`  • ${perm.namePublic || perm.name}`);
    });
    if (directPermissions.length > 5) {
      const moreLabel = t ? t('users.permissions.more') : 'más...';
      parts.push(`  +${directPermissions.length - 5} ${moreLabel}`);
    }
  }

  if (inheritedCount > 0) {
    const inheritedLabel = t ? t('users.permissions.inheritedFromRoles') : 'Heredados de roles';
    parts.push(`${inheritedLabel}: ${inheritedCount}`);
  }

  return parts.join('\n');
};

/**
 * Genera las columnas de la tabla de usuarios con traducciones
 * @param t - Función de traducción de i18next
 */
export const getUserTableColumns = (t: TFunction) => [
  {
    key: "fullName",
    header: t('users.table.user'),
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <div className="d-flex align-items-center gap-3">
        <UserAvatar
          fullName={original.fullName || `${original.name} ${original.lastName}`}
          avatar={original.avatar}
          size="sm"
        />
        <div className="d-flex flex-column">
          <span className="fw-medium">{original.fullName || `${original.name} ${original.lastName}`}</span>
          <small className="text-muted">{original.email}</small>
        </div>
      </div>
    )
  },
  {
    key: "phone",
    header: t('users.table.phone'),
    sortable: false,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <span className="text-muted font-family-monospace">
        {original.phone || <span className="text-muted">{t('users.card.na')}</span>}
      </span>
    )
  },
  {
    key: "roles",
    header: t('users.table.roles'),
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const roleCount = original.roleIds?.length || 0;

      if (roleCount === 0) {
        return (
          <Badge color="light" className="text-muted">
            {t('users.roles.noRoles')}
          </Badge>
        );
      }

      const tooltipText = getRolesTooltipText(original.roles);

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge
            color="primary"
            pill
            title={tooltipText}
            style={{ cursor: 'help' }}
          >
            <i className="mdi mdi-shield-crown me-1"></i>
            {roleCount} {roleCount === 1 ? t('users.roles.role') : t('users.roles.rolesPlural')}
          </Badge>
        </div>
      );
    }
  },
  {
    key: "permissions",
    header: t('users.table.permissions'),
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const directPermissions = original.permissions || [];
      const directPermissionCount = directPermissions.length;

      // Calcular permisos heredados de roles
      const inheritedPermissionCount = original.roles?.reduce((acc, role) => {
        return acc + (role.permissionIds?.length || 0);
      }, 0) || 0;

      const totalPermissions = directPermissionCount + inheritedPermissionCount;

      if (totalPermissions === 0) {
        return (
          <Badge color="light" className="text-muted">
            {t('users.permissions.noPermissions')}
          </Badge>
        );
      }

      const tooltipText = getPermissionsTooltipText(directPermissions, inheritedPermissionCount, t);

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge
            color="info"
            pill
            title={tooltipText}
            style={{ cursor: 'help' }}
          >
            <i className="mdi mdi-key-variant me-1"></i>
            {totalPermissions} {totalPermissions === 1 ? t('users.permissions.permission') : t('users.permissions.permissionsPlural')}
          </Badge>
        </div>
      );
    }
  }
];

// Mantener compatibilidad con código existente (columnas sin traducción)
export const userTableColumns = [
  {
    key: "fullName",
    header: "Usuario",
    sortable: true,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <div className="d-flex align-items-center gap-3">
        <UserAvatar
          fullName={original.fullName || `${original.name} ${original.lastName}`}
          avatar={original.avatar}
          size="sm"
        />
        <div className="d-flex flex-column">
          <span className="fw-medium">{original.fullName || `${original.name} ${original.lastName}`}</span>
          <small className="text-muted">{original.email}</small>
        </div>
      </div>
    )
  },
  {
    key: "phone",
    header: "Teléfono",
    sortable: false,
    filterable: true,
    filterType: "text",
    cell: ({ row: { original } }: { row: { original: UserModel } }) => (
      <span className="text-muted font-family-monospace">
        {original.phone || <span className="text-muted">N/A</span>}
      </span>
    )
  },
  {
    key: "roles",
    header: "Roles",
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const roleCount = original.roleIds?.length || 0;

      if (roleCount === 0) {
        return (
          <Badge color="light" className="text-muted">
            Sin roles
          </Badge>
        );
      }

      const tooltipText = getRolesTooltipText(original.roles);

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge
            color="primary"
            pill
            title={tooltipText}
            style={{ cursor: 'help' }}
          >
            <i className="mdi mdi-shield-crown me-1"></i>
            {roleCount} {roleCount === 1 ? 'rol' : 'roles'}
          </Badge>
        </div>
      );
    }
  },
  {
    key: "permissions",
    header: "Permisos",
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: UserModel } }) => {
      const directPermissions = original.permissions || [];
      const directPermissionCount = directPermissions.length;

      const inheritedPermissionCount = original.roles?.reduce((acc, role) => {
        return acc + (role.permissionIds?.length || 0);
      }, 0) || 0;

      const totalPermissions = directPermissionCount + inheritedPermissionCount;

      if (totalPermissions === 0) {
        return (
          <Badge color="light" className="text-muted">
            Sin permisos
          </Badge>
        );
      }

      const tooltipText = getPermissionsTooltipText(directPermissions, inheritedPermissionCount);

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge
            color="info"
            pill
            title={tooltipText}
            style={{ cursor: 'help' }}
          >
            <i className="mdi mdi-key-variant me-1"></i>
            {totalPermissions} {totalPermissions === 1 ? 'permiso' : 'permisos'}
          </Badge>
        </div>
      );
    }
  }
];
