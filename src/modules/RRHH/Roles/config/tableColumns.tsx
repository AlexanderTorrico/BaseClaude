import { Badge, UncontrolledTooltip } from 'reactstrap';
import { RoleModel } from '../models/RoleModel';

export const roleTableColumns = [
    {
        key: "name",
        header: "Nombre del Rol",
        sortable: true,
        filterable: true,
        filterType: "text",
        cell: ({ row: { original } }: { row: { original: RoleModel } }) => (
            <div className="d-flex align-items-center gap-2">
                <div
                    className="rounded-circle bg-primary bg-soft d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px' }}
                >
                    <i className="mdi mdi-shield-crown text-primary font-size-18"></i>
                </div>
                <div className="d-flex flex-column">
                    <span className="fw-medium">{original.name}</span>
                    <small className="text-muted">ID: {original.id}</small>
                </div>
            </div>
        )
    },
    {
        key: "detail",
        header: "Descripción",
        sortable: false,
        filterable: true,
        filterType: "text",
        cell: ({ row: { original } }: { row: { original: RoleModel } }) => (
            <span className="text-muted" style={{ maxWidth: '300px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {original.detail || <span className="fst-italic">Sin descripción</span>}
            </span>
        )
    },
    {
        key: "permissions",
        header: "Permisos",
        sortable: false,
        filterable: false,
        cell: ({ row: { original } }: { row: { original: RoleModel } }) => {
            const permissionCount = original.permissionIds?.length || original.permissions?.length || 0;
            const tooltipId = `permissions-tooltip-${original.id}`;

            if (permissionCount === 0) {
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
                        {permissionCount} {permissionCount === 1 ? 'permiso' : 'permisos'}
                    </Badge>
                    {original.permissions && original.permissions.length > 0 && (
                        <UncontrolledTooltip placement="top" target={tooltipId}>
                            {original.permissions.slice(0, 5).map((perm, idx) => (
                                <div key={perm.id}>
                                    {idx + 1}. {perm.name}
                                </div>
                            ))}
                            {original.permissions.length > 5 && (
                                <div className="mt-1 pt-1 border-top text-muted">
                                    +{original.permissions.length - 5} más...
                                </div>
                            )}
                        </UncontrolledTooltip>
                    )}
                </div>
            );
        }
    }
];
