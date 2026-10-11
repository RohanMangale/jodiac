<script>
  import scoringDefinitions from '../../configs/scoring_definations.json'

  let { dealBreakers = {}, questionLibrary = null } = $props()

  const categoryLabels = scoringDefinitions.categories

  const questionSets = $derived(questionLibrary?.questionSets ?? {})

  function humanizeCategory(category) {
    return categoryLabels[category] ?? category?.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) ?? 'Category'
  }

  function getQuestionById(questionId) {
    if (!questionId || !questionSets) return null

    for (const set of Object.values(questionSets)) {
      const match = (set?.questions ?? []).find((question) => question?.id === questionId)
      if (match) return match
    }

    return null
  }

  const entries = $derived(
    Object.entries(dealBreakers ?? {}).map(([category, detail]) => {
      const questions = Array.isArray(detail?.questions) ? detail.questions : []
      const questionList = questions
        .map((questionId) => getQuestionById(questionId))
        .filter(Boolean)

      return {
        category,
        label: humanizeCategory(category),
        count: Number(detail?.count ?? questionList.length ?? 0),
        questionList,
      }
    }),
  )

  let expandedCategory = $state(null)

  function toggleCategory(category) {
    expandedCategory = expandedCategory === category ? null : category
  }
</script>

<section class="box report-dealbreakers-card">
  <div class="report-card-header is-flex is-align-items-center is-justify-content-space-between">
    <p class="report-card-title has-text-weight-bold">Potential Deal-breakers</p>
    <span class="report-pill">{entries.length}</span>
  </div>

  {#if entries.length === 0}
    <p class="report-empty-copy">No deal-breaker issues flagged yet.</p>
  {:else}
    <div class="dealbreaker-list">
      {#each entries as entry (entry.category)}
        <div class="dealbreaker-item">
          <button
            class="dealbreaker-row"
            type="button"
            aria-expanded={expandedCategory === entry.category}
            onclick={() => toggleCategory(entry.category)}
          >
            <div class="dealbreaker-row-main">
              <span class="dealbreaker-icon" aria-hidden="true">!</span>
              <div class="dealbreaker-copy">
                <span class="dealbreaker-label">{entry.label}</span>
                <span class="dealbreaker-count">{entry.count} issue{entry.count === 1 ? '' : 's'}</span>
              </div>
            </div>

            <span class="dealbreaker-arrow" aria-hidden="true">›</span>
          </button>

          {#if expandedCategory === entry.category}
            <div class="dealbreaker-detail-panel">
              {#if entry.questionList.length === 0}
                <p class="dealbreaker-detail-empty">No questions available for this category.</p>
              {:else}
                <ul class="dealbreaker-detail-list">
                  {#each entry.questionList as question (question.id)}
                    <li>{question.question}</li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>
