import { useState, useCallback, useRef, useEffect } from 'react';
import { usePaymentTest } from './usePaymentTest';
import { IPaymentTestService } from '../services/IPaymentTestService';
import { PaymentTestApiService, createPaymentTestApiService } from '../services/PaymentTestApiService';
import {
  CreateTestOrderDto,
  CaptureOrderDto,
  TransactionFilters,
  CreateOrderApiResponse,
} from '../models/PaymentTestModel';
import { adaptCreateOrderToTransaction, adaptCaptureToTransaction } from '../adapters/paymentTestAdapter';

/**
 * Hook para operaciones de fetch de pruebas de pago
 */
export const usePaymentTestFetch = (companyId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef<IPaymentTestService | null>(null);

  const {
    setTransactions,
    addTransaction,
    updateTransaction,
    setPayPalConfigs,
    setStats,
    findTransactionByPaypalOrderId,
    currentTransaction,
    setCurrentTransaction,
  } = usePaymentTest();

  // Inicializar servicio
  useEffect(() => {
    if (companyId) {
      serviceRef.current = createPaymentTestApiService(companyId);
    }
  }, [companyId]);

  /**
   * Cargar configuraciones de PayPal
   */
  const fetchConfigs = useCallback(async () => {
    if (!serviceRef.current) return;

    setError(null);
    const res = await serviceRef.current.getPayPalConfigs(setLoading);

    if (res.status >= 200 && res.status < 300 && res.data) {
      setPayPalConfigs(res.data);
    } else {
      setError(res.message || 'Error al cargar configuraciones');
    }
  }, [setPayPalConfigs]);

  /**
   * Cargar historial de transacciones
   */
  const fetchTransactions = useCallback(async (filters?: TransactionFilters) => {
    if (!serviceRef.current) return;

    setError(null);
    const res = await serviceRef.current.getTransactions(filters, setLoading);

    if (res.status >= 200 && res.status < 300 && res.data) {
      setTransactions(res.data);
    } else {
      setError(res.message || 'Error al cargar transacciones');
    }
  }, [setTransactions]);

  /**
   * Cargar estadísticas
   */
  const fetchStats = useCallback(async () => {
    if (!serviceRef.current) return;

    setError(null);
    const res = await serviceRef.current.getStats(setLoading);

    if (res.status >= 200 && res.status < 300 && res.data) {
      setStats(res.data);
    } else {
      setError(res.message || 'Error al cargar estadísticas');
    }
  }, [setStats]);

  /**
   * Crear orden de prueba
   */
  const createOrder = useCallback(async (
    amount: number,
    currency: string,
    description?: string
  ): Promise<CreateOrderApiResponse | null> => {
    if (!serviceRef.current) return null;

    setError(null);
    const dto: CreateTestOrderDto = {
      gbl_company_id: companyId,
      amount,
      currency,
      description,
    };

    const res = await serviceRef.current.createTestOrder(dto, setLoading);

    if (res.status >= 200 && res.status < 300 && res.data) {
      // Crear transacción local
      const transaction = adaptCreateOrderToTransaction(res.data, companyId, amount, currency, description);
      addTransaction(transaction);
      setCurrentTransaction(transaction);
      return res.data;
    } else {
      setError(res.message || 'Error al crear orden');
      return null;
    }
  }, [companyId, addTransaction, setCurrentTransaction]);

  /**
   * Capturar orden
   */
  const captureOrder = useCallback(async (paypalOrderId: string): Promise<boolean> => {
    if (!serviceRef.current) return false;

    setError(null);
    const dto: CaptureOrderDto = {
      paypal_order_id: paypalOrderId,
      gbl_company_id: companyId,
    };

    const res = await serviceRef.current.captureOrder(dto, setLoading);

    if (res.status >= 200 && res.status < 300 && res.data) {
      // Actualizar transacción local
      const existing = findTransactionByPaypalOrderId(paypalOrderId);
      if (existing) {
        const updated = adaptCaptureToTransaction(res.data, existing);
        updateTransaction(updated);
        setCurrentTransaction(updated);
      }
      return true;
    } else {
      setError(res.message || 'Error al capturar orden');
      return false;
    }
  }, [companyId, findTransactionByPaypalOrderId, updateTransaction, setCurrentTransaction]);

  /**
   * Consultar estado de orden
   */
  const checkOrderStatus = useCallback(async (paypalOrderId: string): Promise<boolean> => {
    if (!serviceRef.current) return false;

    setError(null);
    const res = await serviceRef.current.getOrderStatus(
      { paypal_order_id: paypalOrderId, gbl_company_id: companyId },
      setLoading
    );

    if (res.status >= 200 && res.status < 300 && res.data) {
      // Actualizar transacción si cambió el estado
      const existing = findTransactionByPaypalOrderId(paypalOrderId);
      if (existing && existing.status !== res.data.local_status) {
        const updated = {
          ...existing,
          status: res.data.local_status,
          approvedAt: res.data.local_status === 'approved' ? new Date().toISOString() : existing.approvedAt,
        };
        updateTransaction(updated);
        if (currentTransaction?.paypalOrderId === paypalOrderId) {
          setCurrentTransaction(updated);
        }
      }
      return true;
    } else {
      setError(res.message || 'Error al consultar estado');
      return false;
    }
  }, [companyId, findTransactionByPaypalOrderId, updateTransaction, currentTransaction, setCurrentTransaction]);

  /**
   * Cargar todos los datos iniciales
   */
  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchConfigs(),
      fetchTransactions(),
      fetchStats(),
    ]);
  }, [fetchConfigs, fetchTransactions, fetchStats]);

  return {
    loading,
    error,
    fetchAll,
    fetchConfigs,
    fetchTransactions,
    fetchStats,
    createOrder,
    captureOrder,
    checkOrderStatus,
    clearError: () => setError(null),
  };
};
