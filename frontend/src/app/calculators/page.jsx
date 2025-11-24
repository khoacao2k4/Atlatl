'use client';

import React, { useState } from 'react';
import { CalculatorBase } from '../components/Calculators/CalculatorBase';
import { config as _401k } from '../components/Calculators/retirement/401k/config';
import { config as rmd } from '../components/Calculators/rmd-beneficiary/config';
import { config as companyStock } from '../components/Calculators/company-stock-distribution/config';
import { config as rothVsTraditional } from '../components/Calculators/retirement/roth-vs-traditional/config';
import { config as armVsFixed } from '../components/Calculators/mortgage/arm-vs-fixed/config';
import { config as simpleIra } from '../components/Calculators/retirement/roth-ira/config';

export default function CalculatorsPage() {
    // Specifies which calculator is currently selected
    const [selectedCalc, setSelectedCalc] = useState('401k');

    // Map of available calculators. Can easily add more calculators here
    const calculators = {
        '401k': _401k,
        'rmd': rmd,
        'companyStock': companyStock,
        'rothVsTraditional': rothVsTraditional,
        'armVsFixed': armVsFixed,
        'simpleIra': simpleIra,
    };

    return (
        <div className="min-h-screen bg-light-blue py-16">
            {/* Dropdown to select the calculator */}
            <div className="max-w-6xl mx-auto mb-6 px-10">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <label className="block text-sm font-medium text-black mb-2 font-work-sans">
                        Select Calculator:
                    </label>
                    <select
                        value={selectedCalc}
                        onChange={(e) => setSelectedCalc(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-bold-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-bold-blue font-work-sans"
                    >
                        <option value="401k">401(k) Calculator</option>
                        <option value="rmd">RMD Beneficiary Calculator</option>
                        <option value="companyStock">Company Stock Distribution</option>
                        <option value="rothVsTraditional">Roth 401(k) vs Traditional 401(k)</option>
                        <option value="armVsFixed">ARM vs Fixed-Rate Mortgage</option>
                        <option value="simpleIra">Simple IRA Contribution Calculator</option>
                    </select>
                </div>
            </div>

            {/* Render the CalculatorBase component with the selected calculator's config */}
            <CalculatorBase config={calculators[selectedCalc]} />
        </div>
    );
}