// Example Calculator Config Template
export const exampleConfig = {
  title: "Calculator Title", // Displayed at the top of the calculator
  description: "Short description of what this calculator does.",

  // Input fields
  inputs: [
    {
      name: "input1",            // Unique key for the input
      label: "Input 1",          // Display label
      type: "number",            // Input type: number, text, etc.
      placeholder: "",           // Placeholder text
      required: true,            // Whether input is required
      step: 1,                   // Step size (for number inputs)
      hint: "Optional hint text" // Additional info for the user
    },
    {
      name: "input2",
      label: "Input 2",
      type: "number",
      placeholder: "",
      required: false,
      step: 1,
    }
  ],

  // Default values for the form
  defaultValues: {
    input1: null,
    input2: null,
  },

  // Validation schema (using Zod)
  schema: null, // replace with your zod object schema

  // Calculation function
  calculate: (inputs) => {
    // inputs = { input1: number, input2: number, ... }
    // return an object with calculated results
    return {
      result1: null,
      result2: null,
      breakdown: [
        { label: "Step 1", value: null, format: "currency" },
        { label: "Step 2", value: null, format: "percentage" },
      ],
    };
  },

  // Results to display
  results: [
    {
      key: "result1",
      label: "Result 1",
      format: "currency", // or "number", "percentage"
      description: "Optional description for this result"
    },
    {
      key: "result2",
      label: "Result 2",
      format: "percentage",
    }
  ],

  // Charts (optional)
  charts: [
    {
      type: "line",         // "line", "bar", "pie", "area"
      title: "Example Chart",
      xKey: "xValue",
      yLabel: "Y Axis Label",
      xLabel: "X Axis Label",
      valueKey: "yValue",   // For bar/pie charts
      lines: [
        {
          key: "line1",
          name: "Line 1",
          color: "#3b82f6",
          width: 2,
          dashed: false,
          showDots: true,
        }
      ],
      areas: [],            // For area charts
      bars: [],             // For bar charts
      outerRadius: 100,     // For pie charts
      showLabels: true,
      description: "Optional description for this chart"
    }
  ]
};
