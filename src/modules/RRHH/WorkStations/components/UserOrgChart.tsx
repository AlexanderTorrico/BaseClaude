import React, { useState, useMemo } from 'react';
import { Card, CardBody, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import { UserOrgNode } from '@/modules/RRHH/shared/hooks/useSharedUsers';
import UserAvatar from '@/components/Common/UserAvatar';

interface UserOrgChartProps {
  users: UserOrgNode[];
  onSelectNode?: (user: UserOrgNode) => void;
  selectedNodeId?: number;
  onEdit?: (user: UserOrgNode) => void;
  onViewDetails?: (user: UserOrgNode) => void;
}

const UserOrgChart: React.FC<UserOrgChartProps> = ({
  users,
  onSelectNode,
  selectedNodeId,
  onEdit,
  onViewDetails
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set<number>();
    const collectIds = (nodes: UserOrgNode[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allIds.add(node.workStation?.id || node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(users);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Filtrar usuarios recursivamente
  const filterUsers = (nodes: UserOrgNode[], term: string): UserOrgNode[] => {
    if (!term.trim()) return nodes;

    const lowerTerm = term.toLowerCase();

    const filterNode = (node: UserOrgNode): UserOrgNode | null => {
      const matchesSearch =
        node.fullName?.toLowerCase().includes(lowerTerm) ||
        node.email?.toLowerCase().includes(lowerTerm) ||
        node.workStation?.name?.toLowerCase().includes(lowerTerm);

      const filteredChildren = node.children
        ? node.children.map(filterNode).filter(Boolean) as UserOrgNode[]
        : [];

      if (matchesSearch || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren.length > 0 ? filteredChildren : node.children };
      }

      return null;
    };

    return nodes.map(filterNode).filter(Boolean) as UserOrgNode[];
  };

  const filteredUsers = useMemo(() => filterUsers(users, searchTerm), [users, searchTerm]);

  const getLevelColor = (level: number = 0) => {
    const colors = [
      { bg: '#556ee6', text: '#fff' },  // Nivel 0 - Azul
      { bg: '#34c38f', text: '#fff' },  // Nivel 1 - Verde
      { bg: '#f1b44c', text: '#000' },  // Nivel 2 - Amarillo
      { bg: '#50a5f1', text: '#fff' },  // Nivel 3 - Celeste
      { bg: '#f46a6a', text: '#fff' },  // Nivel 4 - Rojo
    ];
    return colors[level % colors.length];
  };

  const renderUserNode = (user: UserOrgNode, level: number = 0): JSX.Element => {
    const nodeId = user.workStation?.id || user.id;
    const hasChildren = user.children && user.children.length > 0;
    const isExpanded = expandedNodes.has(nodeId);
    const isSelected = selectedNodeId === user.id;
    const levelConfig = getLevelColor(user.workStation?.level || level);
    const indentPx = level * 20; // 20px por nivel de indentación

    return (
      <div key={user.id} className="user-node-wrapper">
        <div
          className={`user-node ${isSelected ? 'selected' : ''}`}
          style={{
            marginLeft: `${indentPx}px`,
            borderLeft: `3px solid ${levelConfig.bg}`,
            backgroundColor: isSelected ? '#f0f7ff' : 'transparent',
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            cursor: 'pointer'
          }}
          onClick={() => onSelectNode && onSelectNode(user)}
        >
          <div className="d-flex align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
            {/* Botón expand/collapse */}
            {hasChildren ? (
              <button
                className="btn btn-sm p-0"
                style={{
                  width: '20px',
                  minWidth: '20px',
                  height: '20px',
                  border: 'none',
                  background: 'transparent',
                  color: levelConfig.bg,
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(nodeId);
                }}
              >
                <i className={`mdi ${isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
              </button>
            ) : (
              <div style={{ width: '20px', minWidth: '20px', flexShrink: 0 }}></div>
            )}

            {/* Avatar del usuario */}
            <div style={{ flexShrink: 0 }}>
              <UserAvatar
                fullName={user.fullName}
                avatar={user.avatar}
                size="sm"
              />
            </div>

            {/* Información del usuario */}
            <div className="flex-grow-1" style={{ minWidth: 0, overflow: 'hidden' }}>
              <div
                className="fw-medium"
                style={{
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={user.fullName}
              >
                {user.fullName}
              </div>
              <div
                className="text-muted"
                style={{
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={user.workStation?.name}
              >
                {user.workStation?.name || 'Sin puesto'}
              </div>
            </div>

            {/* Contador de personas a cargo */}
            <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '11px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <i className="mdi mdi-account-group"></i>
              {user.children?.length || 0}
            </span>

            {/* Badge de nivel */}
            <Badge
              style={{
                backgroundColor: levelConfig.bg,
                color: levelConfig.text,
                fontSize: '9px',
                padding: '2px 6px',
                flexShrink: 0
              }}
              pill
            >
              N{user.workStation?.level || level}
            </Badge>

            {/* Menú de acciones */}
            <UncontrolledDropdown>
              <DropdownToggle
                tag="button"
                className="btn btn-sm btn-link text-muted p-0"
                style={{ fontSize: '16px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <i className="mdi mdi-dots-vertical"></i>
              </DropdownToggle>
              <DropdownMenu end>
                {onViewDetails && (
                  <DropdownItem onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(user);
                  }}>
                    <i className="mdi mdi-eye text-info me-2"></i>
                    Ver Detalles
                  </DropdownItem>
                )}
                {onEdit && (
                  <DropdownItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}>
                    <i className="mdi mdi-pencil text-warning me-2"></i>
                    Editar
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>

        {/* Hijos */}
        {hasChildren && isExpanded && (
          <div className="user-node-children">
            {user.children!.map(child => renderUserNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-100">
      <CardBody className="p-0">
        {/* Header */}
        <div className="p-3 border-bottom bg-light">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">
              <i className="mdi mdi-sitemap me-2"></i>
              Organigrama de Personal
            </h6>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={expandAll}
                title="Expandir todo"
              >
                <i className="mdi mdi-arrow-expand-all"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={collapseAll}
                title="Contraer todo"
              >
                <i className="mdi mdi-arrow-collapse-all"></i>
              </button>
            </div>
          </div>
          {/* Filtro de búsqueda */}
          <div className="position-relative">
            <i className="mdi mdi-magnify position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }}></i>
            <Input
              type="text"
              placeholder="Buscar por nombre, correo o puesto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-sm"
              style={{ paddingLeft: '32px' }}
            />
          </div>
        </div>

        {/* Árbol */}
        <div
          className="user-org-chart"
          style={{
            height: 'calc(100vh - 400px)',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map(root => renderUserNode(root, 0))
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="mdi mdi-account-group-outline" style={{ fontSize: '48px' }}></i>
              <div className="mt-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay usuarios con puestos asignados'}
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default UserOrgChart;
