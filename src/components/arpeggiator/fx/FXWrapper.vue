<template>
  <div class="flex w-full h-1/3 bg-gray-100">
    <f-x-item></f-x-item>
    <f-x-item></f-x-item>
    <f-x-item></f-x-item>
  </div>
</template>

<script>
import FXItem from "./FXItem";
export default {
  name: "FXWrapper",
  components: {FXItem}

}
</script>

<style scoped>

</style>