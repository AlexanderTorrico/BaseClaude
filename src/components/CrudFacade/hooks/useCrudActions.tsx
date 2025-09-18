import React from 'react'
import { useState } from "react";

export const useCrudActions = (data, setData, fields) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);

  const getDefaultFormData = () => {
    const defaults = {};
    Object.entries(fields).forEach(([key, field]) => {
      if (field.defaultValue !== undefined) {
        defaults[key] = field.defaultValue;
      } else if (field.type === 'number') {
        defaults[key] = 0;
      } else if (field.type === 'select' && field.options && field.options.length > 0) {
        defaults[key] = field.options[0].value;
      } else {
        defaults[key] = '';
      }
    });
    return defaults;
  };

  const handleAddItem = () => {
    const defaultData = getDefaultFormData();
    setFormData(defaultData);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEditItem = (item) => {
    setFormData({ ...item });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  const handleSaveItem = () => {
    if (isEditing) {
      setData(prevData => 
        prevData.map(item => item.id === formData.id ? formData : item)
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now()
      };
      setData(prevData => [...prevData, newItem]);
    }
    setModalOpen(false);
    setFormData({});
  };

  const confirmarEliminar = () => {
    if (itemToDelete) {
      setData(prevData => prevData.filter(item => item.id !== itemToDelete.id));
      setSelectedItems(prev => prev.filter(id => id !== itemToDelete.id));
    } else {
      setData(prevData => prevData.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
    setDeleteModal(false);
    setItemToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      setItemToDelete(null);
      setDeleteModal(true);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setFormData({});
      setIsEditing(false);
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (deleteModal) {
      setItemToDelete(null);
    }
  };

  return {
    modalOpen,
    deleteModal,
    selectedItems,
    isEditing,
    formData,
    setSelectedItems,
    setFormData,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem,
    confirmDelete: confirmarEliminar,
    handleBulkDelete,
    toggleModal,
    toggleDeleteModal
  };
};
