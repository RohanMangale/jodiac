<script>
  let { dateEntry, onEdit, onDelete, onTakeTest, onOpenReport } = $props()
  let menuOpen = $state(false)

  const displayDate = $derived(
    dateEntry.date
      ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(
          new Date(`${dateEntry.date}T00:00:00`),
        )
      : 'Date not set',
  )
</script>

<article class="box date-card">
  <header class="is-flex is-justify-content-space-between is-align-items-flex-start">
    <h2 class="title is-4 is-flex-grow-1 mb-3">{dateEntry.name}</h2>
    <div class="dropdown is-right" class:is-active={menuOpen}>
      <div class="dropdown-trigger">
        <button
          class="button is-white"
          type="button"
          aria-label="More options for {dateEntry.name}"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="date-card-options-{dateEntry.id}"
          title="More options"
          onclick={() => (menuOpen = !menuOpen)}
        >
          <i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
        </button>
      </div>
      <div
        class="dropdown-menu"
        id="date-card-options-{dateEntry.id}"
        role="group"
        aria-label="Date options for {dateEntry.name}"
      >
        <div class="dropdown-content">
          <button class="dropdown-item" type="button" onclick={() => onEdit(dateEntry)}>Edit</button>
          <button class="dropdown-item" type="button" onclick={() => onDelete(dateEntry.id)}>Delete</button>
        </div>
      </div>
    </div>
  </header>
  <p class="date-card-meta">{displayDate}</p>
  {#if dateEntry.place}
    <p class="date-card-meta"> Meet at {dateEntry.place}</p>  
  {/if}
  <p class="score-label">
    {dateEntry.compatibility == null
      ? 'Compatibility score pending'
      : `${dateEntry.compatibility}% compatible`}
  </p>
  {#if dateEntry.test_completed === true}
    <button class="button is-jodiac is-rounded" type="button" onclick={() => onOpenReport?.(dateEntry)}>
      Show compatibility report
    </button>
  {:else}
    <button class="button is-jodiac is-rounded" type="button" onclick={() => onTakeTest(dateEntry)}>
      Take compatibility test
    </button>
  {/if}
</article>