<script>
  let { onSave, onCancel, dateEntry = null } = $props()
  let name = $state('')
  let place = $state('')
  let date = $state('')

  const isEditing = $derived(dateEntry !== null)

  $effect(() => {
    if (!dateEntry) {
      name = ''
      place = ''
      date = ''
      return
    }

    name = dateEntry.name ?? ''
    place = dateEntry.place ?? ''
    date = dateEntry.date ?? ''
  })

  // Validates the required fields and sends a new date to the parent view.
  function handleSubmit(event) {
    event.preventDefault()
    onSave({
      name: name.trim(),
      place: place.trim(),
      date,
    })
  }
</script>

<section class="form-panel" aria-labelledby="add-date-title">
  <h2 class="title is-4" id="add-date-title">{isEditing ? 'Edit date' : 'Add a date'}</h2>
  <form onsubmit={handleSubmit}>
    <div class="field">
      <label class="label" for="date-name">Their name</label>
      <div class="control">
        <input class="input" id="date-name" name="name" type="text" bind:value={name} required maxlength="80" />
      </div>
    </div>
        <div class="field">
      <label class="label" for="date-place">Place of date</label>
      <div class="control">
        <input class="input" id="date-place" name="place" type="text" bind:value={place} maxlength="120" />
      </div>
    </div>
    <div class="field">
      <label class="label" for="date-day">Date</label>
      <div class="control">
        <input class="input" id="date-day" name="date" type="date" bind:value={date} required />
      </div>
    </div>
    <div class="form-actions">
      <button class="button is-grey" type="button" onclick={onCancel}>Cancel</button>
      <button class="button is-jodiac" type="submit">{isEditing ? 'Save changes' : 'Save date'}</button>
    </div>
  </form>
</section>