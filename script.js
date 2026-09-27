const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// 1. Full playlist with DJ Pebbles set as the artist
const songs = [
    { name: 'Arctic Arcade', title: 'Arctic Arcade', artist: 'DJ Pebbles' },
    { name: 'Dhol Shock', title: 'Dhol Shock', artist: 'DJ Pebbles' },
    { name: 'Dhol Surge', title: 'Dhol Surge', artist: 'DJ Pebbles' },
    { name: 'Dj PEbbles German', title: 'DJ Pebbles (German)', artist: 'DJ Pebbles' },
    { name: 'Dj Pebbles Arabic', title: 'DJ Pebbles (Arabic)', artist: 'DJ Pebbles' },
    { name: 'Dj Pebbles Chinese', title: 'DJ Pebbles (Chinese)', artist: 'DJ Pebbles' },
    { name: 'Dj Pebbles French', title: 'DJ Pebbles (French)', artist: 'DJ Pebbles' },
    { name: 'Dj Pebbles Hindi', title: 'DJ Pebbles (Hindi)', artist: 'DJ Pebbles' },
    { name: 'Dj Pebbles Spanish', title: 'DJ Pebbles (Spanish)', artist: 'DJ Pebbles' },
    { name: 'Dj music', title: 'DJ Music', artist: 'DJ Pebbles' },
    { name: 'Dj pEbbles', title: 'DJ Pebbles (Original Track)', artist: 'DJ Pebbles' },
    { name: 'GameLand Penguin', title: 'GameLand Penguin', artist: 'DJ Pebbles' },
    { name: 'Overclock', title: 'Overclock', artist: 'DJ Pebbles' },
    { name: 'Overclocked', title: 'Overclocked', artist: 'DJ Pebbles' },
    { name: 'Pixel Throne', title: 'Pixel Throne', artist: 'DJ Pebbles' }
];

let songIndex = 0;
let isPlaying = false;

// 2. Load song properties (.m4a files)
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    // Encodes filenames to safely handle spaces on GitHub Pages
    audio.src = `music/${encodeURIComponent(song.name)}.m4a`; 
}

function playSong() {
    isPlaying = true;
    playBtn.innerText = '⏸';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerText = '▶';
    audio.pause();
}

// 3. Event Listeners for Play/Pause
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

// Navigation Controls
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Auto-advance playlist
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// 4. Progress Timeline Updates
function updateProgressBar(e) {
    if (isPlaying) {
        const { duration, currentTime } = e.srcElement;
        
        // Update green bar width
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Calculate display time formatting
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) { durationSeconds = `0${durationSeconds}`; }
        
        // Prevent NaN while audio buffers
        if (durationSeconds) {
            durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
        }

        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) { currentSeconds = `0${currentSeconds}`; }
        currentTimeEl.innerText = `${currentMinutes}:${currentSeconds}`;
    }
}

// Jump directly to clicked time on timeline
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

audio.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong); 

// Initialize Player
loadSong(songs[songIndex]);
