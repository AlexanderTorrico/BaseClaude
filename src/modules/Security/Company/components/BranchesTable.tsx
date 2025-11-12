import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import AzTable from '@/components/Common/AzTable';
import { Branch } from '../models/CompanyModel';
import { branchTableColumns } from '../config/tableBranchColumns';

interface BranchesTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (branchId: number) => void;
}

const BranchesTable: React.FC<BranchesTableProps> = ({ branches, onEdit, onDelete }) => {
  const handleEdit = (branch: Branch) => {
    onEdit(branch);
  };

  const handleDelete = (branch: Branch) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la sucursal "${branch.name}"?\n\nEsta acción no se puede deshacer.`
      )
    ) {
      onDelete(branch.id);
    }
  };

  return (
    <Card>
      <CardBody>
        <AzTable
          data={branches}
          columns={branchTableColumns}
          pagination={true}
        >
          <AzTable.Actions>
            {(props: { row: Branch }) => {
              const branch = props.row;
              return (
                <>
                  <Button
                    color="info"
                    size="sm"
                    outline
                    onClick={() => handleEdit(branch)}
                    title="Editar sucursal"
                  >
                    <i className="mdi mdi-pencil"></i>
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    outline
                    onClick={() => handleDelete(branch)}
                    title="Eliminar sucursal"
                  >
                    <i className="mdi mdi-delete"></i>
                  </Button>
                </>
              );
            }}
          </AzTable.Actions>
        </AzTable>
      </CardBody>
    </Card>
  );
};

export default BranchesTable;
