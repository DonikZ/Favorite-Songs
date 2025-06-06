
var lagu = [
    ['Rewrite The Stars', 'Anne Marie & James Arthur', '125K', '2.3M', 'Rewrite the stars.jpg', 'Rewrite song.mp3'],
    ['Monokrom', 'Tulus', '89K', '1.8M', 'Monokrom.jpg', 'Monokrom song.mp3'],
    ['Film Favorit', 'Sheila On 7', '67K', '987K', 'Film Favorit.jpg', 'Film song.mp3'], 
    ['Nina', 'Feast', '156K', '3.1M', 'Nina.jpg', 'Nina song.mp3'],
    ['Bertaut', 'Nadin Amizah', '203K', '4.2M', 'bertaut.jpg', 'Bertaut song.mp3'],
    ['Perfect', 'One Direction', '94K', '1.5M', 'One direction.jpg', 'perfect song.mp3'],
    ['Labirin', 'Tulus', '112K', '2.4M', 'Labirin.jpg', 'Labirin.mp3'],
    ['Lesung Pipi', 'Raim ', '89K', '1.6M', 'Lesung Pipi.jpeg', 'Lesung Pipi.mp3'],
    ['Manusia Kuat', 'Tulus', '78K', '1.2M', 'Manusia Kuat.jpg', 'Manusia Kuat.mp3'],
];

var container = document.getElementById('songs-container');
var currentAudio = null;
var currentSongIndex = -1;
var progressInterval = null; 
var isDragging = false; 

var konten = '';

lagu.forEach((lagu, index) => {
    konten += `
        <div class="song-card" onclick="playSong('${lagu[0]}', '${lagu[1]}', '${lagu[5]}', ${index})">
            <button class="play-button">
                <i class="ph ph-play"></i>
            </button>
            <div class="song-header">
                <img src="${lagu[4]}" alt="${lagu[0]}" class="song-image">
                <div class="song-info">
                    <h3>${lagu[0]}</h3>
                    <p class="artist">by ${lagu[1]}</p>
                </div>
            </div>
            <div class="song-stats">
                <div class="stat">
                    <i class="ph ph-heart"></i>
                    <span>${lagu[2]}</span>
                </div>
                <div class="stat">
                    <i class="ph ph-play"></i>
                    <span>${lagu[3]}</span>
                </div>
            </div>
        </div>
    `;
});

container.innerHTML = konten;

function playSong(title, artist, audioFile, index) {
  
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
   
    resetProgressBar();
    

    currentAudio = new Audio(audioFile);
    currentSongIndex = index;
    
  
    let currentInfo = document.querySelector('.current-info');
    if (currentInfo) {
        currentInfo.innerHTML = `
            <h4>${title}</h4>
            <p>by ${artist}</p>
        `;
    }
    
   
    const playBtn = document.querySelector('.control-btn.play i');
    if (playBtn) {
        playBtn.className = 'ph ph-pause';
    }
    

    currentAudio.addEventListener('loadedmetadata', function() {
        updateTimeDisplay();
        startProgressUpdate();
    });
    
 
    currentAudio.addEventListener('ended', function() {
        const playBtn = document.querySelector('.control-btn.play i');
        if (playBtn) {
            playBtn.className = 'ph ph-play';
        }
        resetProgressBar();
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        playNextSong();
    });
    

    currentAudio.addEventListener('error', function(e) {
        console.error('Error loading audio:', e);
        alert('Gagal memuat file audio: ' + audioFile);
        resetProgressBar();
    });
    
 
    currentAudio.addEventListener('pause', function() {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
    });
    
    currentAudio.addEventListener('play', function() {
        startProgressUpdate();
    });

    currentAudio.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('Gagal memutar audio. Pastikan file audio tersedia.');
        resetProgressBar();
    });
}


function startProgressUpdate() {
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    progressInterval = setInterval(() => {
        if (currentAudio && !isDragging) {
            updateProgressBar();
            updateTimeDisplay();
        }
    }, 100); 
}


function updateProgressBar() {
    if (!currentAudio) return;
    
    const progress = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-container');
    
    if (progress && currentAudio.duration) {
        const percentage = (currentAudio.currentTime / currentAudio.duration) * 100;
        progress.style.width = percentage + '%';
        
    
        progress.style.animation = 'none';
    }
}


function resetProgressBar() {
    const progress = document.querySelector('.progress');
    if (progress) {
        progress.style.width = '0%';
        progress.style.animation = 'none';
    }
    updateTimeDisplay(0, 0);
}


function updateTimeDisplay(currentTime = null, duration = null) {
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    
    if (currentAudio) {
        const current = currentTime !== null ? currentTime : currentAudio.currentTime;
        const total = duration !== null ? duration : currentAudio.duration;
        
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(current);
        }
        if (totalTimeEl && total) {
            totalTimeEl.textContent = formatTime(total);
        }
    } else {
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
        if (totalTimeEl) totalTimeEl.textContent = '0:00';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function seekAudio(percentage) {
    if (currentAudio && currentAudio.duration) {
        currentAudio.currentTime = (percentage / 100) * currentAudio.duration;
        updateProgressBar();
        updateTimeDisplay();
    }
}

 
function playNextSong() {
    if (currentSongIndex < lagu.length - 1) {
        const nextIndex = currentSongIndex + 1;
        const nextSong = lagu[nextIndex];
        playSong(nextSong[0], nextSong[1], nextSong[5], nextIndex);
    }
}


function playPreviousSong() {
    if (currentSongIndex > 0) {
        const prevIndex = currentSongIndex - 1;
        const prevSong = lagu[prevIndex];
        playSong(prevSong[0], prevSong[1], prevSong[5], prevIndex);
    }
}


document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (this.classList.contains('play')) {
            const icon = this.querySelector('i');
            if (currentAudio) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    icon.className = 'ph ph-pause';
                } else {
                    currentAudio.pause();
                    icon.className = 'ph ph-play';
                }
            }
        } else if (this.classList.contains('next')) {
            playNextSong();
        } else if (this.classList.contains('prev')) {
            playPreviousSong();
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const progressContainer = document.querySelector('.progress-container');
    
    if (progressContainer) {
        
        progressContainer.addEventListener('click', function(e) {
            if (!currentAudio || !currentAudio.duration) return;
            
            const rect = this.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            seekAudio(Math.max(0, Math.min(100, percentage)));
        });
        
        
        progressContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        function handleMouseMove(e) {
            if (!isDragging || !currentAudio || !currentAudio.duration) return;
            
            const rect = progressContainer.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            
            
            const progress = document.querySelector('.progress');
            if (progress) {
                progress.style.width = clampedPercentage + '%';
            }
        }
        
        function handleMouseUp(e) {
            if (isDragging && currentAudio && currentAudio.duration) {
                const rect = progressContainer.getBoundingClientRect();
                const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                seekAudio(Math.max(0, Math.min(100, percentage)));
            }
            
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }
});


document.addEventListener('click', function(e) {
    if (e.target.closest('.song-card')) {
        const card = e.target.closest('.song-card');
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
});


document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        const playBtn = document.querySelector('.control-btn.play');
        if (playBtn) {
            playBtn.click();
        }
    } else if (e.code === 'ArrowRight') {
        playNextSong();
    } else if (e.code === 'ArrowLeft') {
        playPreviousSong();
    }
});

function setVolume(value) {
    if (currentAudio) {
        currentAudio.volume = value / 100;
    }
}
