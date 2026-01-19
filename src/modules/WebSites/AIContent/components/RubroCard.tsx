import React from 'react';
import { RubroModel } from '../models';

interface RubroCardProps {
    rubro: RubroModel;
    onClick: () => void;
}

const RubroCard: React.FC<RubroCardProps> = ({ rubro, onClick }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const templateCount = rubro.template_pages_count ?? rubro.template_pages?.length ?? 0;

    return (
        <div
            onClick={onClick}
            style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #edf0f5',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '0'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.15)';
                e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = '#edf0f5';
            }}
        >
            <div className="d-flex justify-content-between align-items-start gap-2">
                <div className="d-flex align-items-start" style={{ flex: 1, minWidth: 0 }}>
                    <div
                        className="d-flex align-items-center justify-content-center me-3"
                        style={{
                            width: '44px',
                            height: '44px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '10px',
                            flexShrink: 0
                        }}
                    >
                        <i className="mdi mdi-tag-outline text-white" style={{ fontSize: '20px' }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                        <h5
                            className="mb-1 text-capitalize"
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#1a1a2e',
                                marginBottom: '6px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {rubro.name}
                        </h5>
                        <div
                            className="d-flex align-items-center"
                            style={{ fontSize: '12px', color: '#6c757d' }}
                        >
                            <i className="mdi mdi-clock-outline me-1"></i>
                            {formatDate(rubro.created_at)}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            fontWeight: 600
                        }}
                    >
                        {templateCount} {templateCount === 1 ? 'diseño' : 'diseños'}
                    </span>
                    <div
                        className="d-flex align-items-center justify-content-center mt-2"
                        style={{
                            width: '24px',
                            height: '24px',
                            background: '#f0f0f5',
                            borderRadius: '6px'
                        }}
                    >
                        <i className="mdi mdi-chevron-right" style={{ color: '#6c757d', fontSize: '16px' }}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RubroCard;
