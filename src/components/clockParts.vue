<template>
    <div class="clock">
        <div id="time">{{ time }}</div>
        <div id="date">{{ date }}</div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'

    const time = ref('')
    const date = ref('')

    function updateTime() {
      const now = new Date()

      // 时间
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      time.value = `${hours}:${minutes}:${seconds}`

      // 日期
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      date.value = `${year}-${month}-${day}`
    }

    onMounted(() => {
      updateTime()
      setInterval(updateTime, 1000)
    })
</script>

<style scoped>
    .clock {
        margin-top: 20px;
        margin-right: 5px;
        width: 300px;
        text-align: center;
        font-size: 24px;

        #time {
            margin-bottom: 10px;
        }

        #date {
            font-size: 18px;
        }
    }

</style>