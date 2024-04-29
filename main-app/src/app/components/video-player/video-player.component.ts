import { Component, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../modules/icons/icons.module';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, FormsModule, IconsModule],
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
  @ViewChild('hoverProgress') hoverScrubber!: ElementRef;
  @ViewChild('videContainer') videoContainer!: ElementRef;

  public showPlayButton = true;

  seekValue = 0;
  volumeValue = 100;
  cTimeText = '00:00';
  dTimeText = '00:00';
  isFullScreen = signal(false);
  isMuted = signal(false);
  isPlaying = signal(false);

  constructor() {
    if (this.videoPlayer) {
      const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
      this.volumeValue = videoElement.volume * 100;
      this.isMuted.set(videoElement.muted);
      this.setupTimeout();
    }
  }

  playPause() {
    const videoElement = this.videoPlayer.nativeElement;
    if (this.isPlaying()) {
      videoElement.pause();
    } else {
      videoElement
        .play()
        .then(() => {
          if (this.showPlayButton) {
            this.showPlayButton = false;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  playVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement
        .play()
        .then(() => {
          this.showPlayButton = false;
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
    const videoContainer = this.videoContainer.nativeElement;
    if (this.isFullScreen()) {
      document
        .exitFullscreen()
        .then()
        .catch((error) => {
          console.error(error);
        });
    } else {
      videoContainer
        .requestFullscreen()
        .then()
        .catch((error: unknown) => {
          console.error(error);
        });
    }
  }

  showControls() {}

  hideControls() {}

  private setupTimeout() {
    const videoElement = this.videoPlayer.nativeElement;
    videoElement.ontimeupdate = () => {
      this.seekValue = (videoElement.currentTime / videoElement.duration) * 100;
      this.cTimeText = this.formatTime(videoElement.currentTime);
      this.dTimeText = this.formatTime(videoElement.duration);
    };
  }

  updateSeekValue() {
    const videoElement = this.videoPlayer.nativeElement;
    this.seekValue = (videoElement.currentTime / videoElement.duration) * 100;
    this.cTimeText = this.formatTime(videoElement.currentTime);
    this.dTimeText = this.formatTime(videoElement.duration);
  }

  private formatTime(currentTime: number) {
    return new Date(currentTime * 1000).toISOString().substr(11, 8);
  }

  updateScrubber() {
    const video = this.videoPlayer.nativeElement;
    this.scrubberProgress.nativeElement.style.transform = `scaleX(${video.currentTime / video.duration})`;
  }

  scrubVideo(event: MouseEvent) {
    const scrubber = event.currentTarget as HTMLElement;
    const scrubberRect = scrubber.getBoundingClientRect();
    const scrubberStart = scrubberRect.left + window.scrollX;
    const offsetX = event.pageX - scrubberStart;
    const scrubberWidth = scrubber.offsetWidth;
    const videoDuration = this.videoPlayer.nativeElement.duration;
    const newTime = (offsetX / scrubberWidth) * videoDuration;
    this.videoPlayer.nativeElement.currentTime = Math.max(
      0,
      Math.min(newTime, videoDuration),
    );
  }
  updateBufferStatus() {
    const video = this.videoPlayer.nativeElement;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      const percentBuffered = (bufferedEnd / duration) * 100;
      this.bufferedProgress.nativeElement.style.width = percentBuffered + '%';
    }
  }

  setPlaying(_event: Event) {
    this.isPlaying.set(!this.videoPlayer.nativeElement.paused);
  }

  setFullScreen(_event: Event) {
    if (this.isFullScreen()) {
      this.isFullScreen.set(false);
    } else {
      this.isFullScreen.set(true);
    }
  }
}
