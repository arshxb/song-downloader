# Music Search and Download Website

A web application that allows users to search for songs and download them. Users can also play songs directly on the website. Uses the unofficial jiosavan api.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a simple web application built with HTML, CSS, and JavaScript. It uses an API to search for songs and provides users with the ability to download them in various qualities. Users can also play the songs directly on the website using an embedded audio player.

## Features

- **Search for Songs**: Users can search for songs using a search bar.
- **Play Songs**: Users can play songs directly on the webpage.
- **Download Songs**: Users can download songs in different qualities.
- **Audio Controls**: Includes a seek bar and volume control for the audio player.
- **Theme Toggle**: Switch between light and dark themes.
- **Responsive Design**: The application is responsive and works well on mobile devices.

## Technologies Used

- HTML
- CSS
- JavaScript

## Demo

[Visit the live demo](https://arshxb.github.io/songvault) on GitHub Pages.

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- A web browser
- Internet connection

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/arshxb/songvault.git
```

2. **Navigate to the project directory:**

```bash
cd songvault
```

3. **Open `index.html` in your web browser:**

Simply open the `index.html` file in your preferred web browser to view and use the application.

## Usage

### Search for Songs

1. Enter a song name in the search bar.
2. Click the "Search" button.
3. The search results will be displayed below the search bar.

### Play or Download Songs

1. Click the "Play" button on any song card to start playing the song.
2. Use the seek bar to navigate through the song.
3. Adjust the volume using the volume slider.
4. Click the "Download" button to download the song in the selected quality.

### Toggle Theme

1. Click the Sun Icon in the top Right to switch to the light theme.
2. Click the Moon Icon in the top Right to switch back to the dark theme.

## Project Structure

```plaintext
music-search-download/
│
├── index.html           # The main HTML file
├── styles.css           # The main CSS file
├── script.js            # The main JavaScript file
└── README.md            # This README file
```

## Customization

### API Endpoint

Replace the `apiEndpoint` variable in `script.js` with your actual API endpoint:

```javascript
const apiEndpoint = "https://your-api-endpoint.com";
```

### Theme Customization

Modify the CSS variables in `styles.css` to change the look and feel of the application:

```css
:root {
    --background-color: #f0f0f0;
    --header-background-color: #6200ea;
    --header-text-color: #ffffff;
    --input-background-color: #ffffff;
    --input-text-color: #000000;
    --button-background-color: #6200ea;
    --button-text-color: #ffffff;
    --button-hover-background-color: #3700b3;
    --song-background-color: #ffffff;
    --song-box-shadow: rgba(0, 0, 0, 0.1);
    --song-text-color: #000000;
    --footer-background-color: #6200ea;
    --footer-text-color: #ffffff;
    --seekbar-color: #6200ea;
    --volume-slider-color: #3700b3;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

