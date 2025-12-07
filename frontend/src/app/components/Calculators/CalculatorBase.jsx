import React, { useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AutoChart } from './AutoChart';
import {
    TextInput,
    CurrencyInput,
    PercentageInput,
    DateInput
} from './InputComponents';
import { EmailGateOverlay } from './EmailGateOverlay';

// ============================================================================
// CONSTANTS
// ============================================================================

const INPUT_TYPES = {
    TEXT: 'text',
    NUMBER: 'number',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    CURRENCY: 'currency',
    PERCENTAGE: 'percentage',
    DATE: 'date',
};

const FORMAT_TYPES = {
    CURRENCY: 'currency',
    PERCENTAGE: 'percentage',
    NUMBER: 'number',
    TEXT: 'text',
};

const BUTTON_STYLES = {
    primary: 'flex-1 bg-bold-blue text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-white hover:text-bold-blue hover:border-2 hover:border-bold-blue transition-colors',
    secondary: 'px-8 py-3 bg-white text-bold-blue border-2 border-bold-blue font-bold rounded-lg shadow-sm hover:bg-bold-blue hover:text-white transition-colors'
};

const INPUT_BASE_STYLES = 'w-full px-3 py-2 border-2 rounded-lg font-tenorite transition-all';
const INPUT_DISABLED_STYLES = 'bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed';
const INPUT_ENABLED_STYLES = 'border-bold-blue focus:ring-2 focus:ring-bold-blue';

const formatters = {
    [FORMAT_TYPES.CURRENCY]: (value) => {
        if (value == null) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: DECIMAL_PLACES,
            maximumFractionDigits: DECIMAL_PLACES,
        }).format(value);
    },

    [FORMAT_TYPES.PERCENTAGE]: (value) => {
        if (value == null) return 'N/A';
        return `${value.toFixed(DECIMAL_PLACES)}%`;
    },

    [FORMAT_TYPES.NUMBER]: (value) => {
        if (value == null) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: DECIMAL_PLACES,
            maximumFractionDigits: DECIMAL_PLACES,
        }).format(value);
    },

    [FORMAT_TYPES.TEXT]: (value) => value || 'N/A',
};

/**
 * Formats a value according to the specified format type
 * @param {*} value - The value to format
 * @param {string} format - The format type from FORMAT_TYPES
 * @returns {string} Formatted value or original value if no formatter exists
 */
const formatValue = (value, format) => {
    const formatter = formatters[format];
    return formatter ? formatter(value) : value;
};

// ============================================================================
// UI SUB-COMPONENTS
// ============================================================================

const FieldLabel = ({ label, required, disabled }) => (
    <label className="block text-sm font-medium text-black mb-1 font-tenorite">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {disabled && (
            <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                Auto-calculated
            </span>
        )}
    </label>
);

const FieldError = ({ message }) => (
    <p className="text-red-500 text-sm mt-1 font-tenorite">{message}</p>
);

const FieldHint = ({ hint }) => (
    <p className="text-text-light-blue text-xs mt-1 font-tenorite">{hint}</p>
);

const EmptyResults = () => (
    <div className="text-center py-12 text-text-light-blue">
        <div className="text-6xl mb-4 opacity-50">📈</div>
        <p className="font-tenorite">Enter values and click Calculate to see results</p>
    </div>
);

const ResultItem = ({ result, value }) => (
    <div className="border-b border-bold-blue pb-4">
        <p className="text-sm text-text-light-blue mb-1 font-tenorite">
            {result.label}
        </p>
        <p className="text-2xl font-bold text-dark-blue font-songer">
            {formatValue(value, result.format)}
        </p>
        {result.description && (
            <p className="text-xs text-text-light-blue mt-1 font-tenorite">
                {result.description}
            </p>
        )}
    </div>
);

const ResultNotes = ({ notes }) => (
    <div className="mt-6 pt-4 border-t border-bold-blue">
        <h3 className="font-bold mb-3 text-dark-blue font-songer">Notes</h3>
        <ul className="space-y-2 text-sm font-tenorite">
            {notes.map((note, idx) => (
                <li key={idx} className="text-text-light-blue flex">
                    <span className="mr-2">•</span> {note}
                </li>
            ))}
        </ul>
    </div>
);

