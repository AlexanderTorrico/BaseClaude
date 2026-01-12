import React from 'react';

interface VisitsChartProps {
    data: Record<string, string>;  // { "2026-01-12": "5", "2026-01-13": "10" }
    height?: number;
}

/**
 * Componente de gráfico de visitas diarias simple usando SVG
 */
const VisitsChart: React.FC<VisitsChartProps> = ({ data, height = 150 }) => {
    // Convertir datos a array ordenado por fecha
    const entries = Object.entries(data || {})
        .map(([date, visits]) => ({
            date,
            visits: parseInt(visits, 10) || 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Si no hay datos, mostrar mensaje
    if (entries.length === 0) {
        return (
            <div
                className="d-flex align-items-center justify-content-center text-muted"
                style={{ height }}
            >
                <div className="text-center">
                    <i className="mdi mdi-chart-line-variant display-4 mb-2"></i>
                    <p className="mb-0">Sin datos de visitas</p>
                </div>
            </div>
        );
    }

    // Calcular valores para el gráfico
    const maxVisits = Math.max(...entries.map(e => e.visits), 1);
    const totalVisits = entries.reduce((sum, e) => sum + e.visits, 0);
    const chartHeight = height - 50;
    const paddingLeft = 40; // Espacio para etiquetas del eje Y
    const paddingRight = 20;
    const paddingY = 20;

    // Dimensiones del viewBox
    const viewBoxWidth = 1200;
    const viewBoxHeight = chartHeight;

    // Generar valores para el eje Y (0, 25%, 50%, 75%, 100% del máximo)
    const yAxisValues = [0, 0.25, 0.5, 0.75, 1].map(fraction => ({
        value: Math.round(maxVisits * fraction),
        y: viewBoxHeight - paddingY - (fraction * (viewBoxHeight - 2 * paddingY))
    }));

    // Generar puntos para el path (con padding horizontal)
    const points = entries.map((entry, index) => {
        const x = paddingLeft + ((viewBoxWidth - paddingLeft - paddingRight) / Math.max(entries.length - 1, 1)) * index;
        const y = viewBoxHeight - paddingY - ((entry.visits / maxVisits) * (viewBoxHeight - 2 * paddingY));
        return { x, y, visits: entry.visits, date: entry.date };
    });

    // Crear path para la línea
    const linePath = points.map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        return `L ${p.x} ${p.y}`;
    }).join(' ');

    // Formatear fecha para mostrar
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es', { day: '2-digit', month: 'short' });
    };

    return (
        <div style={{ height }}>
            {/* Header con total */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted font-size-12">Visitas diarias</span>
                <span className="badge bg-primary bg-opacity-10 text-primary">
                    Total: {totalVisits}
                </span>
            </div>

            {/* Gráfico SVG */}
            <svg
                width="100%"
                height={chartHeight}
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ overflow: 'hidden' }}
            >
                {/* Etiquetas del eje Y y líneas de grid */}
                {yAxisValues.map(({ value, y }) => (
                    <g key={value}>
                        {/* Etiqueta del valor */}
                        <text
                            x={paddingLeft - 8}
                            y={y + 4}
                            textAnchor="end"
                            fill="#6c757d"
                            fontSize="11"
                        >
                            {value}
                        </text>
                        {/* Línea de grid */}
                        <line
                            x1={paddingLeft}
                            y1={y}
                            x2={viewBoxWidth - paddingRight}
                            y2={y}
                            stroke="#e9ecef"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                        />
                    </g>
                ))}

                {/* Línea del gráfico */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#556ee6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Puntos pequeños */}
                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#556ee6"
                        />
                        {/* Etiqueta de valor sobre el punto */}
                        <text
                            x={point.x}
                            y={point.y - 8}
                            textAnchor="middle"
                            fill="#556ee6"
                            fontSize="10"
                            fontWeight="600"
                        >
                            {point.visits}
                        </text>
                        {/* Tooltip al hover */}
                        <title>{formatDate(point.date)}: {point.visits} visitas</title>
                    </g>
                ))}

                {/* Etiquetas del eje X (fechas) */}
                {points.map((point, index) => (
                    <text
                        key={`date-${index}`}
                        x={point.x}
                        y={viewBoxHeight - 2}
                        textAnchor="middle"
                        fill="#6c757d"
                        fontSize="10"
                    >
                        {formatDate(point.date)}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default VisitsChart;
