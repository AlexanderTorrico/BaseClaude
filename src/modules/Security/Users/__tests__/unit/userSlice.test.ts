import { describe, it, expect, beforeEach } from 'vitest';
import userSlice, {
  setLoading,
  setUsers,
  setError,
  clearUsers,
  addUser,
  updateUser,
  removeUser,
} from '../../slices/userSlice';
import { mockUserModel, mockInitialReduxState, createMockUser } from '../fixtures/mockUsers';

/**
 * Unit Tests para usersSice (Redux Slice)
 * Prueba los reducers y acciones de Redux
 */

describe('usersSice', () => {
  const initialState = mockInitialReduxState;

  describe('setLoading', () => {
    it('debe cambiar el estado de loading a true', () => {
      const state = userSlice(initialState, setLoading(true));

      expect(state.loading).toBe(true);
    });

    it('debe cambiar el estado de loading a false', () => {
      const loadingState = { ...initialState, loading: true };
      const state = userSlice(loadingState, setLoading(false));

      expect(state.loading).toBe(false);
    });
  });

  describe('setUsers', () => {
    it('debe actualizar la lista de usuarios', () => {
      const users = [mockUserModel];
      const state = userSlice(initialState, setUsers(users));

      expect(state.list).toEqual(users);
      expect(state.list).toHaveLength(1);
    });

    it('debe limpiar el loading y error al setear usuarios', () => {
      const stateWithErrors = {
        list: [],
        loading: true,
        error: 'Some error',
      };

      const state = userSlice(stateWithErrors, setUsers([mockUserModel]));

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('debe reemplazar la lista existente con la nueva', () => {
      const existingState = {
        list: [mockUserModel],
        loading: false,
        error: null,
      };

      const newUser = createMockUser({ id: 2, name: 'María' });
      const state = userSlice(existingState, setUsers([newUser]));

      expect(state.list).toHaveLength(1);
      expect(state.list[0].id).toBe(2);
    });
  });

  describe('setError', () => {
    it('debe establecer un mensaje de error', () => {
      const errorMessage = 'Error al cargar usuarios';
      const state = userSlice(initialState, setError(errorMessage));

      expect(state.error).toBe(errorMessage);
    });

    it('debe desactivar loading al setear error', () => {
      const loadingState = { ...initialState, loading: true };
      const state = userSlice(loadingState, setError('Error'));

      expect(state.loading).toBe(false);
    });
  });

  describe('clearUsers', () => {
    it('debe limpiar todos los datos del estado', () => {
      const filledState = {
        list: [mockUserModel],
        loading: true,
        error: 'Some error',
      };

      const state = userSlice(filledState, clearUsers());

      expect(state.list).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('addUser', () => {
    it('debe agregar un usuario a la lista', () => {
      const state = userSlice(initialState, addUser(mockUserModel));

      expect(state.list).toHaveLength(1);
      expect(state.list[0]).toEqual(mockUserModel);
    });

    it('debe agregar un usuario sin afectar los existentes', () => {
      const existingState = {
        list: [mockUserModel],
        loading: false,
        error: null,
      };

      const newUser = createMockUser({ id: 2, name: 'María' });
      const state = userSlice(existingState, addUser(newUser));

      expect(state.list).toHaveLength(2);
      expect(state.list[0].id).toBe(1);
      expect(state.list[1].id).toBe(2);
    });
  });

  describe('updateUser', () => {
    it('debe actualizar un usuario existente', () => {
      const existingState = {
        list: [mockUserModel],
        loading: false,
        error: null,
      };

      const updatedUser = createMockUser({
        name: 'Juan Carlos',
        fullName: 'Juan Carlos Pérez',
      });

      const state = userSlice(existingState, updateUser(updatedUser));

      expect(state.list[0].name).toBe('Juan Carlos');
      expect(state.list[0].fullName).toBe('Juan Carlos Pérez');
    });

    it('no debe modificar la lista si el usuario no existe', () => {
      const existingState = {
        list: [mockUserModel],
        loading: false,
        error: null,
      };

      const nonExistentUser = createMockUser({ id: 999 });
      const state = userSlice(existingState, updateUser(nonExistentUser));

      expect(state.list).toHaveLength(1);
      expect(state.list[0].id).toBe(1);
    });
  });

  describe('removeUser', () => {
    it('debe eliminar un usuario por ID', () => {
      const user2 = createMockUser({ id: 2, name: 'María' });
      const existingState = {
        list: [mockUserModel, user2],
        loading: false,
        error: null,
      };

      const state = userSlice(existingState, removeUser(1));

      expect(state.list).toHaveLength(1);
      expect(state.list[0].id).toBe(2);
    });

    it('no debe modificar la lista si el ID no existe', () => {
      const existingState = {
        list: [mockUserModel],
        loading: false,
        error: null,
      };

      const state = userSlice(existingState, removeUser(999));

      expect(state.list).toHaveLength(1);
      expect(state.list[0].id).toBe(1);
    });

    it('debe manejar correctamente la eliminación del último usuario', () => {
      const existingState = {
        list: [mockUserModel],
        loading: false,
        error: null,
      };

      const state = userSlice(existingState, removeUser(1));

      expect(state.list).toEqual([]);
      expect(state.list).toHaveLength(0);
    });
  });
});
