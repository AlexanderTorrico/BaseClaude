import {
  OrderModel,
  ORDER_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
  PAYMENT_STATUS_CONFIG
} from '../models/OrderModel';

const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString('es-AR')}`;
};

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const printReceipt = (order: OrderModel): void => {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const paymentMethodConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod];
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Recibo - ${order.orderNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          margin: 0 auto;
          padding: 10px;
        }

        .header {
          text-align: center;
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .header h1 {
          font-size: 16px;
          margin-bottom: 5px;
        }

        .header p {
          font-size: 10px;
          color: #666;
        }

        .order-info {
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .order-info .order-number {
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 5px;
        }

        .order-info .date {
          text-align: center;
          font-size: 10px;
          color: #666;
        }

        .status {
          text-align: center;
          padding: 5px;
          margin-bottom: 10px;
          font-weight: bold;
          border: 1px solid #000;
        }

        .customer-info {
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .customer-info h3 {
          font-size: 11px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .customer-info p {
          margin-bottom: 3px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }

        .items-table th {
          font-size: 10px;
          text-align: left;
          border-bottom: 1px solid #000;
          padding: 5px 2px;
        }

        .items-table th:last-child {
          text-align: right;
        }

        .items-table td {
          padding: 5px 2px;
          border-bottom: 1px dotted #ccc;
        }

        .items-table td:last-child {
          text-align: right;
        }

        .items-table .qty {
          text-align: center;
        }

        .totals {
          border-top: 1px solid #000;
          padding-top: 10px;
          margin-top: 10px;
        }

        .totals .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .totals .total-final {
          font-size: 16px;
          font-weight: bold;
          border-top: 1px dashed #000;
          padding-top: 5px;
          margin-top: 5px;
        }

        .payment-info {
          border-top: 1px dashed #000;
          padding-top: 10px;
          margin-top: 10px;
          text-align: center;
        }

        .payment-info .method {
          font-weight: bold;
        }

        .payment-info .status {
          margin-top: 5px;
          font-size: 11px;
        }

        .notes {
          border: 1px dashed #000;
          padding: 10px;
          margin-top: 10px;
          background: #f9f9f9;
        }

        .notes h4 {
          font-size: 10px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .footer {
          text-align: center;
          border-top: 1px dashed #000;
          padding-top: 10px;
          margin-top: 15px;
          font-size: 10px;
        }

        .footer p {
          margin-bottom: 3px;
        }

        @media print {
          body {
            width: 100%;
          }

          @page {
            margin: 0;
            size: 80mm auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RECIBO DE PEDIDO</h1>
        <p>Sistema de Gestión de Pedidos</p>
      </div>

      <div class="order-info">
        <div class="order-number">${order.orderNumber}</div>
        <div class="date">${formatDate(order.createdAt)}</div>
      </div>

      <div class="status">
        Estado: ${statusConfig.label.toUpperCase()}
      </div>

      <div class="customer-info">
        <h3>Datos del Cliente</h3>
        <p><strong>Nombre:</strong> ${order.customer.fullName}</p>
        <p><strong>Teléfono:</strong> ${order.customer.phone}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
        ${order.customer.address ? `<p><strong>Dirección:</strong> ${order.customer.address}</p>` : ''}
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th class="qty">Cant.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td class="qty">${item.quantity}</td>
              <td>${formatCurrency(item.subtotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="row">
          <span>Subtotal:</span>
          <span>${formatCurrency(order.subtotal)}</span>
        </div>
        <div class="row total-final">
          <span>TOTAL:</span>
          <span>${formatCurrency(order.total)}</span>
        </div>
      </div>

      <div class="payment-info">
        <div class="method">${paymentMethodConfig.label}</div>
        <div class="status">${paymentStatusConfig.label}</div>
      </div>

      ${order.notes ? `
        <div class="notes">
          <h4>Notas:</h4>
          <p>${order.notes}</p>
        </div>
      ` : ''}

      <div class="footer">
        <p>¡Gracias por su compra!</p>
        <p>Generado el ${formatDate(new Date())}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  }
};
