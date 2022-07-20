<template>
  <div class="flex m-auto center align-middle w-full h-1/3 bg-gray-100">
    <f-x-item></f-x-item>
    <f-x-item></f-x-item>
    <f-x-item></f-x-item>
    <img :src="addFXIcon" class="w-8 h-8 mt-3 ml-4 rounded-full hover:ring-4 hover:ring-green-500" @click="handleAddFX">
  </div>
</template>

<script>
import FXItem from "./FXItem.vue";
import {inject, ref} from "vue";
import store from "../../../store/store";
export default {
  name: "FXWrapper",
  components: {FXItem},
  setup() {
    const addFXIcon = ref(store.state.staticUrl + "icons/plus.png")
    const toast = inject('toast');

    const handleAddFX = () => {
      toast.warning("Add FX is not yet implemented")
    }

    return {addFXIcon, handleAddFX};
  }

}
</script>

<style scoped>

</style>