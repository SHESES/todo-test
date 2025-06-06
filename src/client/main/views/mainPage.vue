<template>
  <div class="min-h-screen bg-gray-50 p-8">

    <div class="flex items-center gap-4 mb-6 w-full">
      <!-- Поиск -->
      <div class="relative flex-grow">
        <svg class="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            type="text"
            :value="filters.search"
            @input="e => updateSearch(e.target.value)"
            placeholder="Поиск..."
            class="w-full pl-[36px] pb-1 border-b border-gray-300 focus:outline-none focus:border-gray-600 text-gray-700"
        />
      </div>

      <SettingsPanel />
    </div>

    <div class="space-y-4">
      <!-- Проекты -->
      <div v-for="project in filteredProjects" :key="project.id" class="project-container">
        <!-- Заголовок проекта -->
        <div class="flex items-center gap-2 mb-2">
          <!-- Иконка сворачивания -->
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-600 transition-transform duration-200 cursor-pointer"
              :class="{ 'rotate-90': openedProjects.includes(project.id) }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click="toggleProject(project.id)"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>

          <!-- Инпут или название -->
          <div class="flex-1 relative">
            <input
                v-if="editingProjectId === project.id"
                v-model="projectNameDraft"
                :ref="'projectInput_' + project.id"
                @blur="finishProjectEdit"
                @keyup.enter="finishProjectEdit"
                class="text-xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-gray-600 w-full"
            />
            <h2
                v-else
                class="text-xl font-bold text-gray-800 cursor-pointer"
                @click="startProjectEdit(project)"
            >
              {{ project.name }}
            </h2>
          </div>

          <!-- Кнопка удаления проекта -->
          <button
              @click="deleteProject(project.id)"
              class="text-red-500 hover:text-red-700 transition-colors cursor-pointer ml-4"
              title="Удалить проект"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>

        <!-- Линия под названием -->
        <div class="border-b border-gray-200 mb-4"></div>

        <!-- Задачи -->
        <div v-if="openedProjects.includes(project.id)">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskCard
                v-for="task in project.tasks"
                :key="task.id"
                :task="task"
                :project-id="project.id"
                @toggle-task="handleToggleTask(project.id, task.id)"
                @delete-task="deleteTask(project.id, task.id)"
                @toggle-subtask="handleToggleSubtask"
                @delete-subtask="handleDeleteSubtask"
                @update-title="handleUpdateTitle"
                @update-tags="handleUpdateTags"
                @update-status="handleUpdateStatus"
                @update-subtask="handleUpdateTask"
            />
          </div>

          <!-- Кнопка добавления задачи -->
          <div
              class="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-800 font-medium mb-6 ml-2"
              @click="addTask(project.id)"
          >
            <span>Добавить задачу</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>

        </div>
      </div>

      <!-- Кнопка "Добавить проект" -->
      <div
          class="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-800 font-medium mb-4 ml-2"
          @click="addProject"
      >
        <span>Добавить проект</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

    </div>

  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import TaskCard from "main/views/TaskCard.vue";
import SettingsPanel from "main/views/settings.vue";

