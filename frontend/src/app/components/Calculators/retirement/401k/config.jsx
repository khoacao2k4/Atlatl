import { z } from 'zod';

export const config = {
    title: "401(k) Retirement Calculator",
    description: "Calculate how much your 401(k) contributions will grow over time with interactive charts",

    schema: z.object({
        currentAge: z.number()
            .min(18, "Must be at least 18")
            .max(100, "Must be no more than 100"),
        retirementAge: z.number()
            .min(50, "Must be at least 50")
            .max(80, "Must be no more than 80"),
        currentBalance: z.number()
            .min(0, "Cannot be negative"),
        annualContribution: z.number()
            .min(0, "Cannot be negative")
            .max(23000, "2024 limit is $23,000"),
        employerMatch: z.number()
            .min(0, "Cannot be negative")
            .max(100, "Cannot exceed 100%"),
        returnRate: z.number()
            .min(0, "Cannot be negative")
            .max(20, "Must be no more than 20%"),
    }).refine((data) => data.retirementAge > data.currentAge, {
        message: "Retirement age must be greater than current age",
        path: ["retirementAge"],
    }),

    defaultValues: {
        currentAge: 30,
        retirementAge: 65,
        currentBalance: 50000,
        annualContribution: 10000,
        employerMatch: 5,
        returnRate: 7,
    },

    inputs: [
        {
            name: "currentAge",
            label: "Current Age",
            type: "number",
            required: true,
        },
        {
            name: "retirementAge",
            label: "Retirement Age",
            type: "number",
            required: true,
        },
        {
            name: "currentBalance",
            label: "Current 401(k) Balance",
            type: "number",
            required: true,
            hint: "Your current retirement savings"
        },
        {
            name: "annualContribution",
            label: "Annual Contribution",
            type: "number",
            required: true,
            hint: "Maximum $23,000 for 2024"
        },
        {
            name: "employerMatch",
            label: "Employer Match (%)",
            type: "number",
            required: true,
            step: 0.1,
        },
        {
            name: "returnRate",
            label: "Expected Annual Return (%)",
            type: "number",
            required: true,
            step: 0.1,
            hint: "Historical average is ~7-8%"
        },
    ],

    calculate: (data) => {
        const years = data.retirementAge - data.currentAge;
        const rate = data.returnRate / 100;
        const employerMatchAmount = data.annualContribution * (data.employerMatch / 100);
        const totalAnnualContribution = data.annualContribution + employerMatchAmount;

        let balance = data.currentBalance;
        let totalContributions = data.currentBalance;
        let totalEmployerMatch = 0;

        const yearlyData = [];
        let yearBalance = data.currentBalance;

        for (let i = 0; i <= years; i++) {
            yearlyData.push({
                year: i,
                label: `Year ${i}`,
                balance: Math.round(yearBalance),
                contributions: Math.round((data.annualContribution + employerMatchAmount) * i + data.currentBalance),
            });

            if (i < years) {
                yearBalance = yearBalance * (1 + rate) + totalAnnualContribution;
            }
        }

        for (let i = 0; i < years; i++) {
            balance = balance * (1 + rate) + totalAnnualContribution;
            totalContributions += data.annualContribution;
            totalEmployerMatch += employerMatchAmount;
        }

        return {
            finalBalance: balance,
            totalContributions: totalContributions,
            totalEmployerMatch: totalEmployerMatch,
            totalGrowth: balance - totalContributions - totalEmployerMatch,
            yearlyData: yearlyData,
            breakdown: [
                { label: "Your Contributions", value: totalContributions, format: "currency" },
                { label: "Employer Match", value: totalEmployerMatch, format: "currency" },
                { label: "Investment Growth", value: balance - totalContributions - totalEmployerMatch, format: "currency" },
            ]
        };
    },

    results: [
        {
            key: "finalBalance",
            label: "Retirement Balance",
            format: "currency",
            description: "Total value of your 401(k) at retirement"
        },
        {
            key: "totalGrowth",
            label: "Investment Growth",
            format: "currency",
            description: "Earnings from compound interest"
        },
    ],

    charts: [
        {
            type: 'line',
            title: 'Balance Growth Over Time',
            data: (results) => results.yearlyData,
            xKey: 'year',
            xLabel: 'Years',
            format: 'currency',
            lines: [
                { key: 'balance', name: 'Total Balance', color: '#f59e0b', width: 3 },
                { key: 'contributions', name: 'Total Contributions', color: '#3b82f6', width: 2, dashed: true }
            ],
            description: 'Orange line shows total balance including growth. Blue dashed line shows contributions only.',
            height: 300,
        },
        {
            type: 'pie',
            title: 'Final Balance Breakdown',
            data: (results) => [
                { name: 'Your Contributions', value: results.totalContributions, color: '#3b82f6' },
                { name: 'Employer Match', value: results.totalEmployerMatch, color: '#10b981' },
                { name: 'Investment Growth', value: results.totalGrowth, color: '#f59e0b' },
            ],
            valueKey: 'value',
            format: 'currency',
            height: 300,
        },
        {
            type: 'bar',
            title: 'Contribution vs Growth Comparison',
            data: (results) => [
                { name: 'Your Money', value: results.totalContributions },
                { name: 'Employer Match', value: results.totalEmployerMatch },
                { name: 'Investment Growth', value: results.totalGrowth },
            ],
            xKey: 'name',
            valueKey: 'value',
            format: 'currency',
            height: 250,
            showLegend: false,
        },
    ],
};