<script>
  import AddDateForm from '../components/AddDateForm.svelte'
  import arrangedMarriageImage from '../assets/Arranged_Marraige.svg'
  import casualDateImage from '../assets/Casual_date.svg'
  import phoneDateImage from '../assets/Phone_date.svg'

  let { dates, dateEntry = null, onSave, onCancel } = $props()

  const isEditing = $derived(dateEntry !== null)
  let step = $state('type')
  let dateType = $state('')
  let typeError = $state('')

  const dateTypes = [
    { value: 'arranged_marriage', label: 'Arranged marriage', image: arrangedMarriageImage },
    { value: 'casual_date', label: 'Casual date', image: casualDateImage },
    { value: 'phone_call', label: 'Phone call', image: phoneDateImage },
  ]

  // Advances to the date form after a type has been selected.
  function handleContinue() {
    if (!dateType) {
      typeError = 'Choose a date type to continue.'
      return
    }

    step = 'details'
  }

  // Returns a new entry to type selection without losing the chosen type.
  function handleBack() {
    step = 'type'
  }

  // Adds the selected type to the date before saving it.
  /** @param {{ name: string, place: string, date: string }} dateDetails */
  function handleSave(dateDetails) {
    onSave({ ...dateDetails, date_type: isEditing ? dateEntry.date_type : dateType })
  }
</script>

<main class="page-content">
  <p class="eyebrow">{isEditing ? 'Update details' : 'A new chapter'}</p>
  <h1 class="page-title">
    {isEditing ? 'Edit date details.' : dates.length === 0 ? 'Add your first date.' : 'Add another date.'}
  </h1>
  <p class="lead-copy">
    {isEditing ? 'Update their name or the date you met.' : 'Keep the details of the day you met close at hand.'}
  </p>
  {#if !isEditing}
    <button
      class="button is-white page-back-button"
      type="button"
      aria-label={step === 'type' ? 'Back to dates' : 'Back to date type'}
      title={step === 'type' ? 'Back to dates' : 'Back to date type'}
      onclick={step === 'type' ? onCancel : handleBack}
    >
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    </button>
  {/if}

  {#if !isEditing && step === 'type'}
    <section class="form-panel date-type-panel" aria-labelledby="date-type-label">
      <p class="label" id="date-type-label">Choose the type of date</p>
      <div class="columns">
        {#each dateTypes as type (type.value)}
          <div class="column is-one-third-tablet">
            <button
              class="button is-light is-fullwidth is-flex is-flex-direction-column is-align-items-center selection-card"
              class:has-background-info-light={dateType === type.value}
              type="button"
              aria-pressed={dateType === type.value}
              onclick={() => {
                dateType = type.value
                typeError = ''
              }}
            >
              <img class="image is-128x128" src={type.image} alt="" />
              <span>{type.label}</span>
              {#if dateType === type.value}<i class="fa-solid fa-circle-check selection-card-check" aria-hidden="true"></i>{/if}
            </button>
          </div>
        {/each}
      </div>
      {#if typeError}
        <p class="help is-danger" role="alert">{typeError}</p>
      {/if}
      <div class="is-flex is-justify-content-flex-end">
        <button class="button is-jodiac" type="button" onclick={handleContinue}>Continue</button>
      </div>
    </section>
  {:else}
    <AddDateForm onSave={handleSave} {onCancel} {dateEntry} />
  {/if}

</main>