<template>
  <div class="container">
    <h1 class="text-center">NuxtWebRTC</h1>
    <div class="rounded overflow-hidden shadow-lg flex justify-center">
      <video autoplay ref="localVideo"></video>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    navigator.getUserMedia(
      { video: true, audio: true },
      stream => {
        const localVideo = this.$refs['localVideo'];
        if (localVideo) {
          localVideo.srcObject = stream;
        }
      },
      error => {
        console.warn(error.message);
      }
    );
  }
}
</script>
