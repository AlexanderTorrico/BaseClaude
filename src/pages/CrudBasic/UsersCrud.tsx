import React, { useState, useMemo, ChangeEvent } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import { User } from "@/models";
import TableContainer from "../../components/Common/TableContainer";
import DeleteModal from "../../components/Common/DeleteModal";

// Extended User type for basic CRUD with additional fields
interface BasicCrudUser extends Omit<User, 'status'> {
  department: string;
  phone: string;
  joinDate: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
}

interface UserFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  phone: string;
}

// Datos falsos de usuarios
const generateFakeUsers = (): BasicCrudUser[] => {
  const names = ["Juan Pérez", "María García", "Carlos López", "Ana Rodríguez", "Luis Martínez", "Carmen Sánchez", "José González", "Patricia Fernández", "Miguel Torres", "Laura Ruiz"];
  const emails = ["juan.perez@email.com", "maria.garcia@email.com", "carlos.lopez@email.com", "ana.rodriguez@email.com", "luis.martinez@email.com", "carmen.sanchez@email.com", "jose.gonzalez@email.com", "patricia.fernandez@email.com", "miguel.torres@email.com", "laura.ruiz@email.com"];
  const roles = ["Admin", "Usuario", "Moderador", "Editor"];
  const statuses = ["Activo", "Inactivo", "Pendiente"];
  const departments = ["Ventas", "Marketing", "IT", "RRHH", "Finanzas"];

  return Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: names[index % names.length],
    email: emails[index % emails.length].replace("@", `${index + 1}@`),
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    phone: `+34 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('es-ES'),
  }));
};

const UsersCrud: React.FC = () => {
  const [users, setUsers] = useState<BasicCrudUser[]>(generateFakeUsers());
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BasicCrudUser | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "Usuario",
    department: "IT",
    status: "Activo",
    phone: "",
  });

  const handleUserClick = () => {
    setIsEdit(false);
    setFormData({
      name: "",
      email: "",
      role: "Usuario",
      department: "IT",
      status: "Activo",
      phone: "",
    });
    setModal(true);
  };

  const handleEditUser = (user: BasicCrudUser): void => {
    setIsEdit(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      phone: user.phone,
    });
    setModal(true);
  };

  const handleDeleteUser = (user: BasicCrudUser): void => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const handleSaveUser = (): void => {
    if (!formData.name || !formData.email) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (isEdit) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData }
          : user
      ));
      toast.success("Usuario actualizado correctamente");
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        joinDate: new Date().toLocaleDateString('es-ES'),
      };
      setUsers([...users, newUser]);
      toast.success("Usuario creado correctamente");
    }
    
    setModal(false);
  };

  const confirmDelete = (): void => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setDeleteModal(false);
    toast.success("Usuario eliminado correctamente");
  };

  const getStatusBadge = (status: 'Activo' | 'Inactivo' | 'Pendiente') => {
    const statusColors = {
      "Activo": "success",
      "Inactivo": "danger",
      "Pendiente": "warning"
    };
    return <Badge color={statusColors[status]}>{status}</Badge>;
  };

  const columns = useMemo(() => [
    {
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Nombre",
      accessorKey: "name",
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Rol",
      accessorKey: "role",
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Departamento",
      accessorKey: "department",
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Estado",
      accessorKey: "status",
      enableSorting: true,
      cell: ({ getValue }) => getStatusBadge(getValue()),
    },
    {
      header: "Teléfono",
      accessorKey: "phone",
      enableSorting: false,
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Fecha Ingreso",
      accessorKey: "joinDate",
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            color="primary"
            size="sm"
            onClick={() => handleEditUser(row.original)}
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => handleDeleteUser(row.original)}
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col xs="12">
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Gestión de Usuarios</h4>
                
                <TableContainer
                  columns={columns}
                  data={users}
                  isGlobalFilter={true}
                  isPagination={true}
                  isCustomPageSize={true}
                  isAddButton={true}
                  handleUserClick={handleUserClick}
                  buttonClass="btn-success"
                  buttonName="Agregar Usuario"
                  SearchPlaceholder="Buscar usuarios..."
                  divClassName="table-responsive table-card mb-1"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light text-muted"
                  paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                  pagination="pagination"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal para agregar/editar usuario */}
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg">
          <ModalHeader toggle={() => setModal(!modal)}>
            {isEdit ? "Editar Usuario" : "Agregar Usuario"}
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ingresa el nombre completo"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                      placeholder="Ingresa el email"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="role">Rol</Label>
                    <Input
                      type="select"
                      id="role"
                      value={formData.role}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="Usuario">Usuario</option>
                      <option value="Admin">Admin</option>
                      <option value="Moderador">Moderador</option>
                      <option value="Editor">Editor</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      type="select"
                      id="department"
                      value={formData.department}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, department: e.target.value})}
                    >
                      <option value="IT">IT</option>
                      <option value="Ventas">Ventas</option>
                      <option value="Marketing">Marketing</option>
                      <option value="RRHH">RRHH</option>
                      <option value="Finanzas">Finanzas</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="status">Estado</Label>
                    <Input
                      type="select"
                      id="status"
                      value={formData.status}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, status: e.target.value as 'Activo' | 'Inactivo' | 'Pendiente'})}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Pendiente">Pendiente</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ingresa el teléfono"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModal(false)}>
              Cancelar
            </Button>
            <Button color="primary" onClick={handleSaveUser}>
              {isEdit ? "Actualizar" : "Guardar"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <DeleteModal
          show={deleteModal}
          onDeleteClick={confirmDelete}
          onCloseClick={() => setDeleteModal(false)}
        />
      </Container>
    </React.Fragment>
  );
};

export default UsersCrud;