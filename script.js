const apiEndpoint = "https://saavn.dev/api/search/songs";
let selectedQuality = '320kbps';

function setDefaultQuality() {
    const qualitySelector = document.getElementById('qualitySelector');
    selectedQuality = qualitySelector.value;
    console.log(selectedQuality);
}

function getQualityValueIndex(selectedQuality) {
    switch(selectedQuality) {
        case "320kbps":
            return 0;
        case "160kbps":
            return 1;
        case "96kbps":
            return 2;
        case "48kbps":
            return 3;
        case "12kbps":
            return 4;
        // Add more cases for other quality levels if needed
        default:
            return 0; // highest quality
    }
}

async function search() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        try {
            const response = await fetch(`${apiEndpoint}?query=${query}`);
            const data = await response.json();
            if (data.success) {
                displayResults(data.data.results);
            } else {
                alert('No results found.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Please enter a search term.');
    }
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results
    // Hide the welcome message
    const welcomeElement = document.getElementById('welcome');
    welcomeElement.style.display = 'none';

    results.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';

        const songName = song.name || 'Unknown';
        const artistName = song.artists.primary && song.artists.primary[0] ? song.artists.primary[0].name : 'Unknown Artist';
        const imageUrl = song.image && song.image[2] ? song.image[2].url : song.image[0].url;

        // Create the song info section
        const songInfoDiv = document.createElement('div');
        songInfoDiv.className = 'song-info';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${songName} cover`;
        songInfoDiv.appendChild(img);

        const songDetailsDiv = document.createElement('div');
        songDetailsDiv.className = 'song-details';

        const songNameP = document.createElement('p');
        songNameP.className = 'song-name';
        songNameP.innerHTML = `<strong>${songName}</strong>`;
        songDetailsDiv.appendChild(songNameP);

        const artistNameP = document.createElement('p');
        artistNameP.className = 'artist-name';
        artistNameP.textContent = `by ${artistName}`;
        songDetailsDiv.appendChild(artistNameP);

        songInfoDiv.appendChild(songDetailsDiv);
        songDiv.appendChild(songInfoDiv);

        // Create the download and play links section
        const downloadLinksDiv = document.createElement('div');
        downloadLinksDiv.className = 'download-links';

        if (song.downloadUrl && song.downloadUrl.length > 0) {
            // Sort download options by quality in descending order
            song.downloadUrl.sort((a, b) => parseInt(b.quality) - parseInt(a.quality));

            // Create a dropdown for quality selection
            
            const qualitySelect = document.createElement('select');
            qualitySelect.id = `quality-${song.id}`;
            qualitySelect.className = 'quality-dropdown';
            qualitySelect.onchange = () => updateAudioSource(song.id);
            // todo: This line hides the select element. find a better way to do this, a lot of functionality is dependent on this select element being present in the dom
            // removing it from dom breaks the updateAudioSource functionality 
            // before i wanted to provide the option to select the quality for individual songs, but now we providing the default quality for every song
            qualitySelect.style.display = 'none'; 

            song.downloadUrl.forEach(download => {
                const option = document.createElement('option');
                option.value = download.url;
                option.textContent = download.quality;
                qualitySelect.appendChild(option);
            });
            downloadLinksDiv.appendChild(qualitySelect);
            


            // Create the audio player
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player';

            const audio = document.createElement('audio');
            audio.id = `audio-${song.id}`;
            audio.src = song.downloadUrl[0].url;
            playerDiv.appendChild(audio);

            const playButton = document.createElement('button');
            playButton.id = `play-button-${song.id}`;
            playButton.className = 'play-button';
            // replace the play button with a play icon
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            // playButton.textContent = 'Play';
            playButton.onclick = () => togglePlay(song.id);
            playerDiv.appendChild(playButton);

            const seekBar = document.createElement('input');
            seekBar.type = 'range';
            seekBar.id = `seek-${song.id}`;
            seekBar.className = 'seek-bar';
            seekBar.value = 0;
            seekBar.max = 100;
            seekBar.step = 1;
            seekBar.oninput = () => seekAudio(song.id);
            playerDiv.appendChild(seekBar);

            downloadLinksDiv.appendChild(playerDiv);

            // Create the volume slider
            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.id = `volume-${song.id}`;
            volumeSlider.className = 'volume-slider';
            volumeSlider.min = 0;
            volumeSlider.max = 1;
            volumeSlider.step = 0.01;
            volumeSlider.value = 1;
            volumeSlider.oninput = () => {
                audio.volume = volumeSlider.value;
            };

            playerDiv.appendChild(volumeSlider);

            // Create the download button
            const downloadButton = document.createElement('button');
            downloadButton.className = 'download-button';
            downloadButton.textContent = 'Download';
            downloadButton.onclick = () => downloadSong(songName, artistName, song.id);
            downloadLinksDiv.appendChild(downloadButton);
        } else {
            const noDownloadP = document.createElement('p');
            noDownloadP.textContent = 'No download links available.';
            downloadLinksDiv.appendChild(noDownloadP);
        }

        songDiv.appendChild(downloadLinksDiv);
        resultsDiv.appendChild(songDiv);

        // Set the default quality to user defined one
        let index = getQualityValueIndex(selectedQuality);
        // check for out of bounds
        if (song.downloadUrl && song.downloadUrl.length > index) {
            document.getElementById(`quality-${song.id}`).value = song.downloadUrl[index].url;
        } else {
            document.getElementById(`quality-${song.id}`).value = song.downloadUrl[0].url;
        }
    });
}


function updateAudioSource(songId) {
    const qualityDropdown = document.getElementById(`quality-${songId}`);
    const audioElement = document.getElementById(`audio-${songId}`);
    audioElement.src = qualityDropdown.value;
}

function togglePlay(songId) {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        const playButton = audio.nextElementSibling;
        if (audio.id === `audio-${songId}`) {
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        } else {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    const audioElement = document.getElementById(`audio-${songId}`);
    audioElement.addEventListener('timeupdate', () => {
        const seekBar = document.getElementById(`seek-${songId}`);
        seekBar.value = (audioElement.currentTime / audioElement.duration) * 100;
    });

    audioElement.addEventListener('ended', () => {
        document.getElementById(`play-button-${songId}`).textContent = 'Play';
        document.getElementById(`seek-${songId}`).value = 0;
    });
}

function seekAudio(songId) {
    const audioElement = document.getElementById(`audio-${songId}`);
    const seekBar = document.getElementById(`seek-${songId}`);
    const seekTime = (seekBar.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
}

async function downloadSong(songName, artistName, songId) {
    const qualityDropdown = document.getElementById(`quality-${songId}`);
    const downloadUrl = qualityDropdown.value;
    const quality = qualityDropdown.options[qualityDropdown.selectedIndex].text;
    const fileName = `${songName} - ${artistName} [${quality}].m4a`;

    try {
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(a.href);
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    const themeToggleButton = document.getElementById('theme-toggle');
    if (body.classList.contains('light-theme')) {
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        //themeToggleButton.textContent = 'Switch to dark Theme';
    } else {
        themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        //themeToggleButton.textContent = 'Switch to light Theme';
    }
}

