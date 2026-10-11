<script>
  import DateCard from '../components/DateCard.svelte'

  let { profile, dates, onAddDateClick, onEditDate, onDeleteDate, onTakeTest, onOpenReport } = $props()
</script>

<main class="page-content">
  <section class="home-heading">
    <div>
      <p class="eyebrow">Your dates</p>
      <h1 class="page-title">Welcome, {profile?.firstName}.</h1>
    </div>
    <button class="button is-jodiac" type="button" onclick={onAddDateClick}>Add a date</button>
  </section>

  {#if dates.length > 0}
    <section class="date-grid" aria-label="Saved dates">
      {#each dates as dateEntry (dateEntry.id)}
        <DateCard {dateEntry} onEdit={onEditDate} onDelete={onDeleteDate} onTakeTest={onTakeTest} onOpenReport={onOpenReport} />
      {/each}
    </section>
  {:else}
    <section class="empty-state" aria-live="polite">
      <strong>Your list starts with a conversation.</strong>
      Add a date to keep their name and the day you met in one place.
    </section>
  {/if}
</main>