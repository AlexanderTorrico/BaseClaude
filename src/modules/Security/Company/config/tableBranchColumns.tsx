import { BranchModel } from '../models/CompanyModel';
import { Badge } from 'reactstrap';

export const branchTableColumns = [
  {
    key: 'name',
    header: 'Nombre',
    sortable: true,
    filterable: true,
    filterType: 'text' as const,
    cell: ({ row: { original } }: { row: { original: BranchModel } }) => (
      <div className="d-flex align-items-center">
        <i className="mdi mdi-map-marker text-danger me-2"></i>
        <span className="fw-medium">{original.name}</span>
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Teléfono',
    sortable: true,
    filterable: true,
    filterType: 'text' as const,
    cell: ({ row: { original } }: { row: { original: BranchModel } }) => (
      <span className="text-muted">
        <i className="mdi mdi-phone me-1"></i>
        {original.phone}
      </span>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
    filterable: true,
    filterType: 'text' as const,
    cell: ({ row: { original } }: { row: { original: BranchModel } }) =>
      original.email ? (
        <span className="text-muted">
          <i className="mdi mdi-email me-1"></i>
          {original.email}
        </span>
      ) : (
        <span className="text-muted">-</span>
      ),
  },
  {
    key: 'address',
    header: 'Dirección',
    sortable: true,
    filterable: true,
    filterType: 'text' as const,
    cell: ({ row: { original } }: { row: { original: BranchModel } }) => (
      <span className="text-muted" style={{ fontSize: '0.875rem' }}>
        {original.address}
      </span>
    ),
  },
  {
    key: 'coordinates',
    header: 'Coordenadas',
    sortable: false,
    filterable: false,
    cell: ({ row: { original } }: { row: { original: BranchModel } }) =>
      original.lat !== null && original.lng !== null ? (
        <Badge color="info" pill className="font-size-12">
          <i className="mdi mdi-map-marker-check me-1"></i>
          {original.lat.toFixed(4)}, {original.lng.toFixed(4)}
        </Badge>
      ) : (
        <Badge color="light" className="text-muted font-size-12">
          Sin ubicación
        </Badge>
      ),
  },
];
