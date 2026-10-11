<script>
  import ScoreCard from '../components/report_cards/ScoreCard.svelte'
  import DealBreakersCard from '../components/report_cards/DealBreakersCard.svelte'
  import questionLibrary from '../lib/data/questions.json'

  let { dateEntry, onBack } = $props()

  const displayDate = $derived(
    dateEntry?.date
      ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(
          new Date(`${dateEntry.date}T00:00:00`),
        )
      : 'Date not set',
  )

  const summaryText = $derived(
    dateEntry?.place ? ` • ${dateEntry.place}` : '',
  )

  const initial = $derived((dateEntry?.name ?? 'D').trim().charAt(0).toUpperCase() || 'D')
</script>

<main class="page-content report-page">
  <div class="report-shell">
    <header class="report-topbar is-flex is-align-items-center is-justify-content-space-between">
      <button class="button is-white report-back-button" type="button" aria-label="Back to dates" onclick={onBack}>
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>

      <h1 class="title is-5 has-text-centered m-0 report-page-title">Date Report</h1>

      <div class="report-topbar-spacer" aria-hidden="true"></div>
    </header>

    <section class="box report-hero is-flex is-align-items-center">
      <div class="report-avatar" aria-hidden="true">{initial}</div>

      <div class="report-summary">
        <h2 class="title is-5 mb-1">Date with {dateEntry?.name ?? 'Your date'}</h2>
        <p class="report-meta">{displayDate}{summaryText}</p>
      </div>
    </section>

    <ScoreCard
      score={dateEntry?.report?.overallScore ?? 0}
      evaluatedCount={dateEntry?.report?.evaluatedCount ?? 0}
      totalQuestions={dateEntry?.report?.totalQuestions ?? 0}
    />

    <DealBreakersCard dealBreakers={dateEntry?.report?.dealBreakers ?? {}} questionLibrary={questionLibrary} />
  </div>
</main>
