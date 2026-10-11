<script>
  let { onStart } = $props()
</script>

<main class="landing-page">
  <section class="landing-copy">
    <p class="eyebrow">Start with a good conversation</p>
    <h1 class="landing-title">Make space for what matters.</h1>
    <p class="lead-copy">
      A thoughtful way to get to know someone, one meaningful conversation at a time.
    </p>
    <button class="button is-jodiac" type="button" onclick={onStart}>Get started</button>
  </section>
  <aside class="landing-aside" aria-label="A note about meaningful conversations">
    <div class="aside-mark" aria-hidden="true">“</div>
    <p class="aside-caption">The best first impression is being curious about each other.</p>
  </aside>
</main>