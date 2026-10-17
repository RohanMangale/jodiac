<script>
  import { tick } from 'svelte'
  import QuestionCard from '../components/QuestionCard.svelte'
  import ConfirmationDialog from '../components/ConfirmationDialog.svelte'
  import scoringDefinitions from '../configs/scoring_definations.json'
  import questionLibrary from '../lib/data/questions.json'
  import { saveEvaluation } from '../lib/state.svelte.js'

  let { dateEntry, onBack, onComplete, profile } = $props()

  const questionMap = {
    arranged_marriage: 'arrangedMarriage',
    casual_date: 'casualDating',
    phone_call: 'phoneCallDate',
  }

  const totalQuestions = $derived(
    (() => {
      const key = questionMap[dateEntry?.date_type] ?? 'arrangedMarriage'
      const set = questionLibrary.questionSets?.[key]?.questions ?? []
      return [...set].sort((left, right) => left.order - right.order).length
    })(),
  )

  let currentIndex = $state(0)
  let responses = $state({})
  let responsesDateId = $state(null)
  let abortConfirmOpen = $state(false)
  let skipConfirmOpen = $state(false)
  let validationOpen = $state(false)
  let validationErrors = $state([])
  let transitionPhase = $state('idle')
  let pendingIndex = $state(null)
  let showQuestionOverview = $state(false)
  let questionCardElement = $state(null)

  const orderedQuestions = $derived(
    (() => {
      const key = questionMap[dateEntry?.date_type] ?? 'arrangedMarriage'
      const set = questionLibrary.questionSets?.[key]?.questions ?? []
      return [...set].sort((left, right) => left.order - right.order)
    })(),
  )

  const currentQuestion = $derived(orderedQuestions[currentIndex] ?? null)
  const currentResponse = $derived(
    currentQuestion ? (responses[currentQuestion.id] ?? { importance: null, compatibility: null, isDealBreaker: false, note: '' }) : { importance: null, compatibility: null, isDealBreaker: false, note: '' },
  )

  const categoryOrder = {
    lifestyle_daily_life: 0,
    personality_values: 1,
    career_ambition: 2,
    finance: 3,
    family_parents: 4,
    marriage_expectations: 5,
    home_housing_location: 6,
    communication_conflict: 7,
    future_life_goals: 8,
    background_upbringing: 9,
    religion_faith: 10,
  }

  const questionOverview = $derived(
    (() => {
      const groups = new Map()

      for (const question of orderedQuestions) {
        const category = question.category ?? 'uncategorized'
        if (!groups.has(category)) {
          groups.set(category, [])
        }
        groups.get(category).push(question)
      }

      return [...groups.entries()].sort(([leftCategory], [rightCategory]) => {
        return (categoryOrder[leftCategory] ?? 99) - (categoryOrder[rightCategory] ?? 99)
      })
    })(),
  )

  function humanizeCategory(category) {
    const mapped = scoringDefinitions.categories?.[category] ?? null
    if (mapped) return mapped

    return String(category || 'Uncategorized')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase())
  }

  const progressValue = $derived(totalQuestions === 0 ? 0 : ((currentIndex + 1) / totalQuestions) * 100)

  $effect(() => {
    const currentDateId = dateEntry?.id
    if (!currentDateId || responsesDateId === currentDateId) return

    responses = Object.fromEntries(
      (dateEntry.evaluations ?? []).map((evaluation) => [
        evaluation.question_id,
        restoreResponse(evaluation),
      ]),
    )
    responsesDateId = currentDateId
  })

  // Converts persisted scoring values back to the option keys used by the UI.
  function restoreResponse(evaluation) {
    const importance = Object.entries(scoringDefinitions.scoring.importance)
      .find(([, definition]) => definition.weight === evaluation.importance)?.[0] ?? null
    const compatibility = Object.entries(scoringDefinitions.scoring.compatibility)
      .find(([, definition]) => definition.score === evaluation.compatibility)?.[0] ?? null

    return {
      importance,
      compatibility,
      isDealBreaker: evaluation.is_deal_breaker ?? false,
      note: evaluation.notes ?? '',
      skipped: Boolean(evaluation.skipped ?? false),
    }
  }

  function updateCurrentResponse(partial) {
    if (!currentQuestion) return
    const updatedResponse = {
      ...currentResponse,
      ...partial,
    }
    responses[currentQuestion.id] = updatedResponse

    saveEvaluation(dateEntry.id, {
      question_id: currentQuestion.id,
      date_type: dateEntry.date_type,
      category: currentQuestion.category,
      importance: scoringDefinitions.scoring.importance[updatedResponse.importance]?.weight ?? null,
      compatibility: scoringDefinitions.scoring.compatibility[updatedResponse.compatibility]?.score ?? null,
      is_deal_breaker: updatedResponse.isDealBreaker ?? false,
      notes: updatedResponse.note ?? '',
      skipped: false,
      point: scoringDefinitions.scoring.importance[updatedResponse.importance]?.weight * scoringDefinitions.scoring.compatibility[updatedResponse.compatibility]?.score ?? null,
    })
  }

  function navigateToQuestion(index) {
    if (transitionPhase !== 'idle' || index < 0 || index >= orderedQuestions.length) return
    pendingIndex = index
    transitionPhase = 'exiting'
  }

  async function handleQuestionAnimationEnd(event) {
    if (event.target !== event.currentTarget) return

    if (event.animationName === 'question-card-exit' && transitionPhase === 'exiting') {
      if (pendingIndex !== null) currentIndex = pendingIndex
      transitionPhase = 'entering'
      await tick()
      questionCardElement?.focus({ preventScroll: true })
      questionCardElement?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
      return
    }

    if (event.animationName === 'question-card-enter' && transitionPhase === 'entering') {
      pendingIndex = null
      transitionPhase = 'idle'
    }
  }

  function handlePrevious() {
    navigateToQuestion(currentIndex - 1)
  }

  async function reviewRequiredAnswer() {
    const firstMissingField = validationErrors[0]
    validationOpen = false
    validationErrors = []
    await tick()

    const target = firstMissingField ? document.getElementById(firstMissingField.target) : null
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  async function handleNext() {
    if (!currentQuestion || transitionPhase !== 'idle') return

    const missingFields = [
      {
        label: 'How much does this matter to you?',
        target: 'importance-section',
        missing: currentResponse.importance === null,
      },
      {
        label: "How compatible is their answer with you?",
        target: 'compatibility-section',
        missing: currentResponse.compatibility === null,
      },
      {
        label: 'Is this a deal-breaker for you?',
        target: 'deal-breaker-section',
        missing: currentResponse.isDealBreaker === undefined || currentResponse.isDealBreaker === null,
      },
    ].filter((field) => field.missing)

    if (missingFields.length > 0) {
      validationErrors = missingFields
      validationOpen = true
      await tick()
      document.querySelector('.validation-review-button')?.focus()
      return
    }

    if (currentIndex < orderedQuestions.length - 1) {
      navigateToQuestion(currentIndex + 1)
      return
    }

    onComplete?.()
  }

  function confirmSkipQuestion() {
    if (!currentQuestion || transitionPhase !== 'idle') return

    const currentResponseState = { ...currentResponse }
    const shouldClearAnswer = Object.values(currentResponseState).some((value) => value !== null && value !== '' && value !== false)

    if (shouldClearAnswer) {
      responses[currentQuestion.id] = {
        importance: null,
        compatibility: null,
        isDealBreaker: null,
        note: '',
        skipped: true,
      }
    } else {
      responses[currentQuestion.id] = {
        importance: null,
        compatibility: null,
        isDealBreaker: null,
        note: '',
        skipped: true,
      }
    }

    saveEvaluation(dateEntry.id, {
      question_id: currentQuestion.id,
      date_type: dateEntry.date_type,
      category: currentQuestion.category,
      importance: null,
      compatibility: null,
      is_deal_breaker: null,
      notes: '',
      skipped: true,
      point: null,
    })

    skipConfirmOpen = false

    if (currentIndex < orderedQuestions.length - 1) {
      navigateToQuestion(currentIndex + 1)
      return
    }

    onComplete?.()
  }

  function handleSkip() {
    if (!currentQuestion || transitionPhase !== 'idle') return
    skipConfirmOpen = true
  }
</script>

<main class="page-content questionnaire-page">
  <div class="questionnaire-shell">
    <header class="questionnaire-topbar">
      <button
        class="button is-white questionnaire-back-button"
        type="button"
        aria-label="Exit questionnaire"
        title="Exit questionnaire"
        onclick={() => (abortConfirmOpen = true)}
      >
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>

      <div class="questionnaire-counter">Question {Math.min(currentIndex + 1, totalQuestions || 1)} of {totalQuestions || 1}</div>

      <button
        class="button questionnaire-see-all"
        type="button"
        aria-label="Show all questions by category"
        onclick={() => (showQuestionOverview = true)}
      >
        <i class="fa-solid fa-list-ul" aria-hidden="true"></i>
        <span>All questions</span>
      </button>
    </header>

    <div class="questionnaire-progress-wrap">
      <progress class="progress is-success questionnaire-progress" value={progressValue} max="100">
        {Math.round(progressValue)}%
      </progress>
    </div>

    {#if currentQuestion}
      <div
        class="question-card-transition"
        bind:this={questionCardElement}
        class:is-exiting={transitionPhase === 'exiting'}
        class:is-entering={transitionPhase === 'entering'}
        role="region"
        aria-labelledby="current-question-title"
        aria-busy={transitionPhase !== 'idle'}
        tabindex="-1"
        onanimationend={handleQuestionAnimationEnd}
      >
        <QuestionCard
          question={currentQuestion}
          dateEntry={dateEntry}
          response={currentResponse}
          onResponseChange={updateCurrentResponse}
          profile={profile}
        />
      </div>

      <div class="questionnaire-footer columns is-mobile">
        {#if currentIndex > 0}
          <div class="column is-4">
            <button class="button is-grey is-light questionnaire-prev-button" type="button" disabled={transitionPhase !== 'idle'} onclick={handlePrevious}>
              <i class="fa-solid fa-arrow-left"></i>
              <span>Previous</span>
            </button>
          </div>
        {/if}

        <div class="column {currentIndex > 0 ? 'is-4' : 'is-6'}">
          <button class="button is-light questionnaire-skip-button" type="button" disabled={transitionPhase !== 'idle'} onclick={handleSkip}>
            Skip
          </button>
        </div>

        <div class="column {currentIndex > 0 ? 'is-4' : 'is-6'}">
          <button class="button is-jodiac questionnaire-next-button" type="button" disabled={transitionPhase !== 'idle'} onclick={handleNext}>
            {currentIndex < orderedQuestions.length - 1 ? 'Next' : 'Finish'}
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    {:else}
      <div class="empty-question-set">
        <p>No questions are available for this date type yet.</p>
        <button class="button is-jodiac" type="button" onclick={onBack}>Back to dates</button>
      </div>
    {/if}
  </div>

  {#if showQuestionOverview}
    <div class="modal is-active question-overview-modal" aria-modal="true" role="dialog" aria-labelledby="question-overview-title">
      <button class="modal-background" type="button" aria-label="Close questions overview" onclick={() => (showQuestionOverview = false)}></button>

      <div class="modal-card question-overview-card">
        <header class="modal-card-head">
          <p class="modal-card-title" id="question-overview-title">
            <span class="icon is-small mr-2"><i class="fa-solid fa-list-ul" aria-hidden="true"></i></span>
            All questions
          </p>
          <button class="delete" type="button" aria-label="Close questions overview" onclick={() => (showQuestionOverview = false)}></button>
        </header>

        <section class="modal-card-body question-overview-body">
          {#each questionOverview as [category, questions] (category)}
            <div class="box category-overview-box">
              <div class="category-overview-header">
                <span class="tag is-jodiac is-light category-tag">{humanizeCategory(category)}</span>
                <span class="has-text-grey is-size-7">{questions.length} questions</span>
              </div>

              <ol class="question-overview-list">
                {#each questions as question (question.id)}
                  <li class="question-overview-item">
                    <span class="question-overview-number">{question.order}</span>
                    <p>{question.question}</p>
                  </li>
                {/each}
              </ol>
            </div>
          {/each}
        </section>

        <footer class="modal-card-foot is-justify-content-flex-end">
          <button class="button is-jodiac" type="button" onclick={() => (showQuestionOverview = false)}>
            <i class="fa-solid fa-check" aria-hidden="true"></i>
            <span>Close</span>
          </button>
        </footer>
      </div>
    </div>
  {/if}

  <ConfirmationDialog
    open={skipConfirmOpen}
    title="Skip this question?"
    message="This question will be left unanswered and you can continue to the next one."
    confirmLabel="Yes"
    cancelLabel="No"
    onConfirm={confirmSkipQuestion}
    onCancel={() => (skipConfirmOpen = false)}
  />

  {#if validationOpen}
    <div class="abort-confirmation-overlay">
      <div
        class="abort-confirmation-card validation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="answer-validation-title"
        aria-describedby="answer-validation-description"
        tabindex="-1"
      >
        <h3 id="answer-validation-title">Complete your answers</h3>
        <p id="answer-validation-description">Please answer these required sections before continuing. Your note is optional.</p>
        <ul class="validation-error-list">
          {#each validationErrors as error (error.target)}
            <li>{error.label}</li>
          {/each}
        </ul>
        <div class="abort-confirmation-actions">
          <button class="button is-jodiac validation-review-button" type="button" onclick={reviewRequiredAnswer}>
            Review answers
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if abortConfirmOpen}
    <div class="abort-confirmation-overlay" aria-live="polite">
      <div class="abort-confirmation-card">
        <h3>Leave this questionnaire?</h3>
        <p>Your answers for this session will be lost if you continue.</p>
        <div class="abort-confirmation-actions">
          <button class="button is-light" type="button" onclick={() => (abortConfirmOpen = false)}>Stay</button>
          <button class="button is-jodiac" type="button" onclick={onBack}>Leave</button>
        </div>
      </div>
    </div>
  {/if}
</main>
