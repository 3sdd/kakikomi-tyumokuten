<template>
  <v-app dark>

    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >

      <v-toolbar-title v-text="title" />

    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
 

    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}:msdd</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      title: '書き込み注目点'
    }
  }
}
</script>
