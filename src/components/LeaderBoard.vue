<template>
  <div class="w-2/3 border-2 border-white rounded-lg p-2">
    <h4 class="text-white m-4">Popular</h4>

    <div v-for="row in leaderBoardRows" class="flex w-full justify-between border-b-2 border-gray-700 p-2 my-2">
      <audio class="w-5/12 h-8 mr-4" controls
             :src="row.preview_audio_url"
             preload="auto">
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>

      <div class="w-3/6 flex justify-between text-white my-auto mr-6 overflow-hidden text-ellipsis">
        <span class="text-white uppercase">{{ row.composition_name }}</span>
        <span>---</span>
        <span class="text-gray-400">{{ row.author_name }}</span>
      </div>
      <div class="w-1/6 h-full m-auto bg-gray-300 rounded-lg overflow-hidden">
        <img :src="row.ratingImgSrc" class="w-3/4 h-full m-auto">
      </div>
      <div class="w-1/6 flex justify-center text-white center m-auto overflow-hidden text-ellipsis">
        <button @click="rateProject(row.composition_id)" class="h-full m-auto bg-gray-300 rounded-lg text-black p-2">
          RATE
        </button>
      </div>

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
    const toast = inject('toast');
    const isMobile = ref(store.isMobile ? true : false)
    const leaderBoardRows = ref([])

    const imageAssets = {
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
      rating0: store.state.staticUrl + 'icons/rating-0.png',
      rating1: store.state.staticUrl + 'icons/rating-1.png',
      rating2: store.state.staticUrl + 'icons/rating-2.png',
      rating3: store.state.staticUrl + 'icons/rating-3.png',
      rating4: store.state.staticUrl + 'icons/rating-4.png',
      rating5: store.state.staticUrl + 'icons/rating-5.png',
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
            item['ratingImgSrc'] = imageAssets['rating' + item.avg_rating]
            leaderBoardRows.value.push(item)
          })
        }
      }, 1000)
    });

    const openProjectDialog = (projectId) => {
      alert(projectId)
      toast.warning('Forking from leaderboard is not yet implemented')
    }

    const rateProject = (projectId) => {
      toast.warning('Rate project Is Not Yet Implemented')
    }

    return {
      imageAssets,
      isMobile,
      leaderBoardRows,
      rateProject
    }
  }
}
</script>

<style scoped>

</style>