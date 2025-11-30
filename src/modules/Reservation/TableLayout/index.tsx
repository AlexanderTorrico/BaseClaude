import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTableLayout } from './hooks/useTableLayout';
import { useTableLayoutFetch } from './hooks/useTableLayoutFetch';
import { TableLayoutApiService } from './services/TableLayoutApiService';
import { setSelectedZone, setSelectedTable } from './slices/tablelayoutSlice';
import Header from './components/Header';
import ZoneTreeView from './components/ZoneTreeView';
import TableEditor from './components/TableEditor';
import CreateZoneModal from './components/modals/CreateZoneModal';
import CreateTableModal from './components/modals/CreateTableModal';
import UnsavedChangesModal from './components/modals/UnsavedChangesModal';
import { TableModel } from './models/TableLayoutModel';

const tableLayoutService = new TableLayoutApiService();

const TableLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { zones, selectedZoneId, selectedTableId, getSelectedZone, getTotalZones, getTotalTables, getTablesForZone } =
    useTableLayout();
  const { loading, fetchZonesByCompany, createZone, createTable, updateTablePositions } =
    useTableLayoutFetch(tableLayoutService);

  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingZoneChange, setPendingZoneChange] = useState<number | null>(null);
  const [localTables, setLocalTables] = useState<TableModel[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingModal, setSavingModal] = useState(false);
  const [expandedZones, setExpandedZones] = useState<number[]>([]);
  const [pendingTableSelection, setPendingTableSelection] = useState<{ zoneId: number; tableNumber: string } | null>(null);
  const originalTablesRef = useRef<TableModel[]>([]);
  const previousZoneTablesRef = useRef<string>('');

  const tablesForEditor = selectedZoneId ? getTablesForZone(selectedZoneId) : [];

  useEffect(() => {
    fetchZonesByCompany(1);
  }, []);

  useEffect(() => {
    const tablesKey = `${selectedZoneId}-${tablesForEditor.length}-${tablesForEditor.map(t => `${t.id}`).join(',')}`;

    console.log('🔶 [index useEffect] tablesKey:', tablesKey);
    console.log('🔶 [index useEffect] previousZoneTablesRef.current:', previousZoneTablesRef.current);
    console.log('🔶 [index useEffect] tablesForEditor:', tablesForEditor);

    if (tablesKey !== previousZoneTablesRef.current) {
      console.log('🔶 [index useEffect] Updating localTables with:', tablesForEditor);
      setLocalTables(tablesForEditor);
      originalTablesRef.current = JSON.parse(JSON.stringify(tablesForEditor));
      setHasUnsavedChanges(false);
      previousZoneTablesRef.current = tablesKey;
    } else {
      console.log('🔶 [index useEffect] No change detected, skipping update');
    }
  }, [tablesForEditor, selectedZoneId]);

  // Auto-seleccionar mesa pendiente cuando Redux se actualice
  useEffect(() => {
    if (pendingTableSelection) {
      console.log('🔶 [index pendingTableSelection] Looking for table:', pendingTableSelection);
      const zone = zones.find(z => z.id === pendingTableSelection.zoneId);
      if (zone) {
        console.log('🔶 [index pendingTableSelection] Zone found:', zone);
        const table = zone.booTables.find(t => t.number === pendingTableSelection.tableNumber);
        if (table) {
          console.log('🔶 [index pendingTableSelection] Table found, selecting:', table);
          dispatch(setSelectedTable(table.id));
          setPendingTableSelection(null);
        } else {
          console.log('🔶 [index pendingTableSelection] Table not found yet in zone');
        }
      } else {
        console.log('🔶 [index pendingTableSelection] Zone not found');
      }
    }
  }, [zones, pendingTableSelection, dispatch]);

  const handleRefresh = () => {
    fetchZonesByCompany(1);
  };

  const handleToggleZone = (zoneId: number) => {
    // Si hay cambios sin guardar y estamos intentando cambiar a otra zona
    if (hasUnsavedChanges && selectedZoneId !== null && selectedZoneId !== zoneId) {
      setPendingZoneChange(zoneId);
      setShowUnsavedModal(true);
      return;
    }

    if (expandedZones.includes(zoneId)) {
      // Si la zona ya está abierta, cerrarla
      setExpandedZones([]);
    } else {
      // Si la zona está cerrada, abrirla y cerrar todas las demás
      setExpandedZones([zoneId]);
      // También seleccionar la zona para mostrarla en la pizarra
      dispatch(setSelectedZone(zoneId));
      dispatch(setSelectedTable(null));
    }
  };

  const handleSelectTable = (tableId: number) => {
    // Encontrar la zona a la que pertenece esta mesa
    const zoneWithTable = zones.find(zone =>
      zone.booTables.some(table => table.id === tableId)
    );

    // Si hay cambios sin guardar y la mesa pertenece a otra zona
    if (hasUnsavedChanges && zoneWithTable && selectedZoneId !== null && selectedZoneId !== zoneWithTable.id) {
      setPendingZoneChange(zoneWithTable.id);
      setShowUnsavedModal(true);
      return;
    }

    dispatch(setSelectedTable(tableId));

    if (zoneWithTable && !expandedZones.includes(zoneWithTable.id)) {
      // Abrir solo esta zona, cerrando las demás
      setExpandedZones([zoneWithTable.id]);
    }
  };

  const handleCreateZone = async (dto: any) => {
    const result = await createZone(dto);
    if (result.success) {
      toast.success(result.message);

      // Auto-seleccionar la zona recién creada
      const newZone = zones.find(z => z.name === dto.name);
      if (newZone) {
        dispatch(setSelectedZone(newZone.id));
        dispatch(setSelectedTable(null));
      }
    }
    return result;
  };

  const handleCreateTable = async (dto: any) => {
    const result = await createTable(dto);
    if (result.success) {
      toast.success(result.message);

      // Expandir solo esta zona, cerrando las demás
      setExpandedZones([dto.booZoneId]);

      // Seleccionar la zona de la mesa
      dispatch(setSelectedZone(dto.booZoneId));

      // Marcar la mesa como pendiente de selección
      // El useEffect la seleccionará cuando Redux se actualice
      console.log('🔶 [handleCreateTable] Setting pending table selection:', { zoneId: dto.booZoneId, tableNumber: dto.number });
      setPendingTableSelection({ zoneId: dto.booZoneId, tableNumber: dto.number });
    }
    return result;
  };

  const handleTablePositionChange = (tableId: number, position: { x: number; y: number }) => {
    setLocalTables(prev => {
      const updated = prev.map(table =>
        table.id === tableId ? { ...table, position } : table
      );
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  const handleSavePositions = async () => {
    if (!localTables.length) return;

    setSaving(true);
    const result = await updateTablePositions(localTables);
    setSaving(false);

    if (result.success) {
      toast.success(result.message);
      setHasUnsavedChanges(false);
      originalTablesRef.current = JSON.parse(JSON.stringify(localTables));
    } else {
      toast.error(result.message);
    }
  };

  const handleUnsavedModalCancel = () => {
    setShowUnsavedModal(false);
    setPendingZoneChange(null);
  };

  const handleUnsavedModalDiscard = () => {
    // Descartar cambios: restaurar posiciones originales
    setLocalTables(JSON.parse(JSON.stringify(originalTablesRef.current)));
    setHasUnsavedChanges(false);
    setShowUnsavedModal(false);

    // Proceder con el cambio de zona
    if (pendingZoneChange !== null) {
      setExpandedZones([pendingZoneChange]);
      dispatch(setSelectedZone(pendingZoneChange));
      dispatch(setSelectedTable(null));
      setPendingZoneChange(null);
    }
  };

  const handleUnsavedModalSave = async () => {
    if (!localTables.length) return;

    setSavingModal(true);
    const result = await updateTablePositions(localTables);
    setSavingModal(false);

    if (result.success) {
      toast.success(result.message);
      setHasUnsavedChanges(false);
      originalTablesRef.current = JSON.parse(JSON.stringify(localTables));
      setShowUnsavedModal(false);

      // Proceder con el cambio de zona
      if (pendingZoneChange !== null) {
        setExpandedZones([pendingZoneChange]);
        dispatch(setSelectedZone(pendingZoneChange));
        dispatch(setSelectedTable(null));
        setPendingZoneChange(null);
      }
    } else {
      toast.error(result.message);
    }
  };

  const selectedZone = getSelectedZone();

  // Detectar carga inicial (primera vez que se cargan las zonas)
  const isInitialLoading = loading && zones.length === 0;

  return (
    <div className="page-content">
      <Container fluid>
        <Header
          loading={loading}
          onRefresh={handleRefresh}
          onCreateZone={() => setShowZoneModal(true)}
          onCreateTable={() => setShowTableModal(true)}
        />

        {isInitialLoading ? (
          <Row>
            <Col xs={12}>
              <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mt-3 mb-0">Cargando zonas y mesas...</p>
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xl={4}>
              <ZoneTreeView
                zones={zones}
                selectedZoneId={selectedZoneId}
                selectedTableId={selectedTableId}
                expandedZones={expandedZones}
                onSelectTable={handleSelectTable}
                onToggleZone={handleToggleZone}
                totalZones={getTotalZones()}
                totalTables={getTotalTables()}
              />
            </Col>
            <Col xl={8}>
              <TableEditor
                tables={localTables}
                selectedTableId={selectedTableId}
                zoneName={selectedZone?.name || ''}
                onTableClick={handleSelectTable}
                onTablePositionChange={handleTablePositionChange}
                onSavePositions={handleSavePositions}
                hasUnsavedChanges={hasUnsavedChanges}
                saving={saving}
              />
            </Col>
          </Row>
        )}

        <CreateZoneModal isOpen={showZoneModal} onClose={() => setShowZoneModal(false)} onSubmit={handleCreateZone} />

        <CreateTableModal
          isOpen={showTableModal}
          zones={zones}
          onClose={() => setShowTableModal(false)}
          onSubmit={handleCreateTable}
        />

        <UnsavedChangesModal
          isOpen={showUnsavedModal}
          zoneName={selectedZone?.name || ''}
          saving={savingModal}
          onCancel={handleUnsavedModalCancel}
          onDiscard={handleUnsavedModalDiscard}
          onSave={handleUnsavedModalSave}
        />
      </Container>
    </div>
  );
};

export default TableLayout;
