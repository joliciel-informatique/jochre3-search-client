<template>
  <div style="overflow: auto; max-height: 100vh">
    <header id="topbar" class="is-flex is-flex-direction-column-reverse">
      <PreferencesSetup />
      <HeaderPage />
      <nav class="is-flex is-flex-direction-column navbar" id="navbar" role="navigation">
        <div class="navbar-brand is-flex is-flex-direction-row is-justify-content-space-between">
          <UserOptions />
        </div>
      </nav>
    </header>
    <main class="hero is-widescreen">
      <div class="body is-max-desktop m-3 p-3">
        <h1>Usage statistics</h1>
        <div class="columns">
          <div class="column"><label class="label">Start date:</label></div>
          <div class="column"><label class="label">End date:</label></div>
          <div class="column is-half"></div>
        </div>
        <div class="columns">
          <div class="column"><DatePicker v-model="startDate" /></div>
          <div class="column"><DatePicker v-model="endDate" /></div>
          <div class="column is-half"></div>
        </div>
        <div class="columns">
          <div class="column is-full">
            <label class="label">Time unit:</label>
            <select
              class="control select has-text-centered"
              name="timeUnitSelect"
              v-model="timeUnit"
            >
              <option>Day</option>
              <option>Month</option>
              <option>Year</option>
            </select>
            &nbsp;
            <button
              class="button is-info"
              @click="runStats()"
              @keyup.enter="runStats()"
              tabindex="0"
            >
              Run
            </button>
          </div>
        </div>
        <div class="table-container">
          <table class="table is-bordered is-striped" v-show="usageStats">
            <thead>
              <tr>
                <th><div style="width: 100px">Date</div></th>
                <th><div style="width: 100px">Distinct users</div></th>
                <th><div style="width: 100px">Queries</div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bin of usageStats?.bins" :key="sha1(bin)">
                <td>
                  <div style="width: 100px">{{ bin.label }}</div>
                </td>
                <td class="has-text-right">
                  <div style="width: 100px">{{ bin.distinctUsers }}</div>
                </td>
                <td class="has-text-right">
                  <div style="width: 100px">{{ bin.queries }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderPage from '@/components/HeaderPage/HeaderPage.vue'
import UserOptions from '@/components/SearchPage/UserOptions/UserOptions.vue'
import PreferencesSetup from '@/_components/Modals/Preferences/PreferencesSetup.vue'
import { sha1 } from 'object-hash'
import { ref } from 'vue'
import router from '@/router'
import { useKeycloakStore } from '@/stores/KeycloakStore'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { fetchData } from '@/assets/fetchMethods'

const keycloakStore = useKeycloakStore()
const keycloak = keycloakStore.keycloak
const tokenParsed = keycloak?.tokenParsed
const roles = tokenParsed?.resource_access?.jochre?.roles ?? []

if (roles.indexOf('stats') < 0) {
  router.push('/unauthorized')
}

const startDate = ref<Date>(new Date(new Date().getFullYear(), 0, 1))
const endDate = ref<Date>(new Date())
const timeUnit = ref<string>('Day')

interface UsageStatsBin {
  label: string
  distinctUsers: number
  queries: number
}

interface UsageStats {
  bins: UsageStatsBin[]
}
const usageStats = ref<UsageStats>()

async function runStats() {
  usageStats.value = undefined
  const statsParams = new URLSearchParams()
  const sd = startDate.value
  const utcStartDate = new Date(Date.UTC(sd.getFullYear(), sd.getMonth(), sd.getDate()))
  const ed = endDate.value
  const utcEndDate = new Date(Date.UTC(ed.getFullYear(), ed.getMonth(), ed.getDate()))
  statsParams.append('start-date', utcStartDate.toISOString().split('T')[0])
  statsParams.append('end-date', utcEndDate.toISOString().split('T')[0])
  statsParams.append('time-unit', timeUnit.value)
  const response = await fetchData('stats/usage', 'get', statsParams)
  if (response && response.ok) {
    usageStats.value = await response.json()
  }
}
</script>
