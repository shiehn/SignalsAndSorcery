<template>
  <div v-if="isMobile" class="w-full border-2 border-white rounded-lg mb-4 p-2">
    <div class="flex justify-between">
      <h4 class="text-white m-4">Popular</h4>
      <div class="flex text-white mr-4">
        <button v-if="hasPrevPage" @click="pageResults('prev')" class="mr-2"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pagePrev"/></button>
        <button v-else class="mr-2 opacity-50"><img class="h-6 w-6" :src="imageAssets.pagePrev"/></button>
        <button v-if="hasNextPage" @click="pageResults('next')" class="mr-4"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pageNext"/></button>
        <button v-else class="mr-4"><img class="h-6 w-6 opacity-50" :src="imageAssets.pageNext"/></button>
      </div>
    </div>

    <div v-for="row in leaderBoardRows" class="flex w-full justify-between border-b-2 border-gray-700 p-2 my-2">
      <audio class="w-5/12 h-8 mr-4" controls
             :src="row.preview_audio_url"
             preload="auto">
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>

      <div class="w-4/6 flex justify-between text-white my-auto mr-4 overflow-hidden text-ellipsis">
        <span class="text-white uppercase overflow-hidden">{{ row.composition_name }}</span>
        <span>
          <span class="overflow-hidden mr-4">---</span>
          <a :href="row.profileLink" class="text-gray-400 overflow-hidden">{{ row.author_name }}</a>
        </span>
      </div>
      <div class="w-1/6 h-full m-auto bg-gray-300 rounded-lg mr-4 overflow-hidden">
        <img :src="row.ratingImgSrc" @click="openRateProject(row.composition_id)" class="w-3/4 h-full m-auto">
      </div>

      <button @click="copyHyperLink(row.preview_audio_url)"
              class="w-1/12 border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        <img
            :src="imageAssets.linkBtn" class="h-6 m-auto"/>
      </button>
    </div>
  </div>

  <div v-if="!isMobile" class="w-2/3 border-2 border-white rounded-lg p-2">
    <div class="flex justify-between">
      <h4 class="text-white m-4">Popular</h4>
      <div class="flex text-white mr-4">
        <button v-if="hasPrevPage" @click="pageResults('prev')" class="mr-2"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pagePrev"/></button>
        <button v-else class="mr-2 opacity-50"><img class="h-6 w-6" :src="imageAssets.pagePrev"/></button>
        <button v-if="hasNextPage" @click="pageResults('next')" class="mr-4"><img class="h-6 w-6"
                                                                                  :src="imageAssets.pageNext"/></button>
        <button v-else class="mr-4"><img class="h-6 w-6 opacity-50" :src="imageAssets.pageNext"/></button>
      </div>
    </div>

    <div v-for="row in leaderBoardRows" class="flex w-full justify-between border-b-2 border-gray-700 p-2 my-2">
      <audio class="w-5/12 h-8 mr-4" controls
             :src="row.preview_audio_url"
             preload="auto">
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>

      <div class="w-4/6 flex justify-between text-white my-auto mr-4 overflow-hidden text-ellipsis">
        <span class="text-white uppercase overflow-hidden">{{ row.composition_name }}</span>
        <a :href="row.profileLink" class="text-gray-400 overflow-hidden">{{ row.author_name }}</a>
      </div>
      <div class="w-1/6 h-full m-auto bg-gray-300 rounded-lg mr-4 overflow-hidden">
        <img :src="row.ratingImgSrc" @click="openRateProject(row.composition_id)" class="w-3/4 h-full m-auto">
      </div>

      <button @click="copyHyperLink(row.preview_audio_url)"
              class="w-1/12 border-2 bg-gray-300 p-1 rounded-md hover:bg-white hover:shadow-lg hover:border-green-500">
        <img
            :src="imageAssets.linkBtn" class="h-6 m-auto"/>
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

  <loading-spinner :showLoadingProp="showLoadingSpinner"></loading-spinner>
