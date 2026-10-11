<script>
  let { score = 0, evaluatedCount = 0, totalQuestions = 0 } = $props()

  const roundedScore = $derived(Math.max(0, Math.min(100, Number(score ?? 0))))
  const displayScore = $derived(Math.round(roundedScore))
</script>

<section class="box report-score-card has-background-success-light">
  <p class="title is-5 mb-4 report-card-title">Overall Compatibility</p>

  <div class="report-score-row is-flex is-align-items-end is-justify-content-center">
    <span class="report-score-value">{displayScore}</span>
    <span class="report-score-total">/ 100</span>
  </div>

  <progress class="progress is-success is-small report-score-progress" value={roundedScore} max="100">
    {displayScore}%
  </progress>

  <p class="report-score-meta">
    <strong>{evaluatedCount}</strong> of <strong>{totalQuestions}</strong> questions evaluated
  </p>

  <p class="report-score-note">This score reflects your responses so far. It's a guide and not a predication of relationship success.</p>
</section>
