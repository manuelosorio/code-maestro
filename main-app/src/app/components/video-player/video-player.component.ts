import { Component, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.sass',
})
export class VideoPlayerComponent {
  @Input({
    required: false,
  })
  posterImage?: string;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('scrubberProgress') scrubberProgress!: ElementRef;
  @ViewChild('bufferedProgress') bufferedProgress!: ElementRef;

  public showPlayButton = true;

  seekValue = 0;
  volumeValue = 100;
  cTimeText = '00:00';
  dTimeText = '00:00';
  isFullScreen = false;
  isMuted = signal(false);
  isPlaying = signal(false);

  constructor() {
    if (this.videoPlayer) {
      const videoElement = this.videoPlayer.nativeElement;
      this.volumeValue = videoElement.volume * 100;
      this.isMuted.set(videoElement.muted);
      this.setupTimeout();
    }
  }

  playPause() {
    const videoElement = this.videoPlayer.nativeElement;
    if (this.isPlaying()) {
      videoElement.pause();
      this.isPlaying.set(false);
    } else {
      videoElement
        .play()
        .then(() => {
          if (this.showPlayButton) {
            this.showPlayButton = false;
          }
          this.isPlaying.set(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  vidSeek() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.currentTime = videoElement.duration * (this.seekValue / 100);
  }

  playVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement
        .play()
        .then(() => {
          this.showPlayButton = false;
          this.isPlaying.set(true);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  vidMute() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.muted = !videoElement.muted;
    this.isMuted.set(videoElement.muted);
  }

  setVolume() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.volume = this.volumeValue / 100;
  }

  toggleFullScreen() {
    const videoElement = this.videoPlayer.nativeElement;
    if (!this.isFullScreen) {
      this.isFullScreen = !this.isFullScreen;
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      }
    } else {
      // this.isFullScreen = !this.isFullScreen;
      // if (videoElement.exitFullscreen) {
      //   videoElement.exitFullscreen();
      // }
    }
  }

  showControls() {}

  hideControls() {}

  private setupTimeout() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.ontimeupdate = () => {
      // console.log(
      //   'timeupdate',
      //   videoElement.currentTime,
      //   videoElement.duration,
      // );
      this.seekValue = (videoElement.currentTime / videoElement.duration) * 100;
      this.cTimeText = this.formatTime(videoElement.currentTime);
      this.dTimeText = this.formatTime(videoElement.duration);
    };
  }

  updateSeekValue() {
    const videoElement = this.videoPlayer.nativeElement;
    // console.log(
    //   'updateSeekValue',
    //   videoElement.currentTime,
    //   videoElement.duration,
    // );
    this.seekValue = (videoElement.currentTime / videoElement.duration) * 100;
    this.cTimeText = this.formatTime(videoElement.currentTime);
    this.dTimeText = this.formatTime(videoElement.duration);
  }

  private formatTime(currentTime: number) {
    return new Date(currentTime * 1000).toISOString().substr(11, 8);
  }

  updateScrubber() {
    const video = this.videoPlayer.nativeElement;
    const percent = (video.currentTime / video.duration) * 100;
    this.scrubberProgress.nativeElement.style.width = percent + '%';
  }

  scrubVideo(event: MouseEvent) {
    const scrubber = this.scrubberProgress.nativeElement.parentNode;
    const scrubWidth = scrubber.offsetWidth;
    const offsetX = event.offsetX;
    const duration = this.videoPlayer.nativeElement.duration;
    const newTime = (offsetX / scrubWidth) * duration;
    this.videoPlayer.nativeElement.currentTime = newTime;
  }
  updateBufferStatus() {
    const video = this.videoPlayer.nativeElement;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      const percentBuffered = (bufferedEnd / duration) * 100;
      console.log('percentBuffered', percentBuffered);
      this.bufferedProgress.nativeElement.style.width = percentBuffered + '%';
    }
  }
}
