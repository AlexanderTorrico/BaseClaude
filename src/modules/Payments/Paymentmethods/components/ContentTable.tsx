import React from 'react';
import { Button } from 'reactstrap';
import AzTable from '@/components/aziende/AzTable';
import { paymentMethodsTableColumns } from '../config/tablePaymentmethodsColumns';
import { PaymentMethodModel } from '../models/PaymentmethodsModel';

interface ContentTableProps {
  filteredData: PaymentMethodModel[];
  filters: Record<string, string>;
  sorting: { field: string; direction: string };
  onFilterChange: (column: string, value: string) => void;
  onSortChange: (config: { field: string; direction: string }) => void;
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  filteredData,
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  loading,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  return (
    <AzTable
      data={filteredData}
      columns={paymentMethodsTableColumns}
      pagination={true}
      filters={filters}
      onFilterChange={onFilterChange}
      sorting={sorting}
      onSortChange={onSortChange}
      loading={loading}
    >
      <AzTable.Actions>
        {({ row }: { row: PaymentMethodModel }) => (
          <>
            <Button
              size="sm"
              color={row.isActive ? 'success' : 'secondary'}
              outline
              title={row.isActive ? 'Desactivar' : 'Activar'}
              onClick={() => onToggleActive(row.id)}
            >
              <i className={`mdi ${row.isActive ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'}`} />
            </Button>
            <Button
              size="sm"
              color="primary"
              outline
              title="Configurar"
              onClick={() => onEdit(row.id)}
            >
              <i className="mdi mdi-cog" />
            </Button>
            <Button
              size="sm"
              color="danger"
              outline
              title="Eliminar"
              onClick={() => onDelete(row.id)}
            >
              <i className="mdi mdi-trash-can" />
            </Button>
          </>
        )}
      </AzTable.Actions>
    </AzTable>
  );
};

export default ContentTable;