</template>

<script>
import {inject, nextTick, onMounted, ref, watch} from "vue";
import LeaderBoardAAPI from "../dal/LeaderBoardAPI";
import ComposerAPI from "../dal/ComposerAPI";
import useEventsBus from "../events/eventBus";
import LoadingSpinner from "./LoadingSpinner";

export default {
  name: "LeaderBoard",
  components: {LoadingSpinner},
  setup() {
    const store = inject('store')
    const {bus, emit} = useEventsBus()
    const toast = inject('toast')
    const isMobile = ref(store.isMobile ? true : false)
    const leaderBoardRows = ref([])
    let showRateProject = ref(false)
    const showLoadingSpinner = ref(false)
    let projectToRate = undefined
    let currentPage = 0
    const hasNextPage = ref(false)
    const hasPrevPage = ref(false)

    const imageAssets = {
      linkBtn: store.state.staticUrl + 'icons/link.png',
      loadBtn: store.state.staticUrl + 'icons/open-icon.png',
      downloadBtn: store.state.staticUrl + 'icons/download-icon.svg',
      rating0: store.state.staticUrl + 'icons/rating-0.png',
      rating1: store.state.staticUrl + 'icons/rating-1.png',
      rating2: store.state.staticUrl + 'icons/rating-2.png',
      rating3: store.state.staticUrl + 'icons/rating-3.png',
      rating4: store.state.staticUrl + 'icons/rating-4.png',
      rating5: store.state.staticUrl + 'icons/rating-5.png',
      pagePrev: store.state.staticUrl + 'icons/shuffle-left-white.png',
      pageNext: store.state.staticUrl + 'icons/shuffle-right-white.png',
    }

    onMounted(() => {
      nextTick(() => {
        isMobile.value = store.isMobile ? true : false
      })

      setTimeout(async () => {
        isMobile.value = store.isMobile ? true : false

        if (store.token) {
          emit('refreshLeaderBoard', currentPage)
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

    const pageResults = (direction) => {
      if (direction === 'next') {
        currentPage = currentPage + 1
        emit('refreshLeaderBoard', currentPage)
      } else if (direction === 'prev') {
        currentPage = currentPage - 1
        emit('refreshLeaderBoard', currentPage)
      } else {
        console.log('ERROR: unexpected paging direction')
      }
    }

    const rateProject = async (rating) => {
      showLoadingSpinner.value = true
      const res = await new ComposerAPI().rateComposition(store.token, projectToRate, rating)
      showLoadingSpinner.value = false

      if (!res) {
        toast.error('Error rating project')
      } else {
        emit('refreshLeaderBoard', currentPage)
      }

      showRateProject.value = false
    }

    const copyHyperLink = async (url) => {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard')
      } catch (e) {
        alert(url);
      }
    }

    watch(() => bus.value.get('refreshLeaderBoard'), async (page) => {
      if (!page[0]) {
        page[0] = 0
      }

      showLoadingSpinner.value = true
      const leaderBoardResponse = await new LeaderBoardAAPI().getLeaderBoard(store.token, page[0])
      showLoadingSpinner.value = false

      leaderBoardRows.value = []

      leaderBoardResponse['leaderboard'].forEach((item) => {
        item['ratingImgSrc'] = imageAssets['rating' + item.avg_rating]
        item['profileLink'] = `/sas/profile?username=${item.author_name}`
        leaderBoardRows.value.push(item)
      })

      currentPage = leaderBoardResponse['pagination']['page']
      hasNextPage.value = leaderBoardResponse['pagination']['has_next']
      hasPrevPage.value = leaderBoardResponse['pagination']['has_prev']
    })

    return {
      copyHyperLink,
      hasPrevPage,
      hasNextPage,
      imageAssets,
      isMobile,
      leaderBoardRows,
      openRateProject,
      pageResults,
      rateProject,
      showLoadingSpinner,
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