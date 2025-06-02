<template>
  <div class="card shadow-md mb-4" :class="task.status">
    <div class="p-6">
      <!-- Заголовок и кнопка удаления -->
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2">
          <input
              type="checkbox"
              class="form-checkbox h-5 w-5 text-green-600 border-gray-300 focus:ring-0 mr-2"
              :checked="task.status === 'done'"
              @change="handleToggle"
          />

          <div v-if="editingTitle" class="flex-1">
            <input
                ref="titleInput"
                v-model="titleDraft"
                @blur="finishEditing"
                @keyup.enter="finishEditing"
                class="text-xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-gray-600 w-full"
            />
          </div>
          <h2
              v-else
              class="text-xl font-semibold text-gray-800 cursor-pointer"
              :class="{ 'line-through text-gray-400': task.status === 'done' }"
              @click="startEditing"
          >
            {{ task.title }}
          </h2>
        </div>


        <button
            @click="handleDelete"
            class="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <!-- Статус -->
      <div class="mb-4">
        <div
            v-if="!editingStatus"
            @click="startEditingStatus"
            class="status inline-flex px-3 py-1 text-l font-medium cursor-pointer"
            :class="task.status"
        >
          {{ getStatusText(task.status) }}
        </div>

        <div v-else class="flex flex-wrap gap-2">
          <button
              v-for="s in ['todo', 'in-progress', 'done']"
              :key="s"
              @click="finishEditingStatus(s)"
              class="status inline-flex px-3 py-1 text-l font-medium cursor-pointer"
              :class="{
                'bg-gray-200 border-gray-400 text-gray-700': statusDraft !== s,
                [statusDraft]: statusDraft === s
              }"
          >
            {{ getStatusText(s) }}
          </button>
        </div>
      </div>

      <!-- Теги -->
      <div
          v-if="!editingTags && task.tags && task.tags.length"
          class="flex flex-wrap gap-2 mb-4"
          @click="startEditingTags"
      >
        <div
            v-for="tag in task.tags"
            :key="tag"
            class="tag inline-flex items-center bg-gray-200 rounded px-2.5 py-0.5 text-m font-medium cursor-pointer select-none"
        >
          {{ tag }}
        </div>
      </div>

      <!-- Плюсик, если тегов нет -->
      <div
        v-else-if="!editingTags"
        class="mb-4"
      >
        <button
          @click="() => { startEditingTags(); addNewTag(); }"
          class="inline-flex items-center rounded-full justify-center w-6 h-6 text-green-600
          font-bold border border-green-600 cursor-pointer hover:bg-green-100"
          title="Добавить тег"
        >+</button>
      </div>

      <!-- Режим редактирования тегов -->
      <div v-if="editingTags" class="flex flex-wrap gap-2 mb-2 items-center">
        <template v-for="(tag, index) in tagsDraft" :key="index">
          <div
              class="tag relative inline-flex items-center rounded px-2.5 py-0.5 text-m font-medium select-none cursor-text"
              @click.stop="startTagEditing(index)"
          >

            <span
              v-if="editingTagIndex !== index"
              @click="startTagEditing(index)">
              {{ tag }}
            </span>
            <input
              v-else
              v-model="tagsDraft[index]"
              :ref="'tagInput_' + index"
              @blur="finishTagEditing(index)"
              @keyup.enter="finishTagEditing(index)"
              class="border-b border-blue-500 focus:outline-none min-w-[1.5rem]"
              autofocus
            />

            <button
                @click.stop="deleteTag(index)"
                class="ml-1 text-current opacity-50 hover:opacity-100 font-bold text-m"
                title="Удалить тег"
            >
              ×
            </button>
          </div>
        </template>

        <button
            @click="addNewTag"
            class="inline-flex items-center rounded-full justify-center w-6 h-6 text-green-600 font-bold
            border border-green-600 cursor-pointer hover:bg-green-100"
            title="Добавить тег"
        >+</button>
      </div>

      <button
          v-if="editingTags"
          @click="finishEditingTags"
          class="ml-2 mb-6 text-red-600 hover:text-red-800 cursor-pointer"
      >
        Готово
      </button>


      <!-- Кнопка раскрытия подзадач -->
      <div v-if="task.subtasks" class="mb-4">
        <button
            @click="showSubtasks = !showSubtasks"
            class="flex items-center text-sm text-gray-600 cursor-pointer"
        >
          Подзадачи
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 ml-1 transform transition-transform"
              :class="{ 'rotate-90': showSubtasks }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Подзадачи -->
      <div v-if="showSubtasks" class="grid grid-cols-1 gap-4">

        <!-- Добавление подзадачи -->
        <div
            class="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-800 font-medium mb-4 ml-2"
            @click="addSubtask"
        >
          <span>Добавить подзадачу</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>

        <TaskCard
            v-for="subtask in task.subtasks"
            :key="subtask.id"
            :task="subtask"
            :project-id="projectId"
            :parent-task-id="task.id"
            @toggle-task="emitToggleSubtask"
            @delete-task="emitDeleteSubtask"
            @toggle-subtask="$emit('toggle-subtask', $event)"
            @delete-subtask="$emit('delete-subtask', $event)"
            @update-title="$emit('update-title', $event)"
            @update-tags="$emit('update-tags', $event)"
            @update-status="$emit('update-status', $event)"
        />

      </div>

      <!-- Дата создания -->
      <p class="text-sm text-gray-500 mt-4">
        Создано: {{ formatDate(task.createdAt) }}
      </p>

      <!-- Дата изменения -->
