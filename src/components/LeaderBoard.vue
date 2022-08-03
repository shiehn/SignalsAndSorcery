<template>
  <div class="w-2/3 border-2 border-white rounded-lg p-2">
    <h4 class="text-white m-4">Popular</h4>

    <div v-for="row in leaderBoardRows" class="flex w-full justify-between p-2 my-2">
      <!--      {{row.composition_id}}-->

      <audio class="w-5/12 h-8 mr-4" controls
             :src="row.preview_audio_url"
             preload="auto">
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>

      <div class="w-4/6 text-white m-auto overflow-hidden text-ellipsis">{{ row.composition_name }}</div>
      <div class="w-2/6 text-gray-400 m-auto overflow-hidden text-ellipsis">- {{ row.author_name }}</div>
      <div class="w-1/6 text-white  m-auto overflow-hidden text-ellipsis">rating: {{ row.avg_rating }}</div>
      <div class="w-1/6 text-white  m-auto overflow-hidden text-ellipsis">votes: {{ row.avg_rating }}</div>

      <button @click="openProjectDialog(project.id)"
              class="w-1/12 border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        <img
            :src="imageAssets.loadBtn" class="h-6 m-auto"/>
      </button>

    </div>
  </div>
</template>


<!--leaderboard_item_1 = {-->
<!--"composition_id": 2,-->
<!--"avg_rating": 3,-->
<!--"num_ratings": 6,-->
<!--"author_id": 1,-->
<!--"author_name": "John Doe",-->
<!--"preview_audio_url": "https://sas-storage-v1-f44a888852ea9f0b25b453b6ee91e131.s3.us-west-2.amazonaws.com/00f725fd-c2ac-4a46-8781-fb04ddac9f95.mp3",-->
<!--}-->

<script>
import {inject, nextTick, onMounted, ref} from "vue";
import LeaderBoardAAPI from "../dal/LeaderBoardAPI";

export default {
  name: "LeaderBoard",
  setup() {
    const store = inject('store')
    const isMobile = ref(store.isMobile ? true : false)
    const leaderBoardRows = ref([])
    const imageAssets = {
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
    }

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })

      setTimeout(async () => {
        isMobile.value = store.isMobile ? true : false

        if (store.token) {
          const leaderBoardItems = await new LeaderBoardAAPI().getLeaderBoard(store.token)

          leaderBoardItems.forEach((item) => {
            leaderBoardRows.value.push(item)
          })

          console.log('LEADER BOARD', leaderBoardItems)
        }
      }, 1000)
    });

    return {
      imageAssets,
      isMobile,
      leaderBoardRows
    }
  }
}
</script>

<style scoped>

</style>