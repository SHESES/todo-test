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
            :class="filters.show_completed ? 'bg-red-600' : 'bg-gray-200'"
            @click="toggleShowCompleted"
          >
            <span
              class="inline-block h-2 w-2 transform rounded-full bg-white transition-transform"
              :class="filters.show_completed ? 'translate-x-4' : 'translate-x-1'"
            />
          </button>
        </div>

        <!-- Сортировка -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Сортировка</label>
          <select
              :value="filters.sort_by"
              @change="e => updateSortBy(e.target.value)"
              class="w-full border-gray-300 rounded-md cursor-pointer">
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
          <div class="flex flex-wrap gap-2 mb-2 min-h-[32px]">
            <template v-if="filters.tags.length">
              <span
                v-for="tag in filters.tags"
                :key="tag"
                class="px-2 py-1 rounded-full bg-gray-200 text-sm text-gray-800 border border-gray-300"
              >
                {{ tag }}
              </span>
            </template>
            <span v-else class="text-gray-500 text-sm">Все отображаются</span>
          </div>

          <div class="flex flex-col gap-2 max-h-40 overflow-y-auto">
            <label
              v-for="tag in allTags"
              :key="tag"
              class="flex items-center cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                :value="tag"
                :checked="filters.tags.includes(tag)"
                @change="e => {
                  const newTags = e.target.checked
                    ? [...filters.tags, tag]
                    : filters.tags.filter(t => t !== tag);
                  updateTags(newTags);
                }"
                class="mr-2 rounded"
              />
              {{ tag }}
            </label>
          </div>

          <button
            v-if="filters.tags.length"
            @click.stop="filters.tags = []"
            class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Сбросить теги
          </button>
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
                'bg-gray-200 border-gray-400 text-gray-700': !filters.statuses.includes(s),
                [s]: filters.statuses.includes(s)
              }"
            >
              {{ getStatusText(s) }}
            </button>
          </div>
        </div>

        <!-- Сброс всех фильтров -->
        <div class="mt-6">
          <button
            @click="resetFilters"
            class="w-full text-sm text-red-600 hover:text-red-700 border border-red-300 hover:border-red-700 px-4 py-2 rounded-md"
          >
            Сбросить все фильтры
          </button>
        </div>


        <div class="flex flex-col gap-4 mt-4 max-w-md">
          <div
            class="flex items-center cursor-pointer select-none"
            @click="showImportForm = !showImportForm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1 text-red-600 transition-transform duration-200"
              :class="{ 'rotate-90': showImportForm }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span :class="showImportForm ? 'font-semibold' : ''">Импорт</span>
          </div>

          <transition name="accordion">
            <div
              v-if="showImportForm"
              class="p-4 border rounded border-gray-300 bg-gray-50"
            >
              <input
                type="file"
                @change="onFileChange"
                accept=".txt"
                class="block w-full mb-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
              />
              <input
                type="password"
                v-model="importKey"
                placeholder="Пароль для импорта"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                @click="importData"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded mt-2 transition"
              >
                Импортировать
              </button>
            </div>
          </transition>

          <div
            class="flex items-center cursor-pointer select-none"
            @click="showExportForm = !showExportForm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1 text-red-600 transition-transform duration-200"
              :class="{ 'rotate-90': showExportForm }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span :class="showExportForm ? 'font-semibold' : ''">Экспорт</span>
          </div>

          <transition name="accordion">
            <div
              v-if="showExportForm"
              class="p-4 border rounded border-gray-300 bg-gray-50"
            >
              <input
                type="password"
                v-model="exportKey"
                placeholder="Пароль для экспорта"
                class="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                @click="exportData"
                class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Экспортировать
              </button>
            </div>
          </transition>
        </div>


      </div>
    </transition>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'SettingsPanel',
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  data() {
    return {
      panelOpen: false,
      statuses: ['todo', 'in-progress', 'done'],

      showExportForm: false,
      showImportForm: false,

      exportKey: '',
      importKey: '',
      importFile: null,
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
    },
    projects() {
      return this.$store.getters.PROJECTS ? this.$store.getters.PROJECTS : [];
    },
    allTags() {
      const tagsSet = new Set()

      for (const project of this.projects) {
        const tasks = project.tasks || []
        for (const task of tasks) {
          ;(task.tags || []).forEach(tag => tagsSet.add(tag))
          const subtasks = task.subtasks || []
          for (const subtask of subtasks) {
            ;(subtask.tags || []).forEach(tag => tagsSet.add(tag))
          }
        }
      }
      return Array.from(tagsSet)
    }
  },
  methods: {
    // Экспорт данных с шифрованием
    exportData() {
      if (!this.exportKey) {
        alert('Введите пароль для экспорта');
        return;
      }

      const dataToExport = JSON.stringify({
        filters: this.filters,
        projects: this.projects,
      });

      // Шифруем
      const encrypted = CryptoJS.AES.encrypt(dataToExport, this.exportKey).toString();

      // Создаем ссылку для скачивания
      const blob = new Blob([encrypted], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${new Date().toISOString()}.txt`;
      a.click();

      URL.revokeObjectURL(url);
    },

    // Обработчик выбора файла для импорта
    onFileChange(event) {
      this.importFile = event.target.files[0];
    },

    // Импорт данных с расшифровкой
    async importData() {
      if (!this.importKey) {
        alert('Введите пароль для импорта');
        return;
      }
      if (!this.importFile) {
        alert('Выберите файл для импорта');
        return;
      }

      const text = await this.importFile.text();

      try {
        const bytes = CryptoJS.AES.decrypt(text, this.importKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) throw new Error('Неверный пароль или поврежденный файл');

        const importedData = JSON.parse(decryptedText);

        // Записываем в стор
        this.$store.commit('SET_FILTERS', importedData.filters);
        this.$store.commit('SET_PROJECTS', importedData.projects);

        alert('Импорт выполнен успешно');
        this.panelOpen = false;
      } catch (e) {
        alert('Ошибка при импорте: ' + e.message);
      }
    },


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
      // Создаем новый массив статусов
      const newStatuses = this.filters.statuses.includes(status)
          ? this.filters.statuses.filter(s => s !== status)
          : [...this.filters.statuses, status];

      // Обновляем фильтры через сеттер
      this.filters = {
        ...this.filters,
        statuses: newStatuses
      };
    },

    updateTags(newTags) {
      this.filters = {
        ...this.filters,
        tags: newTags
      };
    },

    // Для переключателя show_completed
    toggleShowCompleted() {
      this.filters = {
        ...this.filters,
        show_completed: !this.filters.show_completed
      };
    },

    updateSortBy(value) {
      this.filters = {
        ...this.filters,
        sort_by: value
      };
    },

    resetFilters() {
      console.log('reset filters');
      this.$store.dispatch('RESET_FILTERS');
    }
  }
}
</script>

<style>
</style>
