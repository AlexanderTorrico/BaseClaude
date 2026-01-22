import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Backend API URL
const API_BASE_URL = 'http://localhost:8000';

interface SectionDataItem {
    lbl: string;
    value?: string;
    file?: string;
    color?: string;
    active?: boolean;
    width?: number;
    link?: string;
    fontSize?: number;
    navigation?: any[];
    transparentBackground?: boolean;
    [key: string]: any;
}

interface Section {
    id: number;
    code: string;
    label: string | null;
    data: SectionDataItem[];
}

interface PageData {
    id: number;
    name: string;
    image: string;
    font: string;
    palette: {
        tx: string;
        ac: string;
        bg: string;
        bg2: string | null;
    };
    sections: Section[];
}

// Render individual section data item
const renderDataItem = (item: SectionDataItem, palette: any, index: number) => {
    if (!item.active && item.active !== undefined && item.active === false) {
        return null;
    }

    const lbl = item.lbl?.toLowerCase() || '';

    // Background image
    if (lbl === 'background' && item.file) {
        return (
            <div
                key={index}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${item.file})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }}
            />
        );
    }

    // Logo
    if (lbl === 'logo' && item.file) {
        return (
            <div key={index} style={{ marginBottom: '16px' }}>
                <img
                    src={item.file}
                    alt="Logo"
                    style={{
                        width: item.width ? `${item.width}%` : '150px',
                        maxHeight: '100px',
                        objectFit: 'contain'
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            </div>
        );
    }

    // Title/Headline
    if ((lbl === 'title' || lbl === 'headline' || lbl === 'slogan') && item.value) {
        return (
            <h1
                key={index}
                style={{
                    fontSize: item.fontSize ? `${item.fontSize * 4}px` : '48px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: item.color || palette?.tx || '#ffffff'
                }}
            >
                {item.value}
            </h1>
        );
    }

    // Subtitle/Description
    if ((lbl === 'subtitle' || lbl === 'description' || lbl === 'text') && item.value) {
        return (
            <p
                key={index}
                style={{
                    fontSize: item.fontSize ? `${item.fontSize * 2}px` : '18px',
                    marginBottom: '24px',
                    color: item.color || palette?.tx || '#ffffff',
                    opacity: 0.9,
                    maxWidth: '600px'
                }}
            >
                {item.value}
            </p>
        );
    }

    // Button
    if (lbl === 'button' && item.value) {
        return (
            <a
                key={index}
                href={item.link || item.web || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-block',
                    padding: `${item.verticalPadding || 12}px ${item.lateralPadding || 24}px`,
                    backgroundColor: item.primary ? (palette?.ac || '#667eea') : 'transparent',
                    color: item.color || '#ffffff',
                    border: `${item.border || 2}px solid ${item.fill || palette?.ac || '#ffffff'}`,
                    borderRadius: `${item.borderRadius || 8}px`,
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginRight: '12px',
                    marginBottom: '12px',
                    cursor: 'pointer'
                }}
            >
                {item.value}
            </a>
        );
    }

    // Image
    if ((lbl === 'image' || lbl === 'photo' || lbl === 'imagen') && item.file) {
        return (
            <div key={index} style={{ marginBottom: '16px' }}>
                <img
                    src={item.file}
                    alt={item.lbl}
                    style={{
                        maxWidth: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            </div>
        );
    }

    return null;
};

// Render a section
const renderSection = (section: Section, palette: any) => {
    const code = section.code?.toLowerCase() || '';
    const isHeader = code.includes('header');
    const isHero = code.includes('hero');
    const isGallery = code.includes('gallery');
    const isCta = code.includes('cta');
    const isFooter = code.includes('footer');

    // Find background item
    const bgItem = section.data?.find(d => d.lbl?.toLowerCase() === 'background');
    const hasBackground = bgItem && bgItem.file;

    const sectionStyle: React.CSSProperties = {
        position: 'relative',
        padding: isHeader ? '20px 0' : '80px 20px',
        minHeight: isHero ? '80vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hasBackground ? 'transparent' : (palette?.bg || '#1d2e3d'),
        overflow: 'hidden'
    };

    const contentStyle: React.CSSProperties = {
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '1200px',
        width: '100%',
        padding: '0 20px'
    };

    return (
        <section key={section.id} style={sectionStyle}>
            {/* Render background first */}
            {section.data?.map((item, idx) =>
                item.lbl?.toLowerCase() === 'background' ? renderDataItem(item, palette, idx) : null
            )}

            {/* Dark overlay for readability */}
            {hasBackground && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    zIndex: 0
                }} />
            )}

            <div style={contentStyle}>
                {/* Render other items */}
                {section.data?.map((item, idx) =>
                    item.lbl?.toLowerCase() !== 'background' ? renderDataItem(item, palette, idx) : null
                )}
            </div>
        </section>
    );
};

const PageViewer: React.FC = () => {
    const { viewKey } = useParams<{ viewKey: string }>();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            if (!viewKey) {
                setError('No view key provided');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/api/dsg-page/preview_`,
                    { view_key: viewKey },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );

                if (response.status === 200 && response.data) {
                    const data = response.data?.data ?? response.data;
                    console.log('Page data:', data);
                    setPageData(data);
                } else {
                    setError('Error loading page');
                }
            } catch (err: any) {
                console.error('Error fetching page:', err);
                setError(err.response?.data?.message || 'Error loading page');
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [viewKey]);

    // Loading state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#1d2e3d'
            }}>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid rgba(255,255,255,0.2)',
                        borderTop: '4px solid #4a9d9c',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }} />
                    <p style={{ marginTop: '16px' }}>Loading...</p>
                </div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Error state
    if (error || !pageData) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#1d2e3d',
                color: '#fff'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px' }}>⚠</div>
                    <h2>Error</h2>
                    <p style={{ opacity: 0.7 }}>{error || 'Page not found'}</p>
                </div>
            </div>
        );
    }

    // Render page
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: pageData.palette?.bg || '#1d2e3d',
            color: pageData.palette?.tx || '#ffffff',
            fontFamily: pageData.font?.replace('font', '') || 'system-ui, sans-serif'
        }}>
            {/* Render all sections */}
            {pageData.sections && pageData.sections.length > 0 ? (
                pageData.sections.map(section => renderSection(section, pageData.palette))
            ) : (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh'
                }}>
                    <p>Page is being built...</p>
                </div>
            )}

            {/* Footer */}
            <footer style={{
                padding: '20px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                textAlign: 'center',
                fontSize: '14px',
                color: pageData.palette?.tx || '#ffffff'
            }}>
                <p style={{ margin: 0, opacity: 0.7 }}>Powered by Aziende</p>
            </footer>
        </div>
    );
};

export default PageViewer;
