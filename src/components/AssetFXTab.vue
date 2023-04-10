<template>
  <div class="w-full h-full hover:cursor-pointer" :class="fxColorId" @click="fxClick">
  </div>
</template>

<script>
import {inject, ref} from "vue";
import useEventsBus from "../events/eventBus";

export default {
  name: "AssetFXTab",
  props: {
    sfx_id: Number,
  },
  setup(props) {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const sfx_id = ref(props.sfx_id)
    const fxColorId = ref(store.fxColorGenerator.getFxColor(sfx_id.value))
    const fxClick = () => {
      emit('focusSFX', sfx_id.value)
      emit('focusSFX', sfx_id.value)
    }
    return {
      fxColorId,
      fxClick
    }
  }
}
</script>

<style scoped>

</style>