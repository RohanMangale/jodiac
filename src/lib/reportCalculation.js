// Calculates the compatibility score using the formula:
// ((T + 2W) / (4W)) * 100, where T is the sum of weighted points and W is the sum of importance weights.
export function calculateOverallScore(evaluations) {
  // No evaluations means there is no match quality to score yet.
  if (!Array.isArray(evaluations) || evaluations.length === 0) return 0

  const validEvaluations = evaluations.filter((evaluation) => evaluation?.skipped !== true)

  if (validEvaluations.length === 0) return 0

  // T = sum of all weighted question points for answered questions.
  const totalWeightedPoints = validEvaluations.reduce((sum, evaluation) => {
    const point = Number(evaluation?.point ?? 0)
    return sum + (Number.isFinite(point) ? point : 0)
  }, 0)

  // W = sum of all importance weights for answered questions.
  const totalImportanceWeight = validEvaluations.reduce((sum, evaluation) => {
    const weight = Number(evaluation?.importance ?? 0)
    return sum + (Number.isFinite(weight) ? weight : 0)
  }, 0)

  // Avoid dividing by zero when no importance value is available.
  if (totalImportanceWeight === 0) return 0

  // Apply the formula to convert the weighted result into a percentage.
  return Number((((totalWeightedPoints + (2 * totalImportanceWeight)) / (4 * totalImportanceWeight)) * 100).toFixed(1))
}

// Count deal-breaker issues by category, excluding skipped questions and any answer that did not actually conflict.
export function getDealBreakers(evaluations) {
  const safeEvaluations = Array.isArray(evaluations) ? evaluations : []
  const grouped = {}

  for (const evaluation of safeEvaluations) {
    if (evaluation?.skipped === true) continue

    const point = Number(evaluation?.point ?? 0)
    const isDealBreaker = evaluation?.is_deal_breaker === true || evaluation?.isDealBreaker === true

    if (!isDealBreaker || !Number.isFinite(point) || point >= 0) {
      continue
    }

    const category = String(evaluation?.category ?? 'Uncategorized')

    if (!grouped[category]) {
      grouped[category] = {
        count: 0,
        questions: [],
      }
    }

    grouped[category].count += 1

    const questionId = evaluation?.question_id ?? evaluation?.questionId ?? null
    if (questionId !== null && !grouped[category].questions.includes(questionId)) {
      grouped[category].questions.push(questionId)
    }
  }

  return grouped
}

// Sum valid answered question points by category.
/** @param {unknown} evaluations */
function getCategoryPointTotals(evaluations) {
  const safeEvaluations = Array.isArray(evaluations) ? evaluations : []
  const categoryTotals = new Map()

  for (const evaluation of safeEvaluations) {
    if (evaluation?.skipped === true) continue

    const rawPoint = evaluation?.point
    if (rawPoint === null || rawPoint === undefined) continue

    const point = Number(rawPoint)
    if (!Number.isFinite(point)) continue

    const category = String(evaluation?.category ?? '').trim()
    if (!category) continue

    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + point)
  }

  return categoryTotals
}

// Return categories whose answered weighted points sum to a positive value.
/** @param {unknown} evaluations */
export function getAlignedCategories(evaluations) {
  const categoryTotals = getCategoryPointTotals(evaluations)
  const alignedCategories = []

  for (const [category, points] of categoryTotals) {
    if (!Number.isFinite(points) || points <= 0) continue

    alignedCategories.push({ category, points })
  }

  return alignedCategories
}

// Return categories whose answered weighted points sum to a negative value.
/** @param {unknown} evaluations */
export function getDifferenceCategories(evaluations) {
  const categoryTotals = getCategoryPointTotals(evaluations)
  const differenceCategories = []

  for (const [category, points] of categoryTotals) {
    if (!Number.isFinite(points) || points >= 0) continue

    differenceCategories.push({ category, points })
  }

  return differenceCategories
}

// Build the shared report metrics from the saved evaluation list so the state layer stays thin.
export function calculateReportMetrics(evaluations) {
  const safeEvaluations = Array.isArray(evaluations) ? evaluations : []
  const totalQuestions = safeEvaluations.length
  const evaluatedCount = safeEvaluations.filter((evaluation) => evaluation?.skipped !== true).length
  const dealBreakers = getDealBreakers(safeEvaluations)

  return {
    overallScore: calculateOverallScore(safeEvaluations),
    evaluatedCount,
    totalQuestions,
    dealBreakers,
    alignedCategories: getAlignedCategories(safeEvaluations),
    differenceCategories: getDifferenceCategories(safeEvaluations),
  }
}
