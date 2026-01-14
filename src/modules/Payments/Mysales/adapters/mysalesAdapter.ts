import {
  SaleTransactionModel,
  CustomerInfo,
  PaymentMethodInfo,
  PaymentAccountInfo,
  PageInfo,
  TransactionAmounts,
  TransactionStatus
} from '../models/MysalesModel';

export const adaptTransactionResponseToModel = (apiData: any): SaleTransactionModel => {
  return {
    id: apiData.id,
    transactionId: apiData.transaction_id,
    orderReference: apiData.order_reference,
    status: apiData.status as TransactionStatus,
    amounts: {
      gross: apiData.amounts?.gross || apiData.gross_amount || 0,
      commission: apiData.amounts?.commission || apiData.commission_amount || 0,
      net: apiData.amounts?.net || apiData.net_amount || 0,
      currency: apiData.amounts?.currency || apiData.currency || 'EUR'
    } as TransactionAmounts,
    customer: {
      name: apiData.customer?.name || apiData.customer_name || '',
      email: apiData.customer?.email || apiData.customer_email || '',
      phone: apiData.customer?.phone || apiData.customer_phone
    } as CustomerInfo,
    paymentMethod: {
      id: apiData.payment_method?.id || apiData.payment_method_id,
      name: apiData.payment_method?.name || apiData.payment_method_name || '',
      type: apiData.payment_method?.type || apiData.payment_method_type,
      provider: apiData.payment_method?.provider || apiData.payment_method_provider,
      icon: apiData.payment_method?.icon || 'mdi-credit-card',
      color: apiData.payment_method?.color || '#666666'
    } as PaymentMethodInfo,
    paymentAccount: {
      id: apiData.payment_account?.id || apiData.payment_account_id,
      alias: apiData.payment_account?.alias || apiData.payment_account_alias || '',
      description: apiData.payment_account?.description || apiData.payment_account_description
    } as PaymentAccountInfo,
    page: {
      id: apiData.page?.id || apiData.page_id,
      name: apiData.page?.name || apiData.page_name || '',
      domain: apiData.page?.domain || apiData.page_domain || '',
      image: apiData.page?.image || apiData.page_image
    } as PageInfo,
    description: apiData.description,
    createdAt: apiData.created_at,
    completedAt: apiData.completed_at,
    metadata: apiData.metadata
  };
};

export const adaptTransactionArrayToModels = (apiDataArray: any[]): SaleTransactionModel[] => {
  return apiDataArray.map(adaptTransactionResponseToModel);
};
