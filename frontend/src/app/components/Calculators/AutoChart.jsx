import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export const AutoChart = ({ config, results }) => {

    const formatValue = (value, format = 'number') => {
        if (format === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
        }
        if (format === 'percentage') {
            return `${value.toFixed(2)}%`;
        }
        return new Intl.NumberFormat('en-US').format(value);
    };

    /**
     * Custom tooltip component used for all chart types.
     * Displays a styled hover box with label + values.
     * It is the small box that appears on hovering datapoints on the graph.
     */
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border-2 border-bold-blue rounded-xl shadow-2xl p-4 font-work-sans">
                    {/* Tooltip label (if provided in data) */}
                    {payload[0].payload.label && (
                        <p className="font-bold text-black mb-2">
                            {payload[0].payload.label}
                        </p>
                    )}

                    {/* Render each data entry (line, bar, etc.) */}
                    {payload.map((entry, index) => (
                        <p
                            key={index}
                            style={{ color: entry.color }}
                            className="text-sm font-medium"
                        >
                            {entry.name}: {formatValue(entry.value, config.format)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Generate data based on config
    const prepareData = () => {
        if (typeof config.data === 'function') {
            return config.data(results);
        }
        return config.data;
    };
    const data = prepareData();

    // Default color palette (fallback if config does not provide colors)
    const colors = config.colors || ['#378CE7', '#245383', '#07315C', '#F5FAFF', '#8b5cf6', '#ec4899'];

    /**
     * Main Chart Renderer
     * Uses config.type to determine which chart to draw.
     */
    switch (config.type) {
        case 'line':
            return (
                <div>
                    <ResponsiveContainer width="100%" height={config.height || 300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#378CE7" />
                            <XAxis
                                dataKey={config.xKey}
                                label={config.xLabel ? { value: config.xLabel, position: 'insideBottom', offset: -5 } : undefined}
                                stroke="#245383"
                            />
                            <YAxis
                                tickFormatter={(val) => formatValue(val, config.format)}
                                label={config.yLabel ? { value: config.yLabel, angle: -90, position: 'insideLeft' } : undefined}
                                stroke="#245383"
                            />

                            {/* Tooltip + Legend */}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            {/* Render all configured line series */}
                            {config.lines.map((line, idx) => (
                                <Line
                                    key={idx}
                                    type={line.type || "monotone"}
                                    dataKey={line.key}
                                    stroke={line.color || colors[idx]}
                                    strokeWidth={line.width || 2}
                                    strokeDasharray={line.dashed ? "5 5" : undefined}
                                    name={line.name}
                                    dot={line.showDots !== false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>

                    {/* Optional description below chart */}
                    {config.description && (
                        <p className="text-sm text-dark-blue mt-2 text-center font-work-sans">{config.description}</p>
                    )}
                </div>
            );


        case 'area':
            return (
                <div>
                    <ResponsiveContainer width="100%" height={config.height || 300}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#378CE7" />
                            <XAxis
                                dataKey={config.xKey}
                                stroke="#245383"
                            />
                            <YAxis
                                tickFormatter={(val) => formatValue(val, config.format)}
                                stroke="#245383"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {config.areas.map((area, idx) => (
                                <Area
                                    key={idx}
                                    type={area.type || "monotone"}
                                    dataKey={area.key}
                                    stroke={area.color || colors[idx]}
                                    fill={area.color || colors[idx]}
                                    fillOpacity={area.opacity || 0.6}
                                    name={area.name}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                    {config.description && (
                        <p className="text-sm text-dark-blue mt-2 text-center font-work-sans">{config.description}</p>
                    )}
                </div>
            );


        case 'bar':
            return (
                <div>
                    <ResponsiveContainer width="100%" height={config.height || 300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#378CE7" />
                            <XAxis
                                dataKey={config.xKey}
                                stroke="#245383"
                            />
                            <YAxis
                                tickFormatter={(val) => formatValue(val, config.format)}
                                stroke="#245383"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {config.showLegend !== false && <Legend />}
                            {config.bars ? (
                                config.bars.map((bar, idx) => (
                                    <Bar
                                        key={idx}
                                        dataKey={bar.key}
                                        fill={bar.color || colors[idx]}
                                        name={bar.name}
                                    />
                                ))
                            ) : (
                                <Bar dataKey={config.valueKey} fill={colors[0]} />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                    {config.description && (
                        <p className="text-sm text-dark-blue mt-2 text-center font-work-sans">{config.description}</p>
                    )}
                </div>
            );


        case 'pie':
            return (
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <ResponsiveContainer width="100%" height={config.height || 300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={config.showLabels !== false ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%` : false}
                                outerRadius={config.outerRadius || 100}
                                fill="#8884d8"
                                dataKey={config.valueKey}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(val) => formatValue(val, config.format)} />
                        </PieChart>
                    </ResponsiveContainer>

                    {config.showLegend !== false && (
                        <div className="space-y-3 font-work-sans">
                            {data.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: item.color || colors[index % colors.length] }}
                                    />
                                    <div>
                                        <p className="font-medium text-black">{item.name}</p>
                                        <p className="text-sm text-dark-blue">{formatValue(item.value, config.format)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );

            {/* Incase Ross needs more charts, specify case and write logic here */ }

        default:
            return <p className="text-red-500 font-work-sans">Unknown chart type: {config.type}</p>;
    }
};