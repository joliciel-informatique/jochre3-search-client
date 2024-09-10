<template>
  <div class="footer-partners columns m-1">
    <div class="column is-align-content-center">
      {{ $t('footer.powered-by') }}
      <a href="https://github.com/urieli/jochre/" target="_blank">
        <img src="/images/jochreLogo.png" style="width: 150px; border: none" :alt="$t('Jochre')" />
      </a>
    </div>
    <div class="column" v-html="$t('footer.credits')"></div>
    <div class="column">
      <!-- <a class="button is-link">{{ $t('footer.credits-column-2') }}</a> -->
      <div v-html="$t('footer.privacy')"></div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
