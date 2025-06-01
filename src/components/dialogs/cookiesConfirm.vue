<template>
  <div
      v-if="showCookiesNotification == true"
      class="bg-red-100 fixed z-[1000] bottom-3 left-0 right-0 mx-3 rounded-sm"
  >
    <div class="mx-auto p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p class="m-0 mr-10 text-left w-full sm:w-auto">
          Этот сайт использует файлы cookie для хранения данных.
          Продолжая использовать сайт, вы даёте согласие на работу с этими файлами.
        </p>
        <button
            @click="confirmCookies"
            class="text-lg text-red-700 cursor-pointer"
        >
          Принять
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookiesConfirm',
  data() {
    return {
    };
  },
  computed: {
    showCookiesNotification: {
      get() {
        return this.$store.getters.SHOW_COOKIES_NOTIFICATION;
      },
      set(value) {
        this.$store.commit('SET_SHOW_COOKIES_NOTIFICATION', value);
      }
    }
  },
  methods: {
    confirmCookies() {
      this.showCookiesNotification = false;
    }
  }
};
</script>

<style>
</style>
