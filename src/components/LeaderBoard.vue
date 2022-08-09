<template>
  <div v-if="isMobile" class="w-full border-2 border-white rounded-lg mb-4 p-2">
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

  <div v-else class="w-2/3 border-2 border-white rounded-lg p-2">
    <h4 class="text-white m-4">Popular</h4>

    <div v-for="row in leaderBoardRows" class="flex w-full justify-between border-b-2 border-gray-700 p-2 my-2">
      <audio class="w-5/12 h-8 mr-4" controls
             :src="row.preview_audio_url"
             preload="auto">
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>

      <div class="w-4/6 flex justify-between text-white my-auto mr-4 overflow-hidden text-ellipsis">
        <span class="text-white uppercase overflow-hidden">{{ row.composition_name }}</span>
        <span class="overflow-hidden">---</span>
        <span class="text-gray-400 overflow-hidden">{{ row.author_name }}</span>
      </div>
      <div class="w-1/6 h-full m-auto bg-gray-300 rounded-lg mr-4 overflow-hidden">
        <img :src="row.ratingImgSrc" @click="openRateProject(row.composition_id)" class="w-3/4 h-full m-auto">
      </div>

      <button @click="openProjectDialog(project.id)"
              class="w-1/12 border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        <img
            :src="imageAssets.loadBtn" class="h-6 m-auto"/>
      </button>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showRateProject" class="modal w-1/3 bg-white border-2 border-black rounded-lg p-4 shadow-lg">
    <div class="bg-gray-100 rounded-lg p-2 mb-2">
      <h4 class="w-full border-b-2 border-gray-600">RATE</h4>
      <div class="flex flex-col justify-between">
        <button class="bg-gray-100 hover:bg-gray-200"><img :src="imageAssets.rating0" @click="rateProject(0)"></button>
        <button class="bg-gray-100 hover:bg-gray-200"><img :src="imageAssets.rating1" @click="rateProject(1)"></button>
        <button class="bg-gray-100 hover:bg-gray-200"><img :src="imageAssets.rating2" @click="rateProject(2)"></button>
        <button class="bg-gray-100 hover:bg-gray-200"><img :src="imageAssets.rating3" @click="rateProject(3)"></button>
        <button class="bg-gray-100 hover:bg-gray-200"><img :src="imageAssets.rating4" @click="rateProject(4)"></button>
        <button class="bg-gray-100 hover:bg-gray-200"><img :src="imageAssets.rating5" @click="rateProject(5)"></button>
      </div>
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
import {inject, nextTick, onMounted, ref, watch} from "vue";
import LeaderBoardAAPI from "../dal/LeaderBoardAPI";
import ComposerAPI from "../dal/ComposerAPI";
import useEventsBus from "../events/eventBus";

export default {
  name: "LeaderBoard",
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const toast = inject('toast')
    const isMobile = ref(store.isMobile ? true : false)
    const leaderBoardRows = ref([])
    let showRateProject = ref(false)
    let projectToRate = undefined

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
          emit('refreshLeaderBoard')
        }
      }, 1000)
    });

    const openProjectDialog = (projectId) => {
      toast.warning('Forking from leaderboard is not yet implemented')
    }

    const openRateProject = (projectId) => {
      projectToRate = projectId
      console.log('projectId', projectId)
      showRateProject.value = true
    }

    const rateProject = async (rating) => {
      const res = await new ComposerAPI().rateComposition(store.token, projectToRate, rating)

      if (!res) {
        toast.error('Error rating project')
      } else {
        //success ... refresh leaderboard
        emit('refreshLeaderBoard')
      }

      showRateProject.value = false
    }

    watch(() => bus.value.get('refreshLeaderBoard'), async () => {
      const leaderBoardItems = await new LeaderBoardAAPI().getLeaderBoard(store.token)
      leaderBoardRows.value = []
      leaderBoardItems.forEach((item) => {
        item['ratingImgSrc'] = imageAssets['rating' + item.avg_rating]
        leaderBoardRows.value.push(item)
      })
    })

    return {
      imageAssets,
      isMobile,
      leaderBoardRows,
      rateProject,
      openRateProject,
      showRateProject
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  margin-left: -150px;
}
</style>