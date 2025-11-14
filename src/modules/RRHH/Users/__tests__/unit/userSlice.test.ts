import { describe, it, expect } from 'vitest';
import userReducer, {
  setUsers,
  clearUsers,
  addUser,
  updateUser,
  removeUser,
  setCurrentView,
} from '../../slices/userSlice';
import { mockUserModel, createMockUser } from '../fixtures/mockUsers';

/**
 * Unit Tests para userSlice (Redux Slice)
 * Prueba los reducers y acciones de Redux
 *
 * NOTA: Loading y error NO están en el slice, se manejan en ServiceWrapper
 */

describe('userSlice', () => {
  const initialState = {
    list: [],
    currentView: '0',
  };

  describe('setUsers', () => {
    it('debe establecer la lista de usuarios', () => {
      const users = [mockUserModel];

      const newState = userReducer(initialState, setUsers(users));

      expect(newState.list).toEqual(users);
      expect(newState.list).toHaveLength(1);
    });

    it('debe reemplazar la lista existente con la nueva', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };
      const newUser = createMockUser({ id: 2, name: 'María' });

      const newState = userReducer(existingState, setUsers([newUser]));

      expect(newState.list).toHaveLength(1);
      expect(newState.list[0].id).toBe(2);
    });

    it('debe permitir establecer lista vacía', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };

      const newState = userReducer(existingState, setUsers([]));

      expect(newState.list).toEqual([]);
    });
  });

  describe('clearUsers', () => {
    it('debe limpiar la lista de usuarios', () => {
      const stateWithUsers = {
        list: [mockUserModel],
        currentView: '0',
      };

      const newState = userReducer(stateWithUsers, clearUsers());

      expect(newState.list).toEqual([]);
    });

    it('debe mantener currentView al limpiar', () => {
      const stateWithUsers = {
        list: [mockUserModel],
        currentView: '1',
      };

      const newState = userReducer(stateWithUsers, clearUsers());

      expect(newState.list).toEqual([]);
      expect(newState.currentView).toBe('1');
    });
  });

  describe('addUser', () => {
    it('debe agregar un usuario a lista vacía', () => {
      const newState = userReducer(initialState, addUser(mockUserModel));

      expect(newState.list).toHaveLength(1);
      expect(newState.list[0]).toEqual(mockUserModel);
    });

    it('debe agregar un usuario sin afectar los existentes', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };
      const newUser = createMockUser({ id: 2, name: 'María' });

      const newState = userReducer(existingState, addUser(newUser));

      expect(newState.list).toHaveLength(2);
      expect(newState.list[0].id).toBe(1);
      expect(newState.list[1].id).toBe(2);
    });
  });

  describe('updateUser', () => {
    it('debe actualizar un usuario existente', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };
      const updatedUser = createMockUser({
        id: 1,
        name: 'Juan Carlos',
        fullName: 'Juan Carlos Pérez',
      });

      const newState = userReducer(existingState, updateUser(updatedUser));

      expect(newState.list[0].name).toBe('Juan Carlos');
      expect(newState.list[0].fullName).toBe('Juan Carlos Pérez');
    });

    it('no debe modificar la lista si el usuario no existe', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };
      const nonExistentUser = createMockUser({ id: 999 });

      const newState = userReducer(existingState, updateUser(nonExistentUser));

      expect(newState.list).toHaveLength(1);
      expect(newState.list[0].id).toBe(1);
      expect(newState.list[0]).toEqual(mockUserModel);
    });

    it('debe actualizar solo el usuario correcto en lista múltiple', () => {
      const user2 = createMockUser({ id: 2, name: 'María' });
      const existingState = {
        list: [mockUserModel, user2],
        currentView: '0',
      };
      const updatedUser = createMockUser({
        id: 2,
        name: 'María García',
      });

      const newState = userReducer(existingState, updateUser(updatedUser));

      expect(newState.list).toHaveLength(2);
      expect(newState.list[0].name).toBe('Juan'); // No cambió
      expect(newState.list[1].name).toBe('María García'); // Cambió
    });
  });

  describe('removeUser', () => {
    it('debe eliminar un usuario por ID', () => {
      const user2 = createMockUser({ id: 2, name: 'María' });
      const existingState = {
        list: [mockUserModel, user2],
        currentView: '0',
      };

      const newState = userReducer(existingState, removeUser(1));

      expect(newState.list).toHaveLength(1);
      expect(newState.list[0].id).toBe(2);
    });

    it('no debe modificar la lista si el ID no existe', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };

      const newState = userReducer(existingState, removeUser(999));

      expect(newState.list).toHaveLength(1);
      expect(newState.list[0].id).toBe(1);
    });

    it('debe poder eliminar el último usuario', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };

      const newState = userReducer(existingState, removeUser(1));

      expect(newState.list).toEqual([]);
      expect(newState.list).toHaveLength(0);
    });
  });

  describe('setCurrentView', () => {
    it('debe actualizar currentView', () => {
      const newState = userReducer(initialState, setCurrentView('1'));

      expect(newState.currentView).toBe('1');
    });

    it('debe cambiar de vista tabla a cards', () => {
      const newState = userReducer(initialState, setCurrentView('1'));

      expect(newState.currentView).toBe('1');
    });

    it('debe cambiar de vista cards a tabla', () => {
      const existingState = {
        list: [],
        currentView: '1',
      };

      const newState = userReducer(existingState, setCurrentView('0'));

      expect(newState.currentView).toBe('0');
    });

    it('debe mantener la lista al cambiar vista', () => {
      const existingState = {
        list: [mockUserModel],
        currentView: '0',
      };

      const newState = userReducer(existingState, setCurrentView('1'));

      expect(newState.currentView).toBe('1');
      expect(newState.list).toHaveLength(1);
      expect(newState.list[0]).toEqual(mockUserModel);
    });
  });
});
