<template>
  <v-app dark>
    <v-layout justify-center>
      <v-card min-width="700" class="pa-3" height="200">
        <h1 v-if="error.statusCode === 404" class="mb-4">
          {{ pageNotFound }}
        </h1>
        <h1 v-else class="mb-4">
          {{ otherError }}
        </h1>
        <NuxtLink to="/" >
          ホーム
        </NuxtLink>
      </v-card>
    </v-layout>

  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'ページが見つかりません(404 Not Found)',
      otherError: 'エラー'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
