<template>
  <div class="w-full h-full bg-green-200" @click="fxClick">
    FX
  </div>
</template>

<script>
import {ref} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "AssetFXBar",
  props: {
    sfx_id: Number,
  },
  setup(props) {
    const {bus, emit} = useEventsBus()
    const sfx_id = ref(props.sfx_id)
    const fxClick = () => {
      emit('focusSFX', sfx_id.value)
    }
    return {
      fxClick
    }
  }
}
</script>

<style scoped>

</style>