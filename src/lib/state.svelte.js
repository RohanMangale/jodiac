import { calculateReportMetrics } from './reportCalculation.js'

const storageKey = 'jodiac.app-state'

// Loads and validates the saved state when running in a browser.
function loadState() {
  if (typeof window === 'undefined') return { profile: null, dates: [] }

  try {
    const savedState = JSON.parse(window.localStorage.getItem(storageKey))
    if (!savedState || typeof savedState !== 'object' || !Array.isArray(savedState.dates)) {
      return { profile: null, dates: [] }
    }

    const profile = savedState.profile
    const firstName = typeof profile?.firstName === 'string'
      ? profile.firstName
      : typeof profile?.name === 'string'
        ? profile.name
        : null
    const lastName = typeof profile?.lastName === 'string' ? profile.lastName : ''
    const validProfile = firstName !== null
      ? { firstName, lastName, gender: String(profile.gender ?? '') }
      : null

    return { profile: validProfile, dates: savedState.dates }
  } catch (error) {
    console.warn('Could not load saved Jodiac data.', error)
    return { profile: null, dates: [] }
  }
}

export const appState = $state(loadState())

// Writes the complete application state as a single local-storage value.
function persistState() {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(appState))
  } catch (error) {
    console.error('Could not save Jodiac data in this browser.', error)
  }
}

// Saves a profile and persists it with the rest of the application state.
/** @param {{ firstName: string, lastName: string, gender: string }} profile */
export function saveProfile(profile) {
  appState.profile = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    gender: profile.gender,
  }
  persistState()
}

// Adds a date entry and persists the complete application state.
export function addDate(dateEntry) {
  appState.dates.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: dateEntry.name,
    place: dateEntry.place,
    date: dateEntry.date,
    date_type: dateEntry.date_type,
    compatibility: null,
    evaluations: [],
    report: {
      overallScore: 0,
      evaluatedCount: 0,
      totalQuestions: 0,
      dealBreakers: {},
      alignedCategories: [],
      differenceCategories: [],
    },
    test_completed: false,
  })
  persistState()
}

// Rebuilds the top-level report score whenever an evaluation is saved or updated.
export function updateDateReportOverallScore(id) {
  const dateEntry = appState.dates.find((entry) => entry.id === id)
  if (!dateEntry) return

  const metrics = calculateReportMetrics(dateEntry.evaluations ?? [])

  dateEntry.report = {
    ...(dateEntry.report ?? {}),
    ...metrics,
  }

  persistState()
}

// Updates the completion state for a date questionnaire and persists the complete application state.
export function setDateTestCompleted(id, completed) {
  const dateEntry = appState.dates.find((entry) => entry.id === id)
  if (!dateEntry) return

  dateEntry.test_completed = Boolean(completed)
  persistState()
}

// Updates a date entry without replacing its identity or compatibility score.
export function updateDate(id, dateEntry) {
  const existingDate = appState.dates.find((entry) => entry.id === id)
  if (!existingDate) return

  existingDate.name = dateEntry.name
  existingDate.place = dateEntry.place
  existingDate.date = dateEntry.date
  existingDate.date_type = dateEntry.date_type
  persistState()
}

// Saves or updates one question evaluation on its associated date.
export function saveEvaluation(dateId, evaluation) {
  const dateEntry = appState.dates.find((entry) => entry.id === dateId)
  if (!dateEntry) return

  const evaluations = Array.isArray(dateEntry.evaluations) ? dateEntry.evaluations : []
  const existingIndex = evaluations.findIndex((entry) => entry.question_id === evaluation.question_id)

  if (existingIndex === -1) {
    dateEntry.evaluations = [...evaluations, evaluation]
  } else {
    dateEntry.evaluations[existingIndex] = evaluation
  }

  updateDateReportOverallScore(dateId)
}

// Removes a date entry and persists the updated list.
export function deleteDate(id) {
  appState.dates = appState.dates.filter((entry) => entry.id !== id)
  persistState()
}