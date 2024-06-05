function search() {
    const query = document.getElementById('searchInput').value;
    fetch(`https://saavn.dev/api/search/songs?query=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results

    data.results.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';
        songDiv.innerHTML = `
            <p>${song.title} by ${song.artist}</p>
            <a href="${song.download_link}" download>Download</a>
        `;
        resultsDiv.appendChild(songDiv);
    });
}
function search() {
    const query = document.getElementById('searchInput').value;
    fetch(`https://your-api-url/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results

    data.results.forEach(song => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';
        songDiv.innerHTML = `
            <p>${song.title} by ${song.artist}</p>
            <a href="${song.download_link}" download>Download</a>
        `;
        resultsDiv.appendChild(songDiv);
    });
}
