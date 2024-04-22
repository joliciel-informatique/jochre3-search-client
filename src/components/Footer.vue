<template>
  <footer class="footer has-text-white custom-background has-text-weight-semibold mt-auto">
    <div class="columns">
      <div class="column">
        {{ $t('footer.powered-by') }}
        <a href="https://github.com/urieli/jochre/" target="_blank">
          <img
            src="/images/jochreLogo.png"
            style="width: 150px; border: none"
            :alt="$t('Jochre')"
          />
        </a>
      </div>
      <div class="column" v-html="$t('footer.credits')"></div>
      <div class="column">
        <div v-html="$t('footer.credits-column-2')"></div>
        <div v-html="$t('footer.privacy')"></div>
      </div>
    </div>
  </footer>
</template>
