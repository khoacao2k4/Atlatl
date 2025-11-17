import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoChart } from './AutoChart';

export const CalculatorBase = ({ config }) => {
    const [results, setResults] = useState(null);

    // Since we use zod schema, we need zodResolver to resolve it
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(config.schema),  // Validate input using config schema
        defaultValues: config.defaultValues  // Prefill default calculator values
    });

    const onSubmit = (data) => {
        const calculatedResults = config.calculate(data);  // Run calculator logic
        setResults(calculatedResults);  // Store output
    };

    const handleReset = () => {
        reset();
        setResults(null);
    };

    const formatValue = (value, format) => {
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
        if (format === 'number') {
            return new Intl.NumberFormat('en-US').format(value);
        }
        return value;
    };

    return (
        <div className="max-w-6xl mx-auto px-10 py-16">

            {/* Calculator Header */}
            <div className="mb-12 text-center">
                {/* Title and Description from config */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight font-songer">{config.title}</h1>
                <p className="text-black text-lg mt-6 font-work-sans">{config.description}</p>
            </div>

            {/* Layout: Form (left) + Results (right) */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">Input Values</h2>
                    <div className="space-y-4">
                        {/* Generate inputs dynamically from config */}
                        {config.inputs.map(input => (
                            <div key={input.name}>
                                <label className="block text-sm font-medium text-black mb-1 font-work-sans">
                                    {input.label}
                                    {input.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {/* Bind input to React Hook Form */}
                                <input
                                    {...register(input.name, { valueAsNumber: input.type === 'number' })}
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    step={input.step}
                                    className="w-full px-3 py-2 border-2 border-bold-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans"
                                />

                                {/* Validation Errors */}
                                {errors[input.name] && (
                                    <p className="text-red-500 text-sm mt-1 font-work-sans">
                                        {errors[input.name]?.message}
                                    </p>
                                )}

                                {/* Optional hint/instructions */}
                                {input.hint && (
                                    <p className="text-text-light-blue text-xs mt-1 font-work-sans">{input.hint}</p>
                                )}
                            </div>
                        ))}

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSubmit(onSubmit)}
                                className="flex-1 bg-bold-blue text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-white hover:text-bold-blue hover:border-2 hover:border-bold-blue transition-colors"
                            >
                                Calculate
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-white text-bold-blue border-2 border-bold-blue font-bold rounded-lg shadow-sm hover:bg-bold-blue hover:text-white transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">Results</h2>
                    {/* If no calculation yet, show empty state */}
                    {!results ? (
                        <div className="text-center py-12 text-text-light-blue">
                            <div className="text-6xl mb-4 opacity-50">📈</div>
                            <p className="font-work-sans">Enter values and click Calculate to see results</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Render each result row */}
                            {config.results.map(result => (
                                <div key={result.key} className="border-b border-bold-blue pb-4 last:border-b-0">
                                    <p className="text-sm text-text-light-blue mb-1 font-work-sans">{result.label}</p>
                                    <p className="text-2xl font-bold text-dark-blue font-songer">
                                        {formatValue(results[result.key], result.format)}
                                    </p>
                                    {result.description && (
                                        <p className="text-xs text-text-light-blue mt-1 font-work-sans">{result.description}</p>
                                    )}
                                </div>
                            ))}

                            {/* Breakdown list if present */}
                            {results.breakdown && (
                                <div className="mt-6 pt-4 border-t border-bold-blue">
                                    <h3 className="font-bold mb-3 text-dark-blue font-songer">Breakdown</h3>
                                    <div className="space-y-2 text-sm font-work-sans">
                                        {results.breakdown.map((item, idx) => (
                                            <div key={idx} className="flex justify-between">
                                                <span className="text-text-light-blue">{item.label}</span>
                                                <span className="font-medium text-black">{formatValue(item.value, item.format)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Section */}
            {results && config.charts && config.charts.length > 0 && (
                <div className="mt-6 space-y-6">
                    {config.charts.map((chartConfig, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">
                                {chartConfig.title}
                            </h2>
                            {/* AutoChart renders the actual charts based on config */}
                            <AutoChart config={chartConfig} results={results} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};