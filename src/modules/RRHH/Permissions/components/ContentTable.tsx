import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import AzTable from '../../../../components/aziende/AzTable';
import { permissionTableColumns } from '../config/tableColumns';
import { PermissionModel } from '../models/PermissionModel';

interface ContentTableProps {
    filteredPermissions: PermissionModel[];
    filters?: Record<string, string>;
    sorting?: { field: string; direction: string };
    onFilterChange?: (column: string, value: string) => void;
    onSortChange?: (config: { field: string; direction: string }) => void;
    loading: boolean;
}

const ContentTable: React.FC<ContentTableProps> = ({
    filteredPermissions,
    filters,
    sorting,
    onFilterChange,
    onSortChange,
    loading,
}) => {
    const handleViewPermission = (id: number) => {
        console.log('Ver detalles del permiso:', id);
    };

    return (
        <Row>
            <Col xl={12}>
                <AzTable
                    data={filteredPermissions}
                    columns={permissionTableColumns}
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
                                const rowData = JSON.parse(e.currentTarget.getAttribute('data-row') || '{}') as PermissionModel;
                                handleViewPermission(rowData.id);
                            }}
                            title="Ver detalles"
                        >
                            <i className="mdi mdi-eye"></i>
                        </Button>
                    </AzTable.Actions>
                </AzTable>
            </Col>
        </Row>
    );
};

export default ContentTable;
