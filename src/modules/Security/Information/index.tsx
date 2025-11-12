import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import PagesGallery from './components/PagesGallery';
import { PageModel } from './models/PageModel';
import { PaymentGatewayModel } from '../PaymentGateway/models/PaymentGatewayModel';

const Information: React.FC = () => {
  const [pages, setPages] = useState<PageModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayModel[]>([]);

  useEffect(() => {
    // Simulated API call - Replace with your actual API call
    const fetchPages = async () => {
      try {
        setLoading(true);
        // Example: const response = await fetch('/api/pages');
        // const data = await response.json();

        // Mock data for demonstration
        const mockData: PageModel[] = [
          {
            id: 1,
            name: "testTemplate",
            score: 0,
            question_score: 1,
            view_key: "i49Nphh9-blq-Vs",
            rut_name: "",
            image: "/screenshots/6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b.png",
            font: "fontCenturyGothic",
            palette: "{\"tx\": \"#FFFFFF\",\"tx2\": \"#a2a2a2\",\"ac\": \"#ffbc1f\",\"pr\": \"#ffbc1f\",\"bg\": \"#1D1F21\",\"bg2\": \"#2c2e30\"}",
            palette_history: "[]",
            active_auto_save: 0,
            conf: [],
            user_id: 1,
            module_id: null,
            gbl_company_id: 1,
            created_at: "2025-11-10T13:21:13.000000Z",
            updated_at: "2025-11-10T13:21:13.000000Z",
            count: [],
            ecommerce_enabled: false,
            payment_gateway_id: null
          }
        ];

        setPages(mockData);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentGateways = async () => {
      try {
        // Example: const response = await fetch('/api/payment-gateways');
        // const data = await response.json();

        // Mock data for demonstration
        const mockGateways: PaymentGatewayModel[] = [
          {
            id: 1,
            name: "PayPal",
            code: "paypal",
            description: "Acepta pagos con PayPal de forma segura y rápida",
            enabled: true,
            icon: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
            category: "wallet",
            countries: ["US", "CA", "MX", "BR", "AR", "CL"],
            currencies: ["USD", "EUR", "MXN", "BRL", "ARS", "CLP"],
            config: {
              environment: "production",
              apiKey: "AXxxxxxxxxxxxxxxxxxxxx",
              secretKey: "ELxxxxxxxxxxxxxxxxxxxx"
            },
            fees: {
              percentage: 3.49,
              fixed: 0.49,
              currency: "USD"
            },
            processingTime: "Instantáneo",
            supportedPaymentMethods: ["paypal", "credit-card", "debit-card"],
            popularity: 5
          },
          {
            id: 2,
            name: "Stripe",
            code: "stripe",
            description: "Plataforma de pagos completa para negocios en línea",
            enabled: true,
            icon: "https://cdn.brandfolder.io/KGT2DTA4/as/8q2r2k-5vqnvw-k2kpw/Stripe_icon_-_square.svg",
            category: "card",
            countries: ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE"],
            currencies: ["USD", "EUR", "MXN", "BRL", "ARS", "CLP", "COP", "PEN"],
            config: {
              environment: "production",
              apiKey: "pk_live_xxxxxxxxxxxxxxxxxxxx",
              secretKey: "sk_live_xxxxxxxxxxxxxxxxxxxx"
            },
            fees: {
              percentage: 2.9,
              fixed: 0.3,
              currency: "USD"
            },
            processingTime: "1-2 días hábiles",
            supportedPaymentMethods: ["visa", "mastercard", "amex", "discover"],
            popularity: 5
          },
          {
            id: 3,
            name: "MercadoPago",
            code: "mercadopago",
            description: "Solución de pagos líder en América Latina",
            enabled: false,
            icon: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadopago/logo__large_plus.png",
            category: "wallet",
            countries: ["AR", "BR", "CL", "CO", "MX", "PE", "UY"],
            currencies: ["ARS", "BRL", "CLP", "COP", "MXN", "PEN", "UYU"],
            config: {
              environment: "sandbox",
              apiKey: "TEST-xxxxxxxxxxxxxxxxxxxx",
              secretKey: "TEST-xxxxxxxxxxxxxxxxxxxx"
            },
            fees: {
              percentage: 4.99,
              fixed: 0,
              currency: "USD"
            },
            processingTime: "Instantáneo a 24 horas",
            supportedPaymentMethods: ["mercadopago", "credit-card", "debit-card", "bank-transfer"],
            popularity: 4
          }
        ];

        setPaymentGateways(mockGateways);
      } catch (error) {
        console.error('Error fetching payment gateways:', error);
      }
    };

    fetchPages();
    fetchPaymentGateways();
  }, []);

  const handlePageClick = (page: PageModel) => {
    console.log('Page clicked:', page);
    // Add your navigation logic here
    // Example: navigate(`/page/${page.view_key}`);
  };

  const handleEcommerceChange = (pageId: number, enabled: boolean, gatewayId?: number | null) => {
    console.log('Ecommerce settings changed:', { pageId, enabled, gatewayId });

    // Update local state
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === pageId
          ? { ...page, ecommerce_enabled: enabled, payment_gateway_id: gatewayId ?? null }
          : page
      )
    );

    // Here you would typically make an API call to save the changes
    // Example:
    // await fetch(`/api/pages/${pageId}/ecommerce`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ecommerce_enabled: enabled, payment_gateway_id: gatewayId ?? null })
    // });
  };

  return (
    <div className="page-content">
      <Container fluid style={{ overflowX: 'hidden' }}>
        <PagesGallery
          pages={pages}
          loading={loading}
          onPageClick={handlePageClick}
          paymentGateways={paymentGateways}
          onEcommerceChange={handleEcommerceChange}
        />
      </Container>
    </div>
  );
};

export default Information;
