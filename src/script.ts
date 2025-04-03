class AudioPlayer {
    private audio: HTMLAudioElement;
    private playPauseBtn: JQuery<HTMLElement>;
    private muteBtn: JQuery<HTMLElement>;
    private volumeSlider: JQuery<HTMLElement>;
    private progressBar: JQuery<HTMLElement>;
    private progressContainer: JQuery<HTMLElement>;
    private currentTimeSpan: JQuery<HTMLElement>;
    private durationSpan: JQuery<HTMLElement>;
    private speedDropdown: JQuery<HTMLElement>;
    private speedHeader: JQuery<HTMLElement>;
    private speedCurrent: JQuery<HTMLElement>;
    private speedOptions: JQuery<HTMLElement>;

    constructor() {
        // Initialize DOM elements
        this.audio = $("#audio")[0] as HTMLAudioElement;
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
        this.audio.volume = this.volumeSlider.val() as number / 100;

        // Bind event handlers
        this.bindEvents();
    }

    private bindEvents(): void {
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

        // Progress bar
        this.progressContainer.on("click", (e: JQuery.ClickEvent) => this.handleProgressBarClick(e));

        // Speed dropdown
        this.speedHeader.on("click", (e: JQuery.ClickEvent) => {
            e.stopPropagation();
            this.speedDropdown.toggleClass("active");
        });

        this.speedOptions.on("click", (e: JQuery.ClickEvent) => {
            const target = $(e.currentTarget);
            const speed = target.data("speed") as number;
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
        $(this.audio).on("timeupdate", () => this.updateProgress());

        // Handle ending
        $(this.audio).on("ended", () => this.handleAudioEnd());
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    private updateProgress(): void {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.css("width", `${percent}%`);
        this.currentTimeSpan.text(this.formatTime(this.audio.currentTime));
    }

    private togglePlayPause(): void {
        if (this.audio.paused) {
            this.audio.play();
            this.playPauseBtn.find("i").removeClass("fa-play").addClass("fa-pause");
        } else {
            this.audio.pause();
            this.playPauseBtn.find("i").removeClass("fa-pause").addClass("fa-play");
        }
    }

    private toggleMute(): void {
        if (this.audio.muted) {
            this.audio.muted = false;
            this.muteBtn.find("i").removeClass("fa-volume-mute").addClass("fa-volume-up");
            this.volumeSlider.val(this.audio.volume * 100);
        } else {
            this.audio.muted = true;
            this.muteBtn.find("i").removeClass("fa-volume-up").addClass("fa-volume-mute");
            this.volumeSlider.val(0);
        }
    }

    private handleVolumeChange(): void {
        const volume = Number(this.volumeSlider.val()) / 100;
        this.audio.volume = volume;

        const icon = this.muteBtn.find("i");
        icon.removeClass("fa-volume-mute fa-volume-down fa-volume-up");

        if (volume === 0) {
            icon.addClass("fa-volume-mute");
        } else if (volume < 0.5) {
            icon.addClass("fa-volume-down");
        } else {
            icon.addClass("fa-volume-up");
        }
    }

    private handleProgressBarClick(e: JQuery.ClickEvent): void {
        const clickPosition = e.pageX - this.progressContainer.offset()!.left;
        const clickPercent = clickPosition / this.progressContainer.width()!;
        this.audio.currentTime = clickPercent * this.audio.duration;
    }

    private handleAudioEnd(): void {
        this.playPauseBtn.find("i").removeClass("fa-pause").addClass("fa-play");
        this.progressBar.css("width", "0%");
        this.currentTimeSpan.text("00:00");
    }
}

// Initialize the audio player when the document is ready
$(document).ready(() => {
    new AudioPlayer();
}); 