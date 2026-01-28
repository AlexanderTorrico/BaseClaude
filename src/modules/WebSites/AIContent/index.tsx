import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { RubroModel } from './models';
import { AIContentApiService } from './services';
import RubroCard from './components/RubroCard';

const AIContent: React.FC = () => {
    const [rubros, setRubros] = useState<RubroModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const service = new AIContentApiService();

    const fetchRubros = async () => {
        setError(null);
        const response = await service.getRubros(setLoading);

        if (response.status === 200 && response.data) {
            setRubros(response.data);
        } else {
            setError('Error al cargar los rubros');
        }
    };

    useEffect(() => {
        fetchRubros();
    }, []);

    const handleRubroClick = (rubroId: number) => {
        navigate(`/websites/ai-content/${rubroId}`);
    };

    return (
        <div className="page-content">
            <Container fluid>
                {/* Header - Diseño moderno con gradiente */}
                <div
                    className="d-flex justify-content-between align-items-center mb-4 p-4"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                >
                    <div className="d-flex align-items-center">
                        <div
                            className="d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: '56px',
                                height: '56px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '14px',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <i className="mdi mdi-robot text-white" style={{ fontSize: '28px' }}></i>
                        </div>
                        <div>
                            <h4 className="mb-1 text-white fw-semibold" style={{ fontSize: '20px' }}>
                                Contenido IA
                            </h4>
                            <p className="mb-0 text-white-50" style={{ fontSize: '13px' }}>
                                Visualiza y edita el contenido generado por IA
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchRubros}
                        disabled={loading}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        }}
                    >
                        <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''}`}></i>
                        Actualizar
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div
                        className="text-center py-5"
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <Spinner style={{ color: '#667eea' }} />
                        <p className="mt-3 mb-0" style={{ color: '#6c757d' }}>Cargando rubros...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid #feb2b2'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <i className="mdi mdi-alert-circle me-2" style={{ color: '#e53e3e', fontSize: '20px' }}></i>
                            <span style={{ color: '#c53030' }}>{error}</span>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && rubros.length === 0 && (
                    <div
                        className="text-center py-5"
                        style={{
                            background: 'linear-gradient(135deg, #f8f9ff 0%, #f5f0ff 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                    >
                        <div
                            className="d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: '80px',
                                height: '80px',
                                background: 'rgba(102, 126, 234, 0.1)',
                                borderRadius: '20px'
                            }}
                        >
                            <i className="mdi mdi-tag-off" style={{ fontSize: '40px', color: '#667eea' }}></i>
                        </div>
                        <h5 style={{ color: '#1a1a2e', fontWeight: 600 }}>No hay rubros generados</h5>
                        <p style={{ color: '#6c757d', marginBottom: 0 }}>
                            Usa "Crear con IA" para generar contenido
                        </p>
                    </div>
                )}

                {/* Rubros list */}
                {!loading && !error && rubros.length > 0 && (
                    <Row className="g-4">
                        {rubros.map((rubro) => (
                            <Col key={rubro.id} md={6} lg={4}>
                                <RubroCard
                                    rubro={rubro}
                                    onClick={() => handleRubroClick(rubro.id)}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default AIContent;
