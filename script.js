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
const trackListEl = document.getElementById('track-list');

// 1. Complete tracklist with your exact files from GitHub
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

// 2. Load song properties (.m4a tracks inside 'music' folder)
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    // URL-encodes track names so paths like "music/Arctic Arcade.m4a" function natively
    audio.src = `music/${encodeURIComponent(song.name)}.m4a`; 
    
    // Refresh the highlight state whenever a song changes
    if (trackListEl && trackListEl.children.length > 0) {
        updateActiveTrackHighlight();
    }
}

// 3. Penguin Playback Control Logic
function playSong() {
    isPlaying = true;
    playBtn.innerText = '⏸️'; // Changes to pause button when playing
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerText = '🐧'; // Changes back to the penguin when paused
    audio.pause();
}

// Play or Pause execution trigger
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
        
        // Progress bar width configuration
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Time conversion formatting (Duration)
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) { durationSeconds = `0${durationSeconds}`; }
        
        if (durationSeconds) {
            durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
        }

        // Time conversion formatting (Current Elapsed)
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) { currentSeconds = `0${currentSeconds}`; }
        currentTimeEl.innerText = `${currentMinutes}:${currentSeconds}`;
    }
}

// Seek/Jump timeline on mouse click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

audio.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong); // Auto-advance track when finished

// 5. Dynamic Tracklist Generator
function initPlaylistUI() {
    trackListEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerText = `🧊 ${song.title}`; // Cozy ice cube label padding
        if (index === songIndex) li.classList.add('active');
        
        // Quick select row listener
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        trackListEl.appendChild(li);
    });
}

// Refresh visual active styling indicator across rows
function updateActiveTrackHighlight() {
    const rows = trackListEl.querySelectorAll('li');
    rows.forEach((row, index) => {
        if (index === songIndex) {
            row.classList.add('active');
            row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Auto-scroll to current song
        } else {
            row.remove('active');
        }
    });
}

// Launch player structure
initPlaylistUI();
loadSong(songs[songIndex]);
