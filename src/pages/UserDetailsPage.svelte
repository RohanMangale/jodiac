<script>
  import manImage from '../assets/man.svg'
  import womanImage from '../assets/woman.svg'

  let { onSubmit } = $props();
  /** @type {HTMLFormElement} */
  let formElement;
  let firstName = $state('');
  let lastName = $state('');
  let gender = $state('');
  let step = $state('name');
  let genderError = $state('');

  // Advances after the required name fields pass native form validation.
  function handleNext() {
    if (formElement.reportValidity()) step = 'gender';
  }

  // Returns to the name step without discarding the entered values.
  function handleBack() {
    step = 'name';
    genderError = '';
  }

  // Passes the completed profile to the app coordinator.
  /** @param {SubmitEvent} event */
  function handleSubmit(event) {
    event.preventDefault();
    if (!gender) {
      genderError = 'Choose an option to continue.';
      return;
    }

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
    });
  }
</script>

<main class="page-content">
  <p class="eyebrow">A little about you</p>
  <h1 class="page-title">First, let's meet you.</h1>
  <p class="lead-copy">Your details stay on this device.</p>
  {#if step === 'gender'}
    <button class="button is-white page-back-button" type="button" aria-label="Back to name" title="Back to name" onclick={handleBack}>
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    </button>
  {/if}

  <form bind:this={formElement} onsubmit={handleSubmit}>
    {#if step === 'name'}
      <section class="form-panel" aria-label="Your name">
        <div class="columns">
          <div class="column is-half-tablet">
            <div class="field">
              <label class="label" for="profile-first-name">First name</label>
              <div class="control">
                <input
                  class="input"
                  id="profile-first-name"
                  name="firstName"
                  type="text"
                  bind:value={firstName}
                  required
                  maxlength="80"
                  autocomplete="given-name"
                />
              </div>
            </div>
          </div>
          <div class="column is-half-tablet">
            <div class="field">
              <label class="label" for="profile-last-name">Last name</label>
              <div class="control">
                <input
                  class="input"
                  id="profile-last-name"
                  name="lastName"
                  type="text"
                  bind:value={lastName}
                  required
                  maxlength="80"
                  autocomplete="family-name"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="is-flex is-justify-content-flex-end">
          <button class="button is-jodiac" type="button" onclick={handleNext}>Next</button>
        </div>
      </section>
    {:else}
      <section class="form-panel" aria-labelledby="profile-gender-label">
        <p class="label" id="profile-gender-label">Choose your gender</p>
        <div class="columns">
          <div class="column is-half-tablet">
            <button
              class="button is-light is-fullwidth is-flex is-flex-direction-column is-align-items-center selection-card"
              class:has-background-info-light={gender === 'man'}
              type="button"
              aria-pressed={gender === 'man'}
              onclick={() => {
                gender = 'man';
                genderError = '';
              }}
            >
              <img class="image is-128x128" src={manImage} alt="" />
              <span>Man</span>
              {#if gender === 'man'}<i class="fa-solid fa-circle-check selection-card-check" aria-hidden="true"></i>{/if}
            </button>
          </div>
          <div class="column is-half-tablet">
            <button
              class="button is-light is-fullwidth is-flex is-flex-direction-column is-align-items-center selection-card"
              class:has-background-danger-light={gender === 'women'}
              type="button"
              aria-pressed={gender === 'women'}
              onclick={() => {
                gender = 'women';
                genderError = '';
              }}
            >
              <img class="image is-128x128" src={womanImage} alt="" />
              <span>Women</span>
              {#if gender === 'women'}<i class="fa-solid fa-circle-check selection-card-check" aria-hidden="true"></i>{/if}
            </button>
          </div>
        </div>
        {#if genderError}
          <p class="help is-danger" role="alert">{genderError}</p>
        {/if}
        <div class="is-flex is-justify-content-space-between">
          <button class="button is-jodiac" type="submit">Continue</button>
        </div>
      </section>
    {/if}
  </form>
</main>
