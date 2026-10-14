<script>
  import scoringDefinitions from '../../configs/scoring_definations.json'

  let { alignedCategories = [] } = $props()

  const categoryLabels = scoringDefinitions.categories
  const categorySummaries = {
    personality_values: 'Similar values around honesty, kindness and personal growth.',
    lifestyle_daily_life: 'Similar expectations around routines, free time and hobbies.',
    career_ambition: "Both seem supportive of each other's professional goals.",
    finance: 'Similar views on spending, saving and financial priorities.',
    family_parents: 'Shared expectations around family involvement and responsibilities.',
    marriage_expectations: 'Similar hopes for commitment and married life.',
    home_housing_location: 'Similar preferences for where and how to build a home.',
    communication_conflict: 'A shared approach to honest conversations and resolving conflict.',
    future_life_goals: 'Your long-term plans and life priorities seem to align.',
  }

  // Convert category identifiers into their configured display labels.
  function humanizeCategory(category) {
    return categoryLabels[category] ?? category.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const entries = $derived(
    (Array.isArray(alignedCategories) ? alignedCategories : [])
      .filter((entry) => typeof entry?.category === 'string' && Number(entry?.points) > 0)
      .map((entry) => ({
        category: entry.category,
        label: humanizeCategory(entry.category),
        summary: categorySummaries[entry.category] ?? 'Your answers show a positive match in this area.',
      })),
  )
</script>

<section class="box report-aligned-card">
  <div class="report-aligned-header">
    <span class="report-aligned-status-icon" aria-hidden="true">
      <i class="fa-solid fa-check"></i>
    </span>
    <p class="report-aligned-title">Where you seem aligned</p>
    <span class="report-aligned-count">{entries.length}</span>
  </div>

  <p class="report-aligned-intro">Topics where your answers are compatible, especially the ones that matter to you.</p>

  {#if entries.length === 0}
    <p class="report-empty-copy">No positively aligned categories yet.</p>
  {:else}
    <div class="report-aligned-list">
      {#each entries as entry (entry.category)}
        <article class="report-aligned-row">
          <span class="report-aligned-row-icon" aria-hidden="true">
            <i class="fa-solid fa-check"></i>
          </span>
          <div class="report-aligned-copy">
            <p class="report-aligned-label">{entry.label}</p>
            <p class="report-aligned-summary">{entry.summary}</p>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>