<!--      <p class="text-sm text-gray-500 mt-4">-->
<!--        Изменено: {{ formatDate(task.updatedAt) }}-->
<!--      </p>-->
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'TaskCard',
  props: {
    task: Object,
    projectId: String,
    parentTaskId: String
  },
  data() {
    return {
      showSubtasks: false,
      editingTitle: false,
      titleDraft: this.task.title,

      editingTags: false, // Режим редактирования
      tagsDraft: [...(this.task.tags || [])], // Локальный черновик тегов
      editingTagIndex: null,

      editingStatus: false,
      statusDraft: this.task.status,
    };
  },
  watch: {
    // Синхронизируем contenteditable, если изменился tagsDraft или editingTagIndex
    editingTagIndex(newIndex, oldIndex) {
      if (oldIndex !== null) {
        // Очистить старый редактируемый span, если нужно
        this.$nextTick(() => {
          const oldRef = this.$refs['tagInput' + oldIndex];
          if (oldRef) {
            oldRef.innerText = this.tagsDraft[oldIndex];
          }
        });
      }
      if (newIndex !== null) {
        this.$nextTick(() => {
          const newRef = this.$refs['tagInput' + newIndex];
          if (newRef) {
            newRef.innerText = this.tagsDraft[newIndex];
          }
        });
      }
    }
  },
  methods: {
    /* Добавление подзадачи */
    addSubtask() {
      const newSubtask = {
        id: uuidv4(),
        title: 'Без имени',
        status: 'todo',
        tags: [],
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Формируем новый массив субтасков
      const newSubtasks = this.task.subtasks ? [newSubtask, ...this.task.subtasks] : [newSubtask];

      // Эмитим событие с обновлённым массивом субтасков
      this.$emit('update-subtask', {
        projectId: this.projectId,
        taskId: this.task.id,
        subtasks: newSubtasks
      });
    },

    /* Редактирование статуса */
    startEditingStatus() {
      this.editingStatus = true;
      this.statusDraft = this.task.status;
    },
    finishEditingStatus(newStatus) {
      this.editingStatus = false;
      if (newStatus !== this.task.status) {
        this.$emit('update-status', {
          projectId: this.projectId,
          taskId: this.parentTaskId || this.task.id,
          subtaskId: this.parentTaskId ? this.task.id : null,
          status: newStatus
        });
      }
    },

    /* Режим редактирования тегов */
    startTagEditing(index) {
      this.editingTagIndex = index;
      // НЕ нужно ничего перезаписывать тут
      this.$nextTick(() => {
        const input = this.$refs['tagInput_' + index];
        if (input && input.focus) input.focus();
      });
    },
    finishTagEditing(index) {
      const val = this.tagsDraft[index]?.trim();
      if (!val) {
        this.deleteTag(index);
      } else {
        this.tagsDraft.splice(index, 1, val);
      }
      this.editingTagIndex = null;
    },
    startEditingTags() {
      this.editingTags = true;
      this.tagsDraft = [...(this.task.tags || [])];
      this.editingTagIndex = null;
    },

    deleteTag(index) {
      this.tagsDraft.splice(index, 1);
      if (this.editingTagIndex === index) this.editingTagIndex = null;
    },

    addNewTag() {
      this.tagsDraft.push('');
      this.editingTagIndex = this.tagsDraft.length - 1;

      this.$nextTick(() => {
        const refName = 'tagInput_' + this.editingTagIndex;
        let el = this.$refs[refName];
        if (Array.isArray(el)) el = el[0];
        if (el && el.focus) el.focus();
      });
    },

    finishEditingTags() {
      this.editingTags = false;
      this.editingTagIndex = null;

      const cleanedTags = this.tagsDraft
        .map(tag => tag.trim())
        .filter(tag => tag.length);

      if (JSON.stringify(cleanedTags) !== JSON.stringify(this.task.tags)) {
        this.$emit('update-tags', {
          taskId: this.parentTaskId || this.task.id,
          subtaskId: this.parentTaskId ? this.task.id : null,
          projectId: this.projectId,
          tags: cleanedTags
        });
      }
    },

    /* Для inline-редактирования */
    startEditing() {
      this.editingTitle = true;
      this.titleDraft = this.task.title;
      this.$nextTick(() => {
        this.$refs.titleInput?.focus();
      });
    },
    finishEditing() {
      this.editingTitle = false;
      if (this.titleDraft.trim() && this.titleDraft !== this.task.title) {
        this.$emit('update-title', {
          projectId: this.projectId,
          taskId: this.parentTaskId || this.task.id,
          subtaskId: this.parentTaskId ? this.task.id : null,
          newTitle: this.titleDraft.trim()
        });
      }
    },

    handleDelete() {
      if (this.parentTaskId) {
        this.emitDeleteSubtask();
      } else {
        this.$emit('delete-task', this.task);
      }
    },
    handleToggle() {
      if (this.parentTaskId) {
        this.emitToggleSubtask();
      } else {
        this.$emit('toggle-task', this.task);
      }
    },
    emitToggleSubtask() {
      this.$emit('toggle-subtask', {
        projectId: this.projectId,
        taskId: this.parentTaskId,
        subtaskId: this.task.id
      });
    },
    emitDeleteSubtask() {
      this.$emit('delete-subtask', {
        projectId: this.projectId,
        taskId: this.parentTaskId,
        subtaskId: this.task.id
      });
    },
    getStatusText(status) {
      return {
        'todo': 'К выполнению',
        'in-progress': 'В процессе',
        'done': 'Завершено'
      }[status] || status;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU');
    }
  }
};
</script>
