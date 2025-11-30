import React, { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Badge, Button } from 'reactstrap';
import { TableModel, Position } from '../models/TableLayoutModel';

interface TableEditorProps {
  tables: TableModel[];
  selectedTableId: number | null;
  zoneName: string;
  onTableClick: (tableId: number) => void;
  onTablePositionChange: (tableId: number, position: Position) => void;
  onSavePositions: () => void;
  hasUnsavedChanges: boolean;
  saving: boolean;
}

const TableEditor: React.FC<TableEditorProps> = ({
  tables,
  selectedTableId,
  zoneName,
  onTableClick,
  onTablePositionChange,
  onSavePositions,
  hasUnsavedChanges,
  saving,
}) => {
  const [draggingTableId, setDraggingTableId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [localPositions, setLocalPositions] = useState<Map<number, Position>>(new Map());
  const canvasRef = useRef<HTMLDivElement>(null);
  const finalPositionRef = useRef<{ tableId: number; position: Position } | null>(null);
  const previousTablesRef = useRef<string>('');

  const CANVAS_SIZE = 620;
  const TABLE_SIZE = 60;

  useEffect(() => {
    const tablesKey = tables.map(t => `${t.id}-${t.position.x}-${t.position.y}`).join(',');

    if (tablesKey !== previousTablesRef.current) {
      const initialPositions = new Map<number, Position>();
      tables.forEach(table => {
        initialPositions.set(table.id, { ...table.position });
      });
      setLocalPositions(initialPositions);
      previousTablesRef.current = tablesKey;
    }
  }, [tables]);

  const getTableColor = (shape: string): string => {
    switch (shape) {
      case 'circle':
        return '#10b981';
      case 'rectangle':
        return '#f59e0b';
      case 'square':
      default:
        return '#3b82f6';
    }
  };

  const handleStart = (clientX: number, clientY: number, table: TableModel) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const currentPos = localPositions.get(table.id) || table.position;

    setDragOffset({
      x: x - currentPos.x,
      y: y - currentPos.y,
    });
    setDraggingTableId(table.id);
    onTableClick(table.id);
  };

  const handleMouseDown = (e: React.MouseEvent, table: TableModel) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY, table);
  };

  const handleTouchStart = (e: React.TouchEvent, table: TableModel) => {
    if (e.touches.length > 0) {
      e.stopPropagation();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY, table);
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (draggingTableId === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Encontrar la mesa que se está arrastrando para conocer su forma
    const draggingTable = tables.find(t => t.id === draggingTableId);
    if (!draggingTable) return;

    // Ajustar el ancho según la forma
    const tableWidth = draggingTable.shape === 'rectangle' ? TABLE_SIZE * 2 : TABLE_SIZE;

    const rect = canvas.getBoundingClientRect();
    let newX = clientX - rect.left - dragOffset.x;
    let newY = clientY - rect.top - dragOffset.y;

    // Límites de arrastre considerando el ancho de la mesa
    newX = Math.max(0, Math.min(newX, CANVAS_SIZE - tableWidth));
    newY = Math.max(0, Math.min(newY, CANVAS_SIZE - TABLE_SIZE));

    const newPosition = { x: Math.round(newX), y: Math.round(newY) };

    setLocalPositions(prev => {
      const updated = new Map(prev);
      updated.set(draggingTableId, newPosition);
      return updated;
    });

    finalPositionRef.current = { tableId: draggingTableId, position: newPosition };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (draggingTableId !== null && e.touches.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleEnd = () => {
    if (finalPositionRef.current) {
      const { tableId, position } = finalPositionRef.current;
      onTablePositionChange(tableId, position);
      finalPositionRef.current = null;
    }
    setDraggingTableId(null);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleEnd();
    };

    const handleGlobalTouchEnd = () => {
      handleEnd();
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      handleTouchMove(e);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalTouchEnd);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [draggingTableId, onTablePositionChange]);

  return (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            <h5 className="mb-0">
              <i className="mdi mdi-drag me-2 text-primary"></i>
              Editor de Posiciones
            </h5>
            {zoneName && (
              <Badge color="primary" className="font-size-12">
                <i className="mdi mdi-map-marker me-1"></i>
                {zoneName}
              </Badge>
            )}
          </div>
          {zoneName && tables.length > 0 && (
            <Button
              color={hasUnsavedChanges ? 'success' : 'light'}
              size="sm"
              onClick={onSavePositions}
              disabled={!hasUnsavedChanges || saving}
            >
              {saving ? (
                <>
                  <i className="mdi mdi-loading mdi-spin me-1"></i>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="mdi mdi-content-save me-1"></i>
                  {hasUnsavedChanges ? `Guardar Posiciones (${tables.length})` : 'Sin cambios'}
                </>
              )}
            </Button>
          )}
        </div>

        <div className="mb-3">
          <div className="d-flex gap-3 font-size-12">
            <div className="d-flex align-items-center gap-1">
              <div style={{ width: 16, height: 16, backgroundColor: '#3b82f6' }} className="rounded"></div>
              <span className="text-muted">Cuadrada</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <div style={{ width: 16, height: 16, backgroundColor: '#10b981', borderRadius: '50%' }}></div>
              <span className="text-muted">Circular</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <div style={{ width: 32, height: 16, backgroundColor: '#f59e0b' }} className="rounded"></div>
              <span className="text-muted">Rectangular</span>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '100%',
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: '750px',
          }}
        >
          {!zoneName || tables.length === 0 ? (
            <div
              className="d-flex align-items-center justify-content-center text-muted"
              style={{
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                minWidth: CANVAS_SIZE,
                minHeight: CANVAS_SIZE,
                border: '2px dashed #e5e7eb',
                borderRadius: 8,
              }}
            >
              <div className="text-center">
                <i className="mdi mdi-table-furniture-variant font-size-24 d-block mb-2"></i>
                {!zoneName ? 'Selecciona una zona para ver las mesas' : 'Esta zona no tiene mesas'}
              </div>
            </div>
          ) : (
            <div
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                position: 'relative',
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                minWidth: CANVAS_SIZE,
                minHeight: CANVAS_SIZE,
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                backgroundColor: '#f9fafb',
                cursor: draggingTableId ? 'grabbing' : 'default',
                overflow: 'hidden',
              }}
            >
              {tables.map(table => {
                const isSelected = selectedTableId === table.id;
                const isDragging = draggingTableId === table.id;
                const position = localPositions.get(table.id) || table.position;

                // Mesas rectangulares son el doble de anchas
                const tableWidth = table.shape === 'rectangle' ? TABLE_SIZE * 2 : TABLE_SIZE;
                const tableHeight = TABLE_SIZE;

                return (
                  <div
                    key={table.id}
                    onMouseDown={e => handleMouseDown(e, table)}
                    onTouchStart={e => handleTouchStart(e, table)}
                    onClick={() => onTableClick(table.id)}
                    style={{
                      position: 'absolute',
                      left: position.x,
                      top: position.y,
                      width: tableWidth,
                      height: tableHeight,
                      backgroundColor: getTableColor(table.shape),
                      borderRadius: table.shape === 'circle' ? '50%' : 4,
                      border: isSelected ? '3px solid #1e293b' : '2px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      boxShadow: isDragging
                        ? '0 8px 16px rgba(0,0,0,0.2)'
                        : isSelected
                          ? '0 4px 8px rgba(0,0,0,0.15)'
                          : '0 2px 4px rgba(0,0,0,0.1)',
                      transition: isDragging ? 'none' : 'box-shadow 0.2s',
                      zIndex: isDragging ? 1000 : isSelected ? 10 : 1,
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 'bold',
                      userSelect: 'none',
                      willChange: isDragging ? 'transform' : 'auto',
                      touchAction: 'none',
                    }}
                  >
                    <div>{table.number}</div>
                    <div style={{ fontSize: 9 }}>
                      <i className="mdi mdi-account-multiple"></i> {table.capacity}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {zoneName && tables.length > 0 && (
          <div className="mt-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="font-size-12 text-muted">
                <i className="mdi mdi-information-outline me-1"></i>
                Arrastra las mesas para cambiar su posición. Recuerda guardar los cambios.
              </div>
              {hasUnsavedChanges && (
                <Badge color="warning" className="font-size-11">
                  <i className="mdi mdi-alert-circle-outline me-1"></i>
                  Cambios sin guardar
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TableEditor;