export default {
  name: 'mainPage',
  components: {
    TaskCard,
    SettingsPanel
  },
  data() {
    return {
      editingProjectId: null,
      projectNameDraft: '',
    };
  },
  computed: {
    projects: {
      get() {
        return this.$store.getters.PROJECTS ? this.$store.getters.PROJECTS : [];
      },
      set(value) {
        this.$store.commit('SET_PROJECTS', value);
      }
    },
    filters: {
      get() {
        return this.$store.getters.FILTERS ? this.$store.getters.FILTERS : {};
      },
      set(value) {
        this.$store.commit('SET_FILTERS', value);
      }
    },
    openedProjects: {
      get() {
        return this.$store.getters.OPENED_PROJECTS ? this.$store.getters.OPENED_PROJECTS : [];
      },
      set(value) {
        this.$store.commit('SET_OPENED_PROJECTS', value);
      }
    },
    filteredProjects() {
      return this.projects.map(project => {
        return {
          ...project,
          tasks: this.filterAndSortTasks(project.tasks)
        };
      });
    }
  },
  methods: {
    /* Добавление проекта */
    addProject() {
      const newProject = {
        id: uuidv4(),
        name: 'Без названия',
        tasks: []
      };
      const projectsCopy = [...this.projects];
      projectsCopy.unshift(newProject);
      this.projects = projectsCopy;

      this.editingProjectId = newProject.id;
      this.projectNameDraft = '';
      this.$nextTick(() => {
        let ref = this.$refs['projectInput_' + newProject.id];
        if (Array.isArray(ref)) ref = ref[0];
        ref?.focus?.();
      });
    },

    /* Для inline-редактирования проекта */
    startProjectEdit(project) {
      this.editingProjectId = project.id;
      this.projectNameDraft = project.name;
      this.$nextTick(() => {
        let ref = this.$refs['projectInput_' + project.id];
        if (Array.isArray(ref)) ref = ref[0];
        ref?.focus?.();
      });
    },

    finishProjectEdit() {
      const project = this.projects.find(p => p.id === this.editingProjectId);
      if (project && this.projectNameDraft.trim() && this.projectNameDraft !== project.name) {
        project.name = this.projectNameDraft.trim();
      }
      this.editingProjectId = null;
      this.projectNameDraft = '';
    },

    /* Удаление проекта */
    deleteProject(projectId) {
      this.projects = this.projects.filter(p => p.id !== projectId);
      if (this.editingProjectId === projectId) {
        this.editingProjectId = null;
        this.projectNameDraft = '';
      }
    },

    /* Для inline-редактирования задач */
    handleUpdateTags({ taskId, subtaskId, projectId, tags }) {
      // Найди задачу в project.tasks
      const project = this.projects.find(p => p.id === projectId);
      if (!project) return;

      if (subtaskId) {
        // Ищем подзадачу
        const task = project.tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) return;
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (!subtask) return;
        subtask.tags = tags;
        subtask.updatedAt = new Date().toISOString();
      } else {
        // Обычная задача
        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return;
        task.tags = tags;
        task.updatedAt = new Date().toISOString();
      }

      this.projects = [...this.projects];
    },
    handleUpdateStatus({ projectId, taskId, subtaskId, status }) {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) return;

      if (subtaskId) {
        const task = project.tasks.find(t => t.id === taskId);
        if (!task || !task.subtasks) return;
        const subtask = task.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
          subtask.status = status;
          subtask.updatedAt = new Date().toISOString();
        }
      } else {
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = status;
          task.updatedAt = new Date().toISOString();
        }
      }

      // Триггерим реактивность
      this.projects = [...this.projects];
    },
    handleUpdateTitle({ projectId, taskId, subtaskId, newTitle }) {
      if (subtaskId) {
        const task = this.findTaskById(projectId, taskId);
        const subtask = task?.subtasks?.find(s => s.id === subtaskId);
        if (subtask) {
          subtask.title = newTitle;
          subtask.updatedAt = new Date().toISOString();
        }
      } else {
        const task = this.findTaskById(projectId, taskId);
        if (task) {
          task.title = newTitle;
          task.updatedAt = new Date().toISOString();
        }
      }

      this.projects = [...this.projects];
    },
    findTaskById(projectId, taskId) {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) return null;

      function search(tasks) {
        for (const task of tasks) {
          if (task.id === taskId) return task;
          if (task.subtasks) {
            const found = search(task.subtasks);
            if (found) return found;
          }
        }
        return null;
      }

      return search(project.tasks);
    },

    /* Сворачивание проекта */
    toggleProject(projectId) {
      const opened = [...this.openedProjects];
      const index = opened.indexOf(projectId);
      if (index === -1) {
        opened.push(projectId);
      } else {
        opened.splice(index, 1);
      }
      this.openedProjects = opened; // вызовет сеттер => коммит
    },

    /* Смена статуса задачи чекбоксом */
    handleToggleTask(projectId, taskId) {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) return;

      const task = project.tasks.find(t => t.id === taskId);
      if (!task) return;

      task.status = task.status === 'done' ? 'todo' : 'done';
      task.updatedAt = new Date().toISOString();
    },
    handleToggleSubtask({ projectId, taskId, subtaskId }) {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) return;

      const task = project.tasks.find(t => t.id === taskId);
      if (!task) return;

      const subtask = task.subtasks.find(st => st.id === subtaskId);
      if (!subtask) return;

      subtask.status = subtask.status === 'done' ? 'todo' : 'done';
      subtask.updatedAt = new Date().toISOString();

      this.projects = [...this.projects];
    },

    /* Удаление задачи */
    deleteTask(projectId, taskId) {
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        project.tasks = project.tasks.filter(t => t.id !== taskId);
        this.projects = [...this.projects];
      }
    },
    handleDeleteSubtask({ projectId, taskId, subtaskId }) {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) return;
      const task = project.tasks.find(t => t.id === taskId);
      if (!task) return;
      task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
      task.updatedAt = new Date().toISOString();

      this.projects = [...this.projects]; // чтобы триггернуть реактивность
    },
    handleUpdateTask({ projectId, taskId, subtasks }) {
      const projectIndex = this.projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) return;

      const project = this.projects[projectIndex];
      const taskIndex = project.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return;

      // Клонируем задачу с обновлёнными субтасками и updatedAt
      const updatedTask = {
        ...project.tasks[taskIndex],
        subtasks: subtasks,            // обновляем подзадачи
        updatedAt: new Date().toISOString()
      };

      // Обновляем задачи проекта, создавая новый массив
      const updatedTasks = [
        ...project.tasks.slice(0, taskIndex),
        updatedTask,
        ...project.tasks.slice(taskIndex + 1)
      ];

      // Обновляем проект (создаем новый объект с обновленными задачами)
      this.projects.splice(projectIndex, 1, {
        ...project,
        tasks: updatedTasks
      });
    },

    addTask(projectId) {
      const project = this.projects.find(p => p.id === projectId);
      if (!project) return;

      const newTask = {
        id: uuidv4(),
        title: 'Новая задача',
        status: 'todo',
        tags: [],
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      project.tasks.unshift(newTask);
      this.projects = [...this.projects]; // чтобы триггернуть реактивность, если надо
    },

    filterAndSortTasks(tasks) {
      if (!tasks) return [];

      // Фильтрация по статусу
      let filtered = tasks.filter(task => this.filters.statuses.includes(task.status));

      // Фильтрация по тегам — если есть фильтр, но задачи без тегов всегда оставляем
      if (this.filters.tags.length) {
        filtered = filtered.filter(task =>
          (task.tags && task.tags.length > 0 && task.tags.some(tag => this.filters.tags.includes(tag))) ||
          !task.tags || task.tags.length === 0
        );
      }

      // Фильтрация по названию — если есть поиск, но задачи с названием "Без названия" всегда оставляем
      if (this.filters.search.trim()) {
        const searchLower = this.filters.search.toLowerCase();
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(searchLower) || task.title === "Без названия"
        );
      }

      // Показывать только не завершённые, если show_completed выключен
      if (!this.filters.show_completed) {
        filtered = filtered.filter(task => task.status !== 'done');
      }

      // Рекурсивно фильтруем и сортируем подзадачи
      filtered = filtered.map(task => ({
        ...task,
        subtasks: this.filterAndSortTasks(task.subtasks)
      }));

      // Сортировка
      const key = this.filters.sort_by || 'updatedAt';
      filtered.sort((a, b) => new Date(b[key]) - new Date(a[key]));

      return filtered;
    },
    updateSearch(value) {
      this.filters = {
        ...this.filters,
        search: value
      };
    }
  }
};
</script>

<style>
</style>
