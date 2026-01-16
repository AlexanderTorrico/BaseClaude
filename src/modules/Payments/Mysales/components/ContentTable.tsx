import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import AzTable from '@/components/aziende/AzTable';
import { SaleTransactionModel } from '../models/MysalesModel';
import { mysalesColumns } from '../config/tableMysalesColumns';

interface ContentTableProps {
  filteredTransactions: SaleTransactionModel[];
  filters: Record<string, any>;
  sorting: { key: string; direction: 'asc' | 'desc' } | null;
  onFilterChange: (filters: Record<string, any>) => void;
  onSortChange: (sorting: { key: string; direction: 'asc' | 'desc' } | null) => void;
  loading: boolean;
  onViewDetails?: (transaction: SaleTransactionModel) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  filteredTransactions,
  filters,
  sorting,
  onFilterChange,
  onSortChange,
  loading,
  onViewDetails
}) => {
  return (
    <Row>
      <Col xl={12}>
        <AzTable
          data={filteredTransactions}
          columns={mysalesColumns}
          pagination={true}
          filters={filters}
          onFilterChange={onFilterChange}
          sorting={sorting}
          onSortChange={onSortChange}
          loading={loading}
          className="table-centered"
        >
          <AzTable.Actions>
            {(row: SaleTransactionModel) => (
              <Button
                size="sm"
                color="primary"
                outline
                title="Ver detalles"
                onClick={() => onViewDetails?.(row)}
              >
                <i className="mdi mdi-eye"></i>
              </Button>
            )}
          </AzTable.Actions>
        </AzTable>
      </Col>
    </Row>
  );
};

export default ContentTable;
