// Dynamic calculation engine for climate adaptation metrics
// Evaluates formulas based on current assumption values

export function calculateMetrics(activity, editedValues = {}) {
  // Merge original values with edited values
  const values = {}
  Object.entries(activity.assumptions).forEach(([key, assumption]) => {
    values[key] = editedValues[key] !== undefined ? editedValues[key] : assumption.value
  })

  // Calculate derived values from formulas
  const calculated = {}

  // Helper function to safely evaluate formula
  const evaluateFormula = (formula) => {
    try {
      // Replace variable names with their values
      let expression = formula
      Object.entries(values).forEach(([key, value]) => {
        const regex = new RegExp(key, 'g')
        expression = expression.replace(regex, value)
      })
      
      // Also replace already calculated values
      Object.entries(calculated).forEach(([key, value]) => {
        const regex = new RegExp(key, 'g')
        expression = expression.replace(regex, value)
      })

      // Evaluate the expression
      // eslint-disable-next-line no-eval
      return eval(expression)
    } catch (error) {
      console.error('Error evaluating formula:', formula, error)
      return 0
    }
  }

  // Calculate metrics in order (respecting dependencies)
  if (activity.calculated_metrics) {
    Object.entries(activity.calculated_metrics).forEach(([key, calc]) => {
      if (calc.formula) {
        calculated[key] = evaluateFormula(calc.formula)
      } else {
        calculated[key] = calc.value || 0
      }
    })
  }

  return calculated
}

// Format number for display
export function formatNumber(num, decimals = 2) {
  if (typeof num !== 'number') return num
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

// Calculate NPV factor
export function calculateNPVFactor(years, discountRate) {
  let factor = 0
  for (let i = 1; i <= years; i++) {
    factor += 1 / Math.pow(1 + discountRate / 100, i)
  }
  return factor
}

