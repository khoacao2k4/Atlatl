'use client';

import React, { useState } from 'react';
import { CalculatorBase } from '../components/Calculators/CalculatorBase';
import { config as _1031Exchange } from '../components/Calculators/configs/1031-exchange/config';
import { config as amt } from '../components/Calculators/configs/amt/config';
import { config as armVsFixedRateMortgage } from '../components/Calculators/configs/arm-vs-fixed-rate-mortgage/config';
import { config as beneficiaryRmd } from '../components/Calculators/configs/beneficiary-rmd/config';
import { config as biweeklyMortgagePayment } from '../components/Calculators/configs/biweekly-mortgage-payment/config';
import { config as collegeSavings } from '../components/Calculators/configs/college-savings/config';
import { config as companyStockDistributionAnalysis } from '../components/Calculators/configs/company-stock-distribution-analysis/config';
import { config as investmentProperty } from '../components/Calculators/configs/investment-property/config';
import { config as leaseVsBuy } from '../components/Calculators/configs/lease-vs-buy/config';
import { config as mortgageRefinance } from '../components/Calculators/configs/mortgage-refinance/config';
import { config as roth401kVsTraditional401k } from '../components/Calculators/configs/roth-401k-vs-traditional-401k/config';
import { config as rothIraConversion } from '../components/Calculators/configs/roth-ira-conversion/config';

export default function CalculatorsPage() {
    const [selectedCalc, setSelectedCalc] = useState('beneficiaryRmd');

    const calculators = {
        beneficiaryRmd,
        companyStockDistributionAnalysis,
        roth401kVsTraditional401k,
        armVsFixedRateMortgage,
        _1031Exchange,
        amt,
        biweeklyMortgagePayment,
        collegeSavings,
        investmentProperty,
        leaseVsBuy,
        mortgageRefinance,
        rothIraConversion,
    };

    return (
        <div className="min-h-screen bg-light-blue py-16">
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
                        <option value="beneficiaryRmd">RMD Beneficiary Calculator</option>
                        <option value="companyStockDistributionAnalysis">Company Stock Distribution</option>
                        <option value="roth401kVsTraditional401k">Roth 401(k) vs Traditional 401(k)</option>
                        <option value="armVsFixedRateMortgage">ARM vs Fixed-Rate Mortgage</option>
                        <option value="_1031Exchange">1031 Exchange Calculator</option>
                        <option value="amt">AMT Calculator</option>
                        <option value="biweeklyMortgagePayment">Biweekly Mortgage Payment</option>
                        <option value="collegeSavings">College Savings Calculator</option>
                        <option value="investmentProperty">Investment Property Calculator</option>
                        <option value="leaseVsBuy">Lease vs Buy Calculator</option>
                        <option value="mortgageRefinance">Mortgage Refinance Calculator</option>
                        <option value="rothIraConversion">Roth IRA Conversion Calculator</option>
                    </select>
                </div>
            </div>

            <CalculatorBase key={selectedCalc} config={calculators[selectedCalc]} />
        </div>
    );
}
