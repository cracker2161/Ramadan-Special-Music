const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

// Default configuration
let musicConfig = {
    title: "Ramadan Special Music 🎵",
    coverImage: "https://files.sten.to/image/67cd5695b298ab4c51067cbd/aec8037cd5840762e57a3789653a87419ae63b0d27d63bec02dd41d1847caad2.jpg",
    platforms: [
        {
            name: "Spotify",
            logo: "https://files.sten.to/image/music-platforms/spotify.svg",
            link: "https://spotify.com"
        },
        {
            name: "YouTube Music",
            logo: "https://files.sten.to/image/music-platforms/youtube.svg",
            link: "https://music.youtube.com"
        },
        {
            name: "Apple Music",
            logo: "https://files.sten.to/image/music-platforms/apple-music.svg",
            link: "https://music.apple.com"
        }
    ],
    youtubeUrl: "https://pintodown.com/wp-content/plugins/pinterest-downloader/media/2d761a40272d6ab4114fd25ac14eafed.mp4"
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/config', (req, res) => {
    res.json(musicConfig);
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('updateConfig', (newConfig) => {
        musicConfig = { ...musicConfig, ...newConfig };
        io.emit('configUpdated', musicConfig);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
