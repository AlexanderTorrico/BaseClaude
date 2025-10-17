import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { AzTable } from '@/components/aziende/AzTable';
import AzFilterSummary from '@/components/aziende/AzFilterSummary';
import { useWorkStations } from '../hooks/useWorkStations';
import { workStationTableColumns } from '../config/tableColumns';

/**
 * Vista de Tabla para WorkStations
 * Usa AzTable con filtros y ordenamiento
 * Responsive: se transforma en cards en mobile
 */

const WorkStationTableView: React.FC = () => {
  const {
    filteredWorkStations,
    loading,
    error,
    openSidebar
  } = useWorkStations();

  const handleViewRequirements = (workStationId: number) => {
    const workStation = filteredWorkStations.find(ws => ws.id === workStationId);
    if (workStation) {
      openSidebar(workStation);
    }
  };

  const handleEdit = (workStationId: number) => {
    console.log('Edit workStation:', workStationId);
    // TODO: Implementar modal de edici�n
  };

  const handleDelete = (workStationId: number) => {
    console.log('Delete workStation:', workStationId);
    // TODO: Implementar confirmaci�n de eliminaci�n
  };

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <i className="mdi mdi-alert-circle text-danger" style={{ fontSize: '48px' }}></i>
          <div className="mt-2 text-danger">{error}</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <AzFilterSummary data={filteredWorkStations} columns={workStationTableColumns}>
      {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
        <AzTable
          data={filteredData}
          columns={workStationTableColumns}
          loading={loading}
          filters={filters}
          sorting={sorting}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          emptyMessage="No hay puestos de trabajo para mostrar"
        >
          <AzTable.Actions
            editAction={handleEdit}
            deleteAction={handleDelete}
            customActions={[
              {
                icon: 'mdi mdi-clipboard-list',
                label: 'Ver Requisitos',
                color: 'info',
                handler: handleViewRequirements
              }
            ]}
          />
        </AzTable>
      )}
    </AzFilterSummary>
  );
};

export default WorkStationTableView;
