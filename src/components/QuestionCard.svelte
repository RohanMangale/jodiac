<script>
  let {
    question,
    dateEntry,
    response = { importance: null, compatibility: null, isDealBreaker: false, note: '' },
    onResponseChange,
    profile,
  } = $props()

  let helpOpen = $state(false)
  let date_first_name = $derived(dateEntry?.name?.split(' ')[0] ?? 'your date')

  const importanceOptions = [
    {
      value: 'not_matter',
      label: 'Not much',
      description: "Doesn't affect my decision much",
      variant: 'green',
    },
    {
      value: 'matters_to_me',
      label: 'Matters to me',
      description: 'Somewhat important',
      variant: 'amber',
    },
    {
      value: 'matters_a_lot',
      label: 'Matters a lot',
      description: 'Very important for my compatibility',
      variant: 'rose',
    },
  ]

  const compatibilityOptions = [
    { value: 'very_compatible', label: 'Very Compatible', meta: 'Strong alignment', emoji: '💚', tone: 'green' },
    { value: 'compatible', label: 'Compatible', meta: 'Generally works for me', emoji: '👍', tone: 'soft' },
    { value: 'need_to_explore', label: 'Need to Explore', meta: 'Needs more information', emoji: '🤔', tone: 'neutral' },
    { value: 'not_very_compatible', label: 'Not Very Compatible', meta: 'Some meaningful differences', emoji: '⚠️', tone: 'amber' },
    { value: 'highly_incompatible', label: 'Highly Incompatible', meta: 'Major compatibility issues', emoji: '🚩', tone: 'red' },
  ]

  const dealBreakerOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ]

  function update(field, value) {
    onResponseChange?.({ ...response, [field]: value })
  }
</script>

<section class="question-card-panel prompt-card-panel" aria-label={`Question to ask ${date_first_name}`}>
  <div class="question-card-header">
    <span class="question-card-icon" aria-hidden="true">💬</span>
    <span>{profile?.firstName ? `${profile.firstName}, ask` : 'Ask'} this question to {date_first_name}</span>
  </div>

  <h2 class="question-card-title">{question?.question}</h2>

  <div class="help-panel" aria-live="polite">
    <button
      class="help-panel-toggle"
      type="button"
      aria-expanded={helpOpen}
      onclick={() => (helpOpen = !helpOpen)}
    >
      <span class="help-toggle-icon" aria-hidden="true">💡</span>
      <span>Need help continuing the conversation?</span>
      {#if helpOpen}
        <i class="fa-solid fa-angle-up"></i>
      {:else}
        <i class="fa-solid fa-angle-down"></i>
      {/if}
    </button>

    {#if helpOpen}
      <div class="help-panel-body">
        <p>Try one of these follow-up questions:</p>
        <ul>
          {#each question?.followUps ?? [] as followUp (followUp)}
            <li>
              <span class="help-list-copy">{followUp}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

  </section>

  <section class="question-card-panel assessment-card-panel" aria-label="Your answers">
    <div class="question-card-header">
      <span class="question-card-icon" aria-hidden="true">📝</span>
      <span>{profile?.firstName ? `${profile.firstName}, answer` : 'Answer'} these questions below after hearing {date_first_name}'s response</span>
    </div>

  <div
    class="question-section"
    id="importance-section"
    role="group"
    aria-labelledby="importance-heading"
    tabindex="-1"
  >
    <h3 id="importance-heading">How much does this matter to you?</h3>
    <div class="option-grid importance-grid">
      {#each importanceOptions as option (option.value)}
        <button
          type="button"
          class="option-tile importance-tile"
          class:is-selected={response.importance === option.value}
          class:tile-green={option.variant === 'green'}
          class:tile-amber={option.variant === 'amber'}
          class:tile-rose={option.variant === 'rose'}
          onclick={() => update('importance', option.value)}
        >
          <span class="option-bullet" aria-hidden="true"></span>
          <span class="option-label">{option.label}</span>
          <span class="option-copy">{option.description}</span>
        </button>
      {/each}
    </div>
  </div>

  <div
    class="question-section"
    id="compatibility-section"
    role="group"
    aria-labelledby="compatibility-heading"
    tabindex="-1"
  >
    <h3 id="compatibility-heading">How compatible is {date_first_name}'s answer with you?</h3>
    <div class="option-grid compatibility-grid">
      {#each compatibilityOptions as option (option.value)}
        <button
          type="button"
          class="option-tile compatibility-tile"
          class:is-selected={response.compatibility === option.value}
          class:tile-green={option.tone === 'green'}
          class:tile-soft={option.tone === 'soft'}
          class:tile-neutral={option.tone === 'neutral'}
          class:tile-amber={option.tone === 'amber'}
          class:tile-red={option.tone === 'red'}
          onclick={() => update('compatibility', option.value)}
        >
          <span class="compatibility-emoji" aria-hidden="true">{option.emoji}</span>
          <span class="option-label">{option.label}</span>
          <span class="option-copy">{option.meta}</span>
        </button>
      {/each}
    </div>
  </div>

  <div
    class="question-section deal-breaker-section"
    id="deal-breaker-section"
    role="group"
    aria-labelledby="deal-breaker-heading"
    tabindex="-1"
  >
    <div class="deal-breaker-heading">
      <span class="deal-breaker-icon" aria-hidden="true">⛔</span>
      <h3 id="deal-breaker-heading">Is this a deal-breaker for you?</h3>
    </div>

    <div class="deal-breaker-actions">
      {#each dealBreakerOptions as option (option.label)}
        <button
          type="button"
          class="button is-rounded deal-breaker-button"
          class:is-selected={response.isDealBreaker === option.value}
          onclick={() => update('isDealBreaker', option.value)}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="note-panel">
    <label class="note-label" for="question-note">Add a note (optional)</label>
    <div class="note-box">
      <span class="note-icon" aria-hidden="true"><i class="fa-regular fa-note-sticky"></i></span>
      <textarea
        id="question-note"
        class="textarea is-small note-input"
        rows="1"
        placeholder="Write anything you want to remember about their answer..."
        value={response.note ?? ''}
        oninput={(event) => update('note', event.currentTarget.value)}
      ></textarea>
      <span class="note-chevron" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
    </div>
  </div>
</section>
