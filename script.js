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
        const imageUrl = song.image && song.image[0] ? song.image[0].url : '';

        // Create the song info section
        let songInfoHTML = `
            <p><strong>${songName}</strong> by ${artistName}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="${songName} cover">` : ''}
        `;

        // Create the download and play links section
        let downloadLinksHTML = '<div class="download-links"><p>Download Links and Play:</p>';
        if (song.downloadUrl && song.downloadUrl.length > 0) {
            song.downloadUrl.forEach((download, index) => {
                const audioId = `audio-${song.id}-${index}`;
                downloadLinksHTML += `
                    <div class="download-option">
                        <button onclick="playAudio('${download.url}', '${audioId}')">Play</button>
                        <button onclick="downloadSong('${download.url}', '${songName}', '${artistName}', '${download.quality}')">Download ${download.quality}</button>
                        <audio id="${audioId}" src="${download.url}"></audio>
                    </div>
                `;
            });
        } else {
            downloadLinksHTML += '<p>No download links available.</p>';
        }
        downloadLinksHTML += '</div>';

        // Combine song info and download links
        songDiv.innerHTML = songInfoHTML + downloadLinksHTML;
        resultsDiv.appendChild(songDiv);
    });
}

function playAudio(url, audioId) {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        if (audio.id === audioId) {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        } else {
            audio.pause();
        }
    });
}

function downloadSong(url, songName, artistName, quality) {
    const fileName = `${songName} - ${artistName} [${quality}].m4a`;
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(a.href);
        })
        .catch(error => console.error('Error downloading the file:', error));
}
