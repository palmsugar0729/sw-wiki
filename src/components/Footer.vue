<template>
    <footer class="footer">
        <div class="copyRight">
            © 2026 Felayna&PalmSugar
            <br>
            本网站图文均出自官方资料或自己制作编写，仅作为学习交流用<br>
            不得擅自将网页内容用于商业或AI学习用途，违者后果自负，本网站不承担任何责任<br>
            本网站只提供web页面服务，并不提供影片资源存储，也不参与录制、上传<br>
            若本站收录的内容无意侵犯了贵司版权，请联系我们，我们会及时处理和回复，谢谢
        </div>
        <div class="links">
            <span @click="showContact = true" id="conUs">联系我们</span>
            <li></li>
            <span @click="showDonate = true">请求赞助</span>
            <li></li>
            <a href="https://pan.baidu.com/s/1qjjEgb8rYBOtyIajOQ0v7w?pwd=n4pn" target="_blank">小说资源</a>
            <li></li>
            <a href="https://www.bilibili.com/video/BV1Wu411e7k9/?vd_source=8f84b37a43510b27580f36113dd5b63c" target="_blank">介绍视频</a>
            <li></li>
            <span @click="showText" id="resouseLink">视频资源</span>
        </div>
        <div class="clock">
            <Clock />
        </div>
    </footer>

    <div v-if="showContact" class="modal">
      <div class="modal-content">
        <h3>联系方式</h3>
        <p>
          邮箱：palmsugar0729@foxmail.com<br>
          QQ:2686035749<br>
          工作微信：Palm_Sugar29<br>
          Bilibili ID:felayna<br>
          合作联络、事务联络请联系上方邮箱、QQ或微信。
        </p>
        <button @click="showContact = false">关闭</button>
      </div>
    </div>

    <div v-if="showDonate" class="modal">
      <div class="modal-content">
        <h3>打赏支持</h3>
        <p>如果这个网站对你有帮助，可以考虑支持一下 🙏<br>
            本页面为本站唯一打赏入口，请通过本站进行支持，谨防冒用。</p>

        <img src="/donate/wechat.jpg" class="qrcode" />
        <img src="/donate/alipay.jpg" class="qrcode" />

        <button @click="showDonate = false">关闭</button>
      </div>
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    import Clock from '../components/clockParts.vue'

    // 联系方式弹窗
    const showContact = ref(false)
    
    const showText = () => {
        alert('本站不提供任何在线视频或网盘视频资源，敬请谅解。')
    }

    // 捐款页面弹窗
    const showDonate = ref(false)
</script>

<style scoped>
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-around; 
      flex-wrap: wrap;                
      margin: 30px 0;
      gap: 20px;
    }

    /* 左侧版权 */
    .copyRight {
      flex: 0 0 auto;
      text-align: left;
      padding-left: 6px;
      min-width: 200px;
      font: 12px Microsoft YaHei, Heiti SC, tahoma, arial, sans-serif;
    }

    /* 中间链接 */
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .links li {
      border-left: 1px solid #696969;
      padding-left: 10px;
    }

    /* 去掉第一个竖线 */
    .links li:first-child {
      border-left: none;
    }

    /* 链接样式 */
    .links a, span {
      text-decoration: none;
      color: #fff;
      font-size: 18px;
    }

    .links span:hover, a:hover {
      text-decoration: underline;
      color: red;
    }

    /* 右侧时间 */
    .clock {
      min-width: 120px;
      text-align: right;
    }
    /* 背景遮罩 */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      display: flex;
      justify-content: center;
      align-items: center;
    }   
    /* 内容框 */
    .modal-content {
      background: white;
      color: black;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }   
    /* 二维码 */
    .qrcode {
      width: 150px;
      margin: 10px;
    }
</style>
