<script>
  let {
    open = false,
    title = 'Are you sure?',
    message = '',
    confirmLabel = 'Yes',
    cancelLabel = 'No',
    onConfirm,
    onCancel,
    confirmClass = 'is-jodiac',
    cancelClass = 'is-light',
  } = $props()
</script>

{#if open}
  <div class="popup-overlay" aria-live="polite">
    <div
      class="popup-card"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="popup-dialog-title"
      tabindex="-1"
    >
      <h3 id="popup-dialog-title" class="popup-title">{title}</h3>
      {#if message}
        <p class="popup-message">{message}</p>
      {/if}

      <div class="popup-actions is-flex is-justify-content-flex-end">
        <button class={`button ${cancelClass}`} type="button" onclick={onCancel}>
          {cancelLabel}
        </button>
        <button class={`button ${confirmClass}`} type="button" onclick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
