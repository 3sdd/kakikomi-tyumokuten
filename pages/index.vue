<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
    <KTCanvas class="mt-4"></KTCanvas>
    </v-flex>
  </v-layout>
</template>

<script>
import KTCanvas from "../components/KTCanvas"

export default {
  components: {
    KTCanvas,
  }
}
</script>
