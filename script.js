async function search() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        try {
            const response = await fetch(`https://saavn.dev/api/search/songs?query=${query}`);
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

    results.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';

        const songName = song.name || 'Unknown';
        const artistName = song.artists.primary && song.artists.primary[0] ? song.artists.primary[0].name : 'Unknown Artist';
        const imageUrl = song.image && song.image[2] ? song.image[2].url : song.image[0].url;

        // Create the song info section
        let songInfoHTML = `
            <p><strong>${songName}</strong> by ${artistName}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="${songName} cover">` : ''}
        `;

        // Create the download and play links section
        let downloadLinksHTML = '<div class="download-links"><p>Download and Play:</p>';
        if (song.downloadUrl && song.downloadUrl.length > 0) {
            // Sort download options by quality in descending order
            song.downloadUrl.sort((a, b) => parseInt(b.quality) - parseInt(a.quality));

            // Create a dropdown for quality selection
            downloadLinksHTML += `
                <select id="quality-${song.id}" onchange="updateAudioSource('${song.id}')">
                    ${song.downloadUrl.map(download => `<option value="${download.url}">${download.quality}</option>`).join('')}
                </select>
                <button onclick="downloadSong('${songName}', '${artistName}', '${song.id}')">Download</button>
                <div class="player">
                    <audio id="audio-${song.id}" src="${song.downloadUrl[0].url}"></audio>
                    <button id="play-button-${song.id}" onclick="togglePlay('${song.id}')">Play</button>
                    <input type="range" id="seek-${song.id}" value="0" max="100" step="1" oninput="seekAudio('${song.id}')">
                </div>
            `;
        } else {
            downloadLinksHTML += '<p>No download links available.</p>';
        }
        downloadLinksHTML += '</div>';

        // Combine song info and download links
        songDiv.innerHTML = songInfoHTML + downloadLinksHTML;
        resultsDiv.appendChild(songDiv);

        // Set the default quality to the highest available
        document.getElementById(`quality-${song.id}`).value = song.downloadUrl[0].url;
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
                playButton.textContent = 'Pause';
            } else {
                audio.pause();
                playButton.textContent = 'Play';
            }
        } else {
            audio.pause();
            playButton.textContent = 'Play';
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
    body.classList.toggle('dark-theme');
    const themeToggleButton = document.getElementById('theme-toggle');
    if (body.classList.contains('dark-theme')) {
        themeToggleButton.textContent = 'Switch to Light Theme';
    } else {
        themeToggleButton.textContent = 'Switch to Dark Theme';
    }
}
