import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import {
  PlayCircle,
  Play,
  Maximize,
  Minimize,
  Pause,
  Clock,
  Volume2,
  X,
  Volume1,
  VolumeX,
  Volume,
} from 'angular-feather/icons';

const icons = {
  PlayCircle,
  Play,
  Pause,
  Maximize,
  Minimize,
  Clock,
  X,
  Volume2,
  Volume1,
  VolumeX,
  Volume,
};

@NgModule({
  declarations: [],
  imports: [CommonModule, FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}
