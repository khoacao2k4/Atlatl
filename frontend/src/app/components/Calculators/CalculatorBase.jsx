import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoChart } from '../AutoChart';

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
    <div className="max-w-6xl mx-auto p-6">

      {/* Calculator Header */}
      <div className="mb-8 text-center">
        {/* Title and Description from config */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
        <p className="text-gray-600">{config.description}</p>
      </div>

      {/* Layout: Form (left) + Results (right) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Input Values</h2>
          <div className="space-y-4">
            {/* Generate inputs dynamically from config */}
            {config.inputs.map(input => (
              <div key={input.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {input.label}
                  {input.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {/* Bind input to React Hook Form */}
                <input
                  {...register(input.name, { valueAsNumber: input.type === 'number' })}
                  type={input.type}
                  placeholder={input.placeholder}
                  step={input.step}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                
                {/* Validation Errors */}
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[input.name]?.message}
                  </p>
                )}

                {/* Optional hint/instructions */}
                {input.hint && (
                  <p className="text-gray-500 text-xs mt-1">{input.hint}</p>
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit(onSubmit)}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Calculate
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Results</h2>
          {/* If no calculation yet, show empty state */}
          {!results ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4 opacity-50">📈</div>
              <p>Enter values and click Calculate to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Render each result row */}
              {config.results.map(result => (
                <div key={result.key} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <p className="text-sm text-gray-600 mb-1">{result.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatValue(results[result.key], result.format)}
                  </p>
                  {result.description && (
                    <p className="text-xs text-gray-500 mt-1">{result.description}</p>
                  )}
                </div>
              ))}
              
              {/* Breakdown list if present */}
              {results.breakdown && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold mb-3 text-gray-800">Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    {results.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">{formatValue(item.value, item.format)}</span>
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
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
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