<template>
  <div class="relative">
    <!-- Кнопка настроек -->
    <div class="flex justify-end mb-5">
      <button
        class="text-gray-500 hover:text-gray-700"
        @click="panelOpen = !panelOpen"
        title="Настройки"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>

    <!-- Затемнение фона с размытием -->
    <transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
    >
      <div
        v-if="panelOpen"
        @click="panelOpen = false"
        class="fixed inset-0 backdrop-blur-sm bg-transparent z-40"
      />
    </transition>

    <!-- Панель настроек -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform opacity-0 translate-y-1"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 translate-y-1"
    >
      <div
        v-if="panelOpen"
        class="fixed right-4 top-16 bg-white border border-gray-200 shadow-lg rounded-xl w-72 p-4 z-50 max-h-[80vh] overflow-y-auto"
      >

        <div class="mb-5 flex justify-between items-center font-bold">
          <span>Настройки</span>
          <button
            @click="panelOpen = false"
            aria-label="Закрыть"
            class="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Переключатель показа выполненных задач -->
        <div class="mb-4 flex justify-between items-center">
          <span class="font-medium">Показывать выполненные</span>
          <button
            type="button"
            class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer"
            :class="showDone ? 'bg-red-600' : 'bg-gray-200'"
            @click="showDone = !showDone"
          >
            <span
              class="inline-block h-2 w-2 transform rounded-full bg-white transition-transform"
              :class="showDone ? 'translate-x-4' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Сортировка -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Сортировка</label>
          <select v-model="sortBy" class="w-full border-gray-300 rounded-md cursor-pointer">
            <option value="title">По названию</option>
            <option value="createdAt">По дате создания</option>
            <option value="updatedAt">По дате изменения</option>
            <option value="status">По статусу</option>
          </select>
        </div>

        <!-- Фильтрация -->
        <div class="mb-2 font-semibold">Фильтры</div>

        <!-- Теги -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Теги</label>
          <select v-model="selectedTags" multiple class="w-full border-gray-300 rounded-md">
            <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
        </div>

        <!-- Статусы -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Статусы</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in statuses"
              :key="s"
              @click="toggleStatusFilter(s)"
              class="status inline-flex px-3 py-1 text-l font-medium cursor-pointer border rounded-full"
              :class="{
                'bg-gray-200 border-gray-400 text-gray-700': !statusFilters.includes(s),
                [s]: statusFilters.includes(s)
              }"
            >
              {{ getStatusText(s) }}
            </button>
          </div>
        </div>

        <!-- Импорт / экспорт -->
        <div class="flex justify-start gap-4 mt-4">
          <button class="flex items-center text-red-600 hover:text-red-800 font-medium cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Импорт
          </button>
          <button class="flex items-center text-red-600 hover:text-red-800 font-medium cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Экспорт
          </button>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SettingsPanel',
  props: {
    allTags: Array
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  data() {
    return {
      panelOpen: false,
      showDone: true,
      sortBy: 'updatedAt',
      selectedTags: [],
      statuses: ['todo', 'in-progress', 'done'],
      statusFilters: ['todo', 'in-progress', 'done']
    }
  },
  computed: {
    filters: {
      get() {
        return this.$store.getters.FILTERS ? this.$store.getters.FILTERS : {};
      },
      set(value) {
        this.$store.commit('SET_FILTERS', value);
      }
    }
  },
  methods: {
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.panelOpen = false;
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'todo':
          return 'Ожидает';
        case 'in-progress':
          return 'В процессе';
        case 'done':
          return 'Сделано';
        default:
          return status;
      }
    },
    toggleStatusFilter(status) {
      if (this.statusFilters.includes(status)) {
        this.statusFilters = this.statusFilters.filter(s => s !== status);
      } else {
        this.statusFilters.push(status);
      }
    }
  }
}
</script>

<style>
</style>
