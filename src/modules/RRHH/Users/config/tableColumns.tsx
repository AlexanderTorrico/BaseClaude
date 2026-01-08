// JSX pragma needed for TSX
import { Badge, UncontrolledTooltip } from 'reactstrap';
import { UserModel } from '../models/UserModel';
import UserAvatar from '@/components/Common/UserAvatar';

/**
 * Genera un ID seguro para usar en HTML (remueve caracteres especiales)
 */
const safeId = (uuid: string): string => uuid?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown';

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

      const firstRole = original.roles?.[0];
      const tooltipId = `roles-tooltip-${safeId(original.uuid)}`;

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge color="primary" pill id={tooltipId}>
            <i className="mdi mdi-shield-crown me-1"></i>
            {roleCount} {roleCount === 1 ? 'rol' : 'roles'}
          </Badge>
          {firstRole && (
            <UncontrolledTooltip placement="top" target={tooltipId} fade={false}>
              {original.roles?.map((role, idx) => (
                <div key={role.id}>
                  {idx + 1}. {role.name}
                </div>
              ))}
            </UncontrolledTooltip>
          )}
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

      // Calcular permisos heredados de roles
      const inheritedPermissionCount = original.roles?.reduce((acc, role) => {
        return acc + (role.permissionIds?.length || 0);
      }, 0) || 0;

      const totalPermissions = directPermissionCount + inheritedPermissionCount;
      const tooltipId = `permissions-tooltip-${safeId(original.uuid)}`;

      if (totalPermissions === 0) {
        return (
          <Badge color="light" className="text-muted">
            Sin permisos
          </Badge>
        );
      }

      return (
        <div className="d-flex align-items-center gap-1">
          <Badge color="info" pill id={tooltipId}>
            <i className="mdi mdi-key-variant me-1"></i>
            {totalPermissions} {totalPermissions === 1 ? 'permiso' : 'permisos'}
          </Badge>
          <UncontrolledTooltip placement="top" target={tooltipId} fade={false}>
            <div className="text-start">
              {directPermissionCount > 0 && (
                <div>
                  <strong>Permisos Directos:</strong>
                  {directPermissions.slice(0, 5).map((perm) => (
                    <div key={perm.id} className="ms-2">
                      • {perm.namePublic || perm.name}
                    </div>
                  ))}
                  {directPermissionCount > 5 && (
                    <div className="ms-2 text-muted">
                      +{directPermissionCount - 5} más...
                    </div>
                  )}
                </div>
              )}
              {inheritedPermissionCount > 0 && (
                <div className="mt-1">
                  <strong>Heredados de roles:</strong> {inheritedPermissionCount}
                </div>
              )}
            </div>
          </UncontrolledTooltip>
        </div>
      );
    }
  }
];
