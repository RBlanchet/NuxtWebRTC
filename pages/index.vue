<template>
  <div class="flex justify-center flex-col items-center">
    <Video :stream="localStream" titre="Vidéo locale"/>
    <Video :stream="remote.stream" :titre="remote.titre" v-for="remote in remotesStream" :key="remote.socket"/>
  </div>
</template>

<script>
  import Video from '../components/Video';
  import io from 'socket.io-client';

  export default {
    data() {
      return {
        localStream: null,
        socket: io('localhost:3000'),
        remotesStream: [],
      }
    },
    components: {
      Video,
    },
    async mounted() {
      this.socket.on('UPDATE_USERS_LIST', ({users}) => {
        users.forEach(user => {
          this.remotesStream.push({
            stream: new MediaStream(),
            titre: user,
            socket: user,
          });
        });
      });

      this.socket.on('REMOVE_USER', ({user}) => {
        this.remotesStream = this.remotesStream.filter(remote => remote.socket !== user);
      });

      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

      this.socket.emit('LOCAL_VIDEO_CONNECTED', {
        stream: this.localStream,
      });
    },
  }
</script>
