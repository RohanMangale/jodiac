<script>
  import AppHeader from './components/AppHeader.svelte'
  import AddDatePage from './pages/AddDatePage.svelte'
  import HomePage from './pages/HomePage.svelte'
  import LandingPage from './pages/LandingPage.svelte'
  import QuestionnairePage from './pages/QuestionnairePage.svelte'
  import ReportPage from './pages/ReportPage.svelte'
  import UserDetailsPage from './pages/UserDetailsPage.svelte'
  import {
    appState,
    addDate,
    updateDate,
    deleteDate,
    saveProfile,
    setDateTestCompleted,
  } from './lib/state.svelte.js'

  let currentPage = $state(appState.profile ? 'home' : 'landing')
  let selectedDate = $state(null)

  // Opens the profile step from the landing page.
  function handleStart() {
    currentPage = 'profile'
  }

  // Stores the profile before moving into the date list.
  function handleProfileSubmit(profile) {
    saveProfile(profile)
    currentPage = 'home'
  }

  // Opens the add-date step from the homepage.
  function handleStartAddDate() {
    currentPage = 'add-date'
  }

  // Adds a date to the shared persisted application state.
  function handleAddDate(dateEntry) {
    addDate(dateEntry)
    currentPage = 'home'
  }

  // Returns home without saving a new date.
  function handleCancelAddDate() {
    currentPage = 'home'
  }

  // Opens the shared date form with the selected entry loaded for editing.
  function handleStartEditDate(dateEntry) {
    selectedDate = dateEntry
    currentPage = 'edit-date'
  }

  // Updates the selected entry before returning to the date list.
  function handleEditDate(dateEntry) {
    updateDate(selectedDate.id, dateEntry)
    selectedDate = null
    currentPage = 'home'
  }

  // Cancels editing without changing the saved entry.
  function handleCancelEditDate() {
    selectedDate = null
    currentPage = 'home'
  }

  // Deletes the selected entry from the saved date list.
  function handleDeleteDate(id) {
    deleteDate(id)
  }

  // Opens the questionnaire for a selected date entry.
  function handleTakeTest(dateEntry) {
    selectedDate = dateEntry
    currentPage = 'questionnaire'
  }

  // Opens the compatibility report for the selected date entry.
  function handleOpenReport(dateEntry) {
    selectedDate = dateEntry
    currentPage = 'report'
  }

  // Returns to the home screen from the report page.
  function handleBackFromReport() {
    selectedDate = null
    currentPage = 'home'
  }

  // Marks the selected date as completed before returning to the home screen.
  function handleQuestionnaireComplete() {
    if (selectedDate?.id) {
      setDateTestCompleted(selectedDate.id, true)
    }

    selectedDate = null
    currentPage = 'home'
  }

  // Marks the selected date as not completed before returning to the home screen.
  function handleQuestionnaireAbort() {
    if (selectedDate?.id) {
      setDateTestCompleted(selectedDate.id, false)
    }

    selectedDate = null
    currentPage = 'home'
  }
</script>

<svelte:head>
  <title>Jodiac | Better conversations, closer connections</title>
  <meta name="description" content="Make room for the conversations that matter." />
</svelte:head>

<div class="app-shell">
  <AppHeader />

  {#if currentPage === 'landing'}
    <LandingPage onStart={handleStart} />
  {:else if currentPage === 'profile'}
    <UserDetailsPage onSubmit={handleProfileSubmit} />
  {:else if currentPage === 'add-date'}
    <AddDatePage
      dates={appState.dates}
      onSave={handleAddDate}
      onCancel={handleCancelAddDate}
    />
  {:else if currentPage === 'edit-date'}
    <AddDatePage
      dates={appState.dates}
      dateEntry={selectedDate}
      onSave={handleEditDate}
      onCancel={handleCancelEditDate}
    />
  {:else if currentPage === 'questionnaire'}
    <QuestionnairePage
      dateEntry={selectedDate}
      profile={appState.profile}
      onBack={handleQuestionnaireAbort}
      onComplete={handleQuestionnaireComplete}
    />
  {:else if currentPage === 'report'}
    <ReportPage dateEntry={selectedDate} onBack={handleBackFromReport} />
  {:else}
    <HomePage
      profile={appState.profile}
      dates={appState.dates}
      onAddDateClick={handleStartAddDate}
      onEditDate={handleStartEditDate}
      onDeleteDate={handleDeleteDate}
      onTakeTest={handleTakeTest}
      onOpenReport={handleOpenReport}
    />
  {/if}
</div>
