"use strict";
class AudioPlayer {
    constructor() {
        this.isDragging = false;
        // Initialize DOM elements
        this.audio = $("#audio")[0];
        this.playPauseBtn = $("#play-pause");
        this.muteBtn = $("#mute");
        this.volumeSlider = $("#volume");
        this.progressBar = $(".progress__fill");
        this.progressContainer = $(".progress");
        this.currentTimeSpan = $(".time__current");
        this.durationSpan = $(".time__total");
        this.speedDropdown = $(".speed__dropdown");
        this.speedHeader = $(".speed__header");
        this.speedCurrent = $(".speed__current");
        this.speedOptions = $(".speed__option");
        // Initialize audio settings
        this.audio.volume = this.volumeSlider.val() / 100;
        // Bind event handlers
        this.bindEvents();
    }
    bindEvents() {
        // Metadata loaded
        $(this.audio).on("loadedmetadata", () => {
            this.durationSpan.text(this.formatTime(this.audio.duration));
        });
        // Play/Pause
        this.playPauseBtn.on("click", () => this.togglePlayPause());
        // Mute/Unmute
        this.muteBtn.on("click", () => this.toggleMute());
        // Volume control
        this.volumeSlider.on("input", () => this.handleVolumeChange());
        // Progress bar events
        this.progressContainer.on("mousedown", (e) => {
            this.isDragging = true;
            this.handleProgressBarInteraction(e);
            const handleMouseMove = (e) => {
                if (this.isDragging) {
                    this.handleProgressBarInteraction(e);
                }
            };
            $(document).on("mousemove", handleMouseMove);
            $(document).one("mouseup", () => {
                this.isDragging = false;
                $(document).off("mousemove", handleMouseMove);
            });
        });
        // Speed dropdown
        this.speedHeader.on("click", (e) => {
            e.stopPropagation();
            this.speedDropdown.toggleClass("active");
        });
        this.speedOptions.on("click", (e) => {
            const target = $(e.currentTarget);
            const speed = target.data("speed");
            const speedText = target.text();
            this.audio.playbackRate = speed;
            this.speedCurrent.text(speedText);
            this.speedDropdown.removeClass("active");
        });
        // Close dropdown when clicking outside
        $(document).on("click", () => {
            this.speedDropdown.removeClass("active");
        });
        // Update progress
        $(this.audio).on("timeupdate", () => {
            if (!this.isDragging) {
                this.updateProgress();
            }
        });
        // Handle ending
        $(this.audio).on("ended", () => this.handleAudioEnd());
    }
    handleProgressBarInteraction(e) {
        const rect = this.progressContainer[0].getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const clickPercent = Math.max(0, Math.min(1, clickPosition / rect.width));
        // Update progress bar visually
        this.progressBar.css("width", `${clickPercent * 100}%`);
        // Update time display and audio time
        const newTime = clickPercent * this.audio.duration;
        this.currentTimeSpan.text(this.formatTime(newTime));
        // Always update audio time for immediate feedback
        this.audio.currentTime = newTime;
    }
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.css("width", `${percent}%`);
        this.currentTimeSpan.text(this.formatTime(this.audio.currentTime));
    }
    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
            this.playPauseBtn.find("i").removeClass("fa-play").addClass("fa-pause");
        }
        else {
            this.audio.pause();
            this.playPauseBtn.find("i").removeClass("fa-pause").addClass("fa-play");
        }
    }
    toggleMute() {
        if (this.audio.muted) {
            this.audio.muted = false;
            this.muteBtn.find("i").removeClass("fa-volume-mute").addClass("fa-volume-up");
            this.volumeSlider.val(this.audio.volume * 100);
        }
        else {
            this.audio.muted = true;
            this.muteBtn.find("i").removeClass("fa-volume-up").addClass("fa-volume-mute");
            this.volumeSlider.val(0);
        }
    }
    handleVolumeChange() {
        const volume = Number(this.volumeSlider.val()) / 100;
        this.audio.volume = volume;
        const icon = this.muteBtn.find("i");
        icon.removeClass("fa-volume-mute fa-volume-down fa-volume-up");
        if (volume === 0) {
            icon.addClass("fa-volume-mute");
        }
        else if (volume < 0.5) {
            icon.addClass("fa-volume-down");
        }
        else {
            icon.addClass("fa-volume-up");
        }
    }
    handleAudioEnd() {
        this.playPauseBtn.find("i").removeClass("fa-pause").addClass("fa-play");
        this.progressBar.css("width", "0%");
        this.currentTimeSpan.text("00:00");
    }
}
// Initialize the audio player when the document is ready
$(document).ready(() => {
    new AudioPlayer();
});