const ResultBreakdown = ({ breakdown }) => (
    <div className="mt-6 pt-4 border-t border-bold-blue">
        <h3 className="font-bold mb-3 text-dark-blue font-songer">Breakdown</h3>
        <div className="space-y-2 text-sm font-tenorite">
            {breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                    <span className="text-text-light-blue">{item.label}</span>
                    <span className="font-medium text-black">
                        {formatValue(item.value, item.format)}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

// ============================================================================
// INPUT COMPONENTS
// ============================================================================

const getInputClassName = (disabled) =>
    `${INPUT_STYLES.base} ${disabled ? INPUT_STYLES.disabled : INPUT_STYLES.enabled}`;

const SelectInput = ({ input, register, disabled, handleFieldChange }) => (
    <select
        {...register(input.name, {
            onChange: (e) => handleFieldChange(input, e.target.value)
        })}
        disabled={disabled}
        className={getInputClassName(disabled)}
    >
        {input.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

const CheckboxInput = ({ input, register, disabled, handleFieldChange }) => (
    <input
        type="checkbox"
        {...register(input.name, {
            onChange: (e) => handleFieldChange(input, e.target.checked)
        })}
        disabled={disabled}
        className={`w-5 h-5 border-2 rounded transition-all ${disabled ? 'border-gray-300 cursor-not-allowed' : 'border-bold-blue focus:ring-2 focus:ring-bold-blue'
            }`}
    />
);

const ControlledInput = ({ input, control, disabled, handleFieldChange }) => {
    const componentMap = {
        [INPUT_TYPES.CURRENCY]: CurrencyInput,
        [INPUT_TYPES.PERCENTAGE]: PercentageInput,
        [INPUT_TYPES.DATE]: DateInput,
        [INPUT_TYPES.TEXT]: TextInput,
    };

    const Component = componentMap[input.format] || componentMap[input.type];

    if (!Component) return null;

    return (
        <Controller
            name={input.name}
            control={control}
            render={({ field }) => (
                <Component
                    {...field}
                    placeholder={input.placeholder}
                    disabled={disabled}
                    step={input.step}
                    onChange={(val) => {
                        field.onChange(val);
                        handleFieldChange(input, val);
                    }}
                />
            )}
        />
    );
};

const NumberInput = ({ input, control, disabled, handleFieldChange }) => (
    <Controller
        name={input.name}
        control={control}
        render={({ field }) => (
            <input
                type="number"
                value={field.value ?? ''}
                onChange={(e) => {
                    const val = e.target.value;
                    const numVal = val === '' ? null : parseFloat(val);
                    field.onChange(numVal);
                    handleFieldChange(input, numVal);
                }}
                onBlur={field.onBlur}
                step={input.step}
                disabled={disabled}
                placeholder={input.placeholder}
                className={getInputClassName(disabled)}
            />
        )}
    />
);

const FallbackInput = ({ input, register, disabled, handleFieldChange }) => (
    <input
        type={input.type}
        {...register(input.name, {
            onChange: (e) => handleFieldChange(input, e.target.value)
        })}
        placeholder={input.placeholder}
        step={input.step}
        disabled={disabled}
        className={getInputClassName(disabled)}
    />
);

/**
 * Factory component that renders the appropriate input based on type and format
 */
const InputRenderer = ({ input, register, control, disabled, handleFieldChange }) => {
    const props = { input, register, control, disabled, handleFieldChange };

    if (input.type === INPUT_TYPES.SELECT) {
        return <SelectInput {...props} />;
    }

    if (input.type === INPUT_TYPES.CHECKBOX) {
        return <CheckboxInput {...props} />;
    }

    if (input.format && [INPUT_TYPES.CURRENCY, INPUT_TYPES.PERCENTAGE, INPUT_TYPES.DATE].includes(input.format)) {
        return <ControlledInput {...props} />;
    }

    if (input.type === INPUT_TYPES.TEXT && input.format === INPUT_TYPES.TEXT) {
        return <ControlledInput {...props} />;
    }

    if (input.type === INPUT_TYPES.NUMBER) {
        return <NumberInput {...props} />;
    }

    return <FallbackInput {...props} />;
};

// ============================================================================
// FORM COMPONENTS
// ============================================================================

const FormField = ({
    input,
    register,
    control,
    errors,
    disabled,
    handleFieldChange
}) => (
    <div>
        <FieldLabel
            label={input.label}
            required={input.required}
            disabled={disabled}
        />

        <InputRenderer
            input={input}
            register={register}
            control={control}
            disabled={disabled}
            handleFieldChange={handleFieldChange}
        />

        {errors[input.name] && (
            <FieldError message={errors[input.name].message} />
        )}

        {input.hint && <FieldHint hint={input.hint} />}
    </div>
);

/**
 * Checks if an input should be visible based on conditional rules
 */
const isInputVisible = (input, formData) => {
    if (!input.conditional) return true;
    const fieldValue = formData[input.conditional.field];
    return fieldValue === input.conditional.value;
};

const FormSection = ({
    section,
    inputs,
    register,
    control,
    errors,
    getValues,
    handleFieldChange
}) => {
    const visibleInputs = inputs.filter(input => {
        const formData = getValues();
        return isInputVisible(input, formData);
    });

    if (visibleInputs.length === 0) return null;

    return (
        <div className="space-y-4">
            {section !== DEFAULT_SECTION_NAME && (
                <h3 className="text-lg font-bold text-dark-blue font-songer border-b-2 border-bold-blue pb-2">
                    {section}
                </h3>
            )}
            {visibleInputs.map(input => {
                const disabled = typeof input.disabled === 'function'
                    ? input.disabled(getValues())
                    : input.disabled || false;

                return (
                    <FormField
                        key={input.name}
                        input={input}
                        register={register}
                        control={control}
                        errors={errors}
                        disabled={disabled}
                        handleFieldChange={handleFieldChange}
                    />
                );
            })}
        </div>
    );
};

// ============================================================================
// MAIN CALCULATOR COMPONENT
// ============================================================================

/**
 * Retrieves email submission status from localStorage
 */
const getEmailSubmittedStatus = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY_EMAIL_SUBMITTED) === 'true';
};

/**
 * Stores email submission status in localStorage
 */
const setEmailSubmittedStatus = (value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_EMAIL_SUBMITTED, String(value));
};

/**
 * Groups inputs by their section property
 */
const groupInputsBySection = (inputs) => {
    return inputs.reduce((acc, input) => {
        const section = input.section || DEFAULT_SECTION_NAME;
        if (!acc[section]) acc[section] = [];
        acc[section].push(input);
        return acc;
    }, {});
};

export const CalculatorBase = ({ config }) => {
    const [results, setResults] = useState(null);
    const [formTrigger, setFormTrigger] = useState(0);
    const [showEmailGate, setShowEmailGate] = useState(false);
    const [pendingData, setPendingData] = useState(null);
    const [emailSubmitted, setEmailSubmitted] = useState(getEmailSubmittedStatus);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(config.schema),
        defaultValues: config.defaultValues,
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });

    const onSubmit = useCallback((data) => {
        const requiresEmailGate = config.requireEmailGate === true;

        if (requiresEmailGate && !emailSubmitted) {
            setPendingData(data);
            setShowEmailGate(true);
        } else {
            setResults(config.calculate(data));
        }
    }, [config, emailSubmitted]);

    const handleEmailSubmit = useCallback((email) => {
        setEmailSubmitted(true);
        setEmailSubmittedStatus(true);
        setShowEmailGate(false);

        if (pendingData) {
            setResults(config.calculate(pendingData));
            setPendingData(null);
        }
    }, [config, pendingData]);

    const handleEmailCancel = useCallback(() => {
        setShowEmailGate(false);
        setPendingData(null);
    }, []);

    const handleReset = useCallback(() => {
        reset(config.defaultValues);
        setResults(null);
        setFormTrigger(prev => prev + 1);
    }, [reset, config.defaultValues]);

    const handleFieldChange = useCallback((input, value) => {
        setFormTrigger(prev => prev + 1);

        if (input.onChangeTrigger && typeof input.onChangeTrigger === 'function') {
            const formData = getValues();
            input.onChangeTrigger(formData, setValue, value);
        }
    }, [getValues, setValue]);

    const groupedInputs = useMemo(() =>
        groupInputsBySection(config.inputs),
        [config.inputs]
    );

    return (
<<<<<<< HEAD
        <>
            <EmailGateOverlay
                isOpen={showEmailGate}
                onSubmit={handleEmailSubmit}
                onCancel={handleEmailCancel}
            />
=======
        <div className="max-w-6xl mx-auto px-10 py-16">
            {/* Header */}
            <header className="mb-12 text-center">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-black font-songer">
                    {config.title}
                </h1>
                <p className="text-black text-lg mt-6 font-tenorite">
                    {config.description}
                </p>
            </header>
>>>>>>> main

            <div className="max-w-6xl mx-auto px-10 py-16">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-black font-songer">
                        {config.title}
                    </h1>
                    <p className="text-black text-lg mt-6 font-work-sans">
                        {config.description}
                    </p>
                </header>

                {/* Form + Results Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Form Panel */}
                    <section className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">
                            Input Values
                        </h2>

                        <div className="space-y-6">
                            {Object.entries(groupedInputs).map(([section, inputs]) => (
                                <FormSection
                                    key={section}
                                    section={section}
                                    inputs={inputs}
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    getValues={getValues}
                                    handleFieldChange={handleFieldChange}
                                />
                            ))}

                            <div className="flex gap-3 pt-4">
                                <button onClick={handleSubmit(onSubmit)} className={BUTTON_STYLES.primary}>
                                    Calculate
                                </button>
                                <button onClick={handleReset} className={BUTTON_STYLES.secondary}>
                                    Reset
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Results Panel */}
                    <section className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">
                            Results
                        </h2>

                        {!results ? (
                            <EmptyResults />
                        ) : (
                            <div className="space-y-4">
                                {config.results.map(result => (
                                    <ResultItem
                                        key={result.key}
                                        result={result}
                                        value={results[result.key]}
                                    />
                                ))}

                                {results.notes?.length > 0 && (
                                    <ResultNotes notes={results.notes} />
                                )}

                                {results.breakdown && (
                                    <ResultBreakdown breakdown={results.breakdown} />
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Charts */}
                {results && config.charts?.length > 0 && (
                    <section className="mt-6 space-y-6">
                        {config.charts.map((chartConfig, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6 text-dark-blue font-songer">
                                    {chartConfig.title}
                                </h2>
                                <AutoChart config={chartConfig} results={results} />
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </>
    );
};