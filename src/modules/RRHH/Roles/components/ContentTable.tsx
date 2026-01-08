import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import AzTable from '../../../../components/aziende/AzTable';
import { roleTableColumns } from '../config/tableColumns';
import { RoleModel } from '../models/RoleModel';

interface ContentTableProps {
    filteredRoles: RoleModel[];
    filters?: Record<string, string>;
    sorting?: { field: string; direction: string };
    onFilterChange?: (column: string, value: string) => void;
    onSortChange?: (config: { field: string; direction: string }) => void;
    loading: boolean;
    onEdit: (roleId: number) => void;
    onDelete: (roleId: number) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
    filteredRoles,
    filters,
    sorting,
    onFilterChange,
    onSortChange,
    loading,
    onEdit,
    onDelete,
}) => {
    const handleViewRole = (roleId: number) => {
        console.log('Ver detalles del rol:', roleId);
    };

    return (
        <Row>
            <Col xl={12}>
                <AzTable
                    data={filteredRoles}
                    columns={roleTableColumns}
                    pagination={true}
                    filters={filters || {}}
                    onFilterChange={onFilterChange || (() => { })}
                    sorting={sorting || { field: '', direction: '' }}
                    onSortChange={onSortChange || (() => { })}
                    className="table-centered"
                    loading={loading}
                >
                    <AzTable.Actions>
                        <Button
                            size="sm"
                            color="info"
                            outline
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as RoleModel;
                                handleViewRole(rowData.id);
                            }}
                            title="Ver detalles"
                        >
                            <i className="mdi mdi-eye"></i>
                        </Button>
                        <Button
                            size="sm"
                            color="primary"
                            outline
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as RoleModel;
                                onEdit(rowData.id);
                            }}
                            title="Editar rol"
                        >
                            <i className="mdi mdi-pencil"></i>
                        </Button>
                        <Button
                            size="sm"
                            color="danger"
                            outline
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as RoleModel;
                                onDelete(rowData.id);
                            }}
                            title="Eliminar rol"
                        >
                            <i className="mdi mdi-trash-can"></i>
                        </Button>
                    </AzTable.Actions>
                </AzTable>
            </Col>
        </Row>
    );
};

export default ContentTable;
