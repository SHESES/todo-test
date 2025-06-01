<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex flex-col items-center justify-center h-screen p-4">
      <h1 class="text-5xl font-bold text-gray-800 mb-20">Страница не найдена :(</h1>
      <button
          @click="mainPage"
          class="btn btn-lg"
      >
        На главную
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  data() {
    return {
      // Флаг для отслеживания перенаправления пользователя
      redirected: false
    };
  },
  mounted() {
    setTimeout(() => {
      if (!this.redirected) {
        this.mainPage();
      }
    }, 5000);
    // Вызов метода mainPage через 5 секунд, если пользователь не перешел на другую страницу
  },
  beforeRouteLeave(to, from, next) {
    // Устанавливаем флаг redirected в true перед переходом на другую страницу
    this.redirected = true;
    next();
  },
  methods: {
    mainPage() {
      this.$router.push('/');
    },
  },
};

</script>
