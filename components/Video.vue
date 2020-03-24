<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg mt-5">
    <video class="w-full" autoplay :ref="uid"></video>
    <div class="px-6 py-4 bg-white">
      <div class="font-bold text-xl mb-2">{{ titre }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Video',
    data() {
      return {
        uid: Math.floor(Math.random() * 100),
      }
    },
    props: {
      titre: {
        type: String,
        default: 'Video component',
      },
      stream: {
        default: () => {new MediaStream()},
      },
    },
    watch: {
      stream: function(val, oldVal) {
        if (val) {
          this.$refs[this.uid].srcObject = val;
        }
      },
    },
  }
</script>
