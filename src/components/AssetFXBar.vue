<template>
  <div class="w-full h-full hover:cursor-pointer" :class="fxColor" @click="fxClick">
  </div>
</template>

<script>
import {inject, ref} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "AssetFXBar",
  props: {
    sfx_id: Number,
  },
  setup(props) {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const sfx_id = ref(props.sfx_id)
    const fxColor = ref(store.fxColorGenerator.getFxColor(sfx_id.value))
    const fxClick = () => {
      emit('focusSFX', sfx_id.value)
    }
    return {
      fxColor,
      fxClick
    }
  }
}
</script>

<style scoped>

</style>