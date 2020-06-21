<template>
  <v-app dark>

    <v-app-bar
      app
      hide-on-scroll
      color="teal"
    >
      <nuxt-link to="/" class="site-name">
        <v-toolbar-title v-text="title" class="white--text"/>
      </nuxt-link>

    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
 
    <div height="100">
      <v-footer
        app
        absolute="false"
        class="font-weight-medium"
      >
        <v-container>

          <v-row class="d-flex justify-center">
              <nuxt-link to="/" class="pa-2 msdd-link">
                ホーム
              </nuxt-link>
              <nuxt-link to="privacy-policy" class="pa-2 msdd-link">
                プライバシー・ポリシー
              </nuxt-link>
          </v-row>

          <v-row>
            <v-col class="text-center" cols="12">
              <span>&copy; {{ new Date().getFullYear() }} — <strong><a href="https://twitter.com/__msdd__" class="msdd-link">msdd</a></strong></span>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </div>

  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      miniVariant: false,
      title: '書き込み注目点',
    }
  }
}
</script>
<style scoped>
.msdd-link{
  text-decoration: none;
}
a.msdd-link:link{
  color:black;
}
a.msdd-link:visited{
  color:black;
}
a.msdd-link:hover{
  color:grey;
}
a.msdd-link:active{
  color:black
}

.site-name{
  text-decoration: none;
}
</style>