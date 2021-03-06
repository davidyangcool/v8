// Copyright 2020 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {defineCustomElement, V8CustomElement} from './helper.mjs';
import './timeline/timeline-track.mjs';

defineCustomElement('timeline-panel', (templateText) =>
 class TimelinePanel extends V8CustomElement {
  constructor() {
    super(templateText);
    this.timelineOverview.addEventListener(
        'mousemove', e => this.handleTimelineIndicatorMove(e));
    this.addEventListener(
      'overviewupdate', e => this.handleOverviewBackgroundUpdate(e));
    this.backgroundCanvas = document.createElement('canvas');
    this.isLocked = false;
  }

  get timelineOverview() {
    return this.$('#timelineOverview');
  }

  get timelineOverviewIndicator() {
    return this.$('#timelineOverviewIndicator');
  }

  get timelineCanvas() {
    //TODO Don't access the timeline canvas from outside timeline track
    if(!this.timelineTracks || !this.timelineTracks.length) return;
    return this.timelineTracks[0].timelineCanvas;
  }

  get timeline() {
    //TODO(zcankara) Don't access the timeline from outside timeline track
    if(!this.timelineTracks || !this.timelineTracks.length) return;
    return this.timelineTracks[0].timeline;
  }

  set nofChunks(count){
    for (const track of this.timelineTracks) {
      track.nofChunks = count;
    }
  }
  get timelineTracks(){
    return this.$("slot").assignedNodes().filter(
      track => track.nodeType === Node.ELEMENT_NODE);
  }

  handleTimelineIndicatorMove(event) {
    if (event.buttons == 0) return;
    let timelineTotalWidth = this.timelineCanvas.offsetWidth;
    let factor = this.timelineOverview.offsetWidth / timelineTotalWidth;
    for (const track of this.timelineTracks) {
      track.handleTimelineIndicatorMove(event.movementX / factor);
    }
  }

  updateOverviewWindow() {
    let indicator = this.timelineOverviewIndicator;
    let totalIndicatorWidth =
        this.timelineOverview.offsetWidth;
    let div = this.timeline;
    let timelineTotalWidth = this.timelineCanvas.offsetWidth;
    let factor = totalIndicatorWidth / timelineTotalWidth;
    let width = div.offsetWidth * factor;
    let left = div.scrollLeft * factor;
    indicator.style.width = width + 'px';
    indicator.style.left = left + 'px';
  }

  handleOverviewBackgroundUpdate(e){
    this.timelineOverview.style.backgroundImage =
    'url(' + e.detail + ')';
  }

});
