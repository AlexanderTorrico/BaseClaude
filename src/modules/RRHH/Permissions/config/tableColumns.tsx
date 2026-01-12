import { Badge } from 'reactstrap';
import { PermissionModel } from '../models/PermissionModel';

export const permissionTableColumns = [
    {
        key: "name",
        header: "Nombre del Permiso",
        sortable: true,
        filterable: true,
        filterType: "text",
        cell: ({ row: { original } }: { row: { original: PermissionModel } }) => (
            <div className="d-flex align-items-center gap-2">
                <div
                    className="rounded-circle bg-info bg-soft d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px' }}
                >
                    <i className="mdi mdi-key-variant text-info font-size-18"></i>
                </div>
                <div className="d-flex flex-column">
                    <span className="fw-medium">{original.name}</span>
                    <small className="text-muted">ID: {original.id}</small>
                </div>
            </div>
        )
    },
    {
        key: "description",
        header: "Descripción",
        sortable: false,
        filterable: true,
        filterType: "text",
        cell: ({ row: { original } }: { row: { original: PermissionModel } }) => (
            <span className="text-muted" style={{ maxWidth: '300px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {original.description || <span className="fst-italic">Sin descripción</span>}
            </span>
        )
    },
    {
        key: "module",
        header: "Módulo",
        sortable: true,
        filterable: true,
        filterType: "text",
        cell: ({ row: { original } }: { row: { original: PermissionModel } }) => {
            if (!original.module || !original.module.name) {
                return (
                    <Badge color="light" className="text-muted">
                        Sin módulo
                    </Badge>
                );
            }
            return (
                <div className="d-flex align-items-center gap-2">
                    {original.module.icon && (
                        <i className={`${original.module.icon} text-primary font-size-16`}></i>
                    )}
                    <Badge color="primary" pill>
                        {original.module.name}
                    </Badge>
                </div>
            );
        }
    }
];
