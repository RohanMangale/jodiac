<script>
  import scoringDefinitions from '../../configs/scoring_definations.json'

  let { differenceCategories = [] } = $props()

  const categoryLabels = scoringDefinitions.categories
  const categorySummaries = {
    personality_values: 'Different values or viewpoints may be worth exploring together.',
    lifestyle_daily_life: 'Daily routines or free-time preferences may need discussion.',
    career_ambition: 'Career priorities or ambitions may call for a closer conversation.',
    finance: 'Different money habits or financial goals may need discussion.',
    family_parents: 'Expectations around family involvement may be worth clarifying.',
    marriage_expectations: 'You may have different expectations for commitment or married life.',
    home_housing_location: 'Housing or location preferences may need a shared plan.',
    communication_conflict: 'Different communication styles may benefit from an honest conversation.',
    future_life_goals: 'Long-term goals may need more alignment and discussion.',
  }

  // Convert category identifiers into their configured display labels.
  function humanizeCategory(category) {
    return categoryLabels[category] ?? category.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const entries = $derived(
    (Array.isArray(differenceCategories) ? differenceCategories : [])
      .filter((entry) => typeof entry?.category === 'string' && Number(entry?.points) < 0)
      .map((entry) => ({
        category: entry.category,
        label: humanizeCategory(entry.category),
        summary: categorySummaries[entry.category] ?? 'Your answers differ in this area; consider discussing what matters to each of you.',
      })),
  )
</script>

<section class="box report-difference-card">
  <div class="report-difference-header">
    <span class="report-difference-status-icon" aria-hidden="true">
      <i class="fa-solid fa-circle-exclamation"></i>
    </span>
    <p class="report-difference-title">Difference to think about</p>
    <span class="report-difference-count">{entries.length}</span>
  </div>

  <p class="report-difference-intro">Topics where your answers may need a little more conversation.</p>

  {#if entries.length === 0}
    <p class="report-empty-copy">No categories to discuss yet.</p>
  {:else}
    <div class="report-difference-list">
      {#each entries as entry (entry.category)}
        <article class="report-difference-row">
          <span class="report-difference-row-icon" aria-hidden="true">
            <i class="fa-solid fa-circle-exclamation"></i>
          </span>
          <div class="report-difference-copy">
            <p class="report-difference-label">{entry.label}</p>
            <p class="report-difference-summary">{entry.summary}</p>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>