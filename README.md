# Ramadan-Special-Music



Music 🎶 

সম্পূর্ণ প্রজেক্টের আপডেটেড কোড:

1. `package.json`:
```json
{
  "name": "ramadan-music-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "socket.io": "^4.4.1"
  }
}
```

2. `index.js`:
```javascript
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
```

3. `public/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Ramadan Special Music 🎵</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            overflow-x: hidden;
            background: #1f1f1f;
            display: flex;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
            padding: 0 1em;
        }
        
        #container {
            position: fixed;
            overflow: auto;
            background-color: #1f1f1f;
            height: 100vh;
            left: 0;
            right: 0;
            width: 100%;
            text-align: center;
        }
        
        #content {
            position: relative;
            z-index: 5555;
            width: 100%;
            margin: 0 auto 1em auto;
            padding: 0.5em;
            max-width: 410px;
        }
        
        #user-artwork {
            display: block;
            width: 100%;
            max-width: 400px;
            min-height: 400px;
            border-radius: 5px 5px 0 0;
            object-fit: cover;
        }
        
        .platforms-list__name {
            padding: 1.2em 1.5em;
            letter-spacing: 1px;
            text-align: center;
            font-family: 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
            width: 100%;
            font-size: 1em;
            color: #fff;
            background: #111;
            font-weight: 400;
            margin: 0;
        }
        
        .platform-list {
            width: 100%;
            margin: 0 auto;
            overflow: hidden;
            border-radius: 0 0 5px 5px;
            background: #fff;
            box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.25);
        }
        
        .music-link__container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.7em 1em;
            border-bottom: 1px solid #f6f6f6;
            width: 100%;
            background: #fff;
        }
        
        .music-link__logo {
            width: 7em;
            height: auto;
        }
        
        .music-link__button {
            text-decoration: none;
            padding: 0.5em 1em;
            background: #fff;
            color: #333;
            border: 1px solid #dadadada;
            font-weight: bold;
            border-radius: 25px;
            cursor: pointer;
        }
        
        .music-link__button:hover {
            background: #333;
            color: #fff;
        }
        
        .youtube-embed {
            margin-top: 1em;
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            height: 0;
            max-width: 400px;
        }
        
        .youtube-embed iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="container">
        <div id="content">
            <img id="user-artwork" alt="Cover Art">
            <h1 class="platforms-list__name"></h1>
            <div class="platform-list"></div>
            <div class="youtube-embed">
                <iframe frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        
        function updateUI(config) {
            document.title = config.title;
            document.getElementById('user-artwork').src = config.coverImage;
            document.querySelector('.platforms-list__name').textContent = config.title;
            
            const platformList = document.querySelector('.platform-list');
            platformList.innerHTML = '';
            
            config.platforms.forEach(platform => {
                const div = document.createElement('div');
                div.className = 'music-link__container';
                div.innerHTML = `
                    <span class="music-link__logo-container">
                        <img class='music-link__logo' src="${platform.logo}" alt="${platform.name}">
                    </span>
                    <a href="${platform.link}" target="_blank" class='music-link__button'>Visit</a>
                `;
                platformList.appendChild(div);
            });
            
            document.querySelector('.youtube-embed iframe').src = config.youtubeUrl;
        }

        fetch('/api/config')
            .then(res => res.json())
            .then(config => updateUI(config));

        socket.on('configUpdated', (newConfig) => {
            updateUI(newConfig);
        });
    </script>
</body>
</html>
```

4. `public/admin.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Admin Panel - Ramadan Music</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }

        .admin-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h1 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }

        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }

        input:focus {
            outline: none;
            border-color: #4CAF50;
        }

        .platform-entry {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }

        .platform-entry input {
            margin-bottom: 10px;
        }

        button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.3s;
        }

        .btn-primary {
            background: #4CAF50;
            color: white;
        }

        .btn-danger {
            background: #f44336;
            color: white;
        }

        .btn-add {
            background: #2196F3;
            color: white;
            margin-bottom: 20px;
        }

        button:hover {
            opacity: 0.9;
        }

        .actions {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }

        .save-status {
            text-align: center;
            margin-top: 20px;
            color: #4CAF50;
            font-weight: 500;
            display: none;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <h1>Admin Panel</h1>
        
        <div class="form-group">
            <label>Title:</label>
            <input type="text" id="title" placeholder="Enter title">
        </div>

        <div class="form-group">
            <label>Cover Image URL:</label>
            <input type="text" id="coverImage" placeholder="Enter image URL">
        </div>

        <div class="form-group">
            <label>YouTube Video URL:</label>
            <input type="text" id="youtubeUrl" placeholder="Enter YouTube video URL">
        </div>

        <h2>Music Platforms</h2>
        <button class="btn-add" onclick="addPlatform()">Add New Platform</button>
        <div id="platforms-container"></div>

        <div class="actions">
            <button class="btn-primary" onclick="saveChanges()">Save All Changes</button>
            <button class="btn-danger" onclick="resetChanges()">Reset</button>
        </div>

        <div id="saveStatus" class="save-status">Changes saved successfully!</div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        let currentConfig;

        function updateForm(config) {
            document.getElementById('title').value = config.title;
            document.getElementById('coverImage').value = config.coverImage;
            document.getElementById('youtubeUrl').value = config.youtubeUrl;
            
            const platformsContainer = document.getElementById('platforms-container');
            platformsContainer.innerHTML = '';
            
            config.platforms.forEach((platform, index) => {
                const div = document.createElement('div');
                div.className = 'platform-entry';
                div.innerHTML = `
                    <input type="text" placeholder="Platform Name" value="${platform.name}" 
                           onchange="updatePlatform(${index}, 'name', this.value)">
                    <input type="text" placeholder="Logo URL" value="${platform.logo}" 
                           onchange="updatePlatform(${index}, 'logo', this.value)">
                    <input type="text" placeholder="Link" value="${platform.link}" 
                           onchange="updatePlatform(${index}, 'link', this.value)">
                    <button class="btn-danger" onclick="removePlatform(${index})">Remove</button>
                `;
                platformsContainer.appendChild(div);
            });
        }

        function addPlatform() {
            currentConfig.platforms.push({
                name: "",
                logo: "",
                link: ""
            });
            updateForm(currentConfig);
        }

        function removePlatform(index) {
            currentConfig.platforms.splice(index, 1);
            updateForm(currentConfig);
        }

        function updatePlatform(index, field, value) {
            currentConfig.platforms[index][field] = value;
        }

        function showSaveStatus() {
            const status = document.getElementById('saveStatus');
            status.style.display = 'block';
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }

        function saveChanges() {
            const newConfig = {
                title: document.getElementById('title').value,
                coverImage: document.getElementById('coverImage').value,
                youtubeUrl: document.getElementById('youtubeUrl').value,
                platforms: currentConfig.platforms
            };

            socket.emit('updateConfig', newConfig);
            showSaveStatus();
        }

        function resetChanges() {
            fetch('/api/config')
                .then(res => res.json())
                .then(config => {
                    currentConfig = config;
                    updateForm(config);
                });
        }

        // Initial load
        fetch('/api/config')
            .then(res => res.json())
            .then(config => {
                currentConfig = config;
                updateForm(config);
            });

        // Listen for updates from other admin sessions
        socket.on('configUpdated', (newConfig) => {
            currentConfig = newConfig;
            updateForm(newConfig);
        });
    </script>
</body>
</html>
```

প্রজেক্ট রান করার জন্য:

1. নতুন ফোল্ডার তৈরি করুন:
```bash
mkdir ramadan-music-app
cd ramadan-music-app
```

2. প্রজেক্ট ইনিশিয়ালাইজ করুন:
```bash
npm init -y
```

3. প্রয়োজনীয় প্যাকেজ ইনস্টল করুন:
```bash
npm install express socket.io
```

4. উপরের সব ফাইল তৈরি করুন এবং কোড কপি করুন।

5. প্রজেক্ট স্ট্রাকচার:
```
ramadan-music-app/
  ├── node_modules/
  ├── public/
  │   ├── index.html
  │   └── admin.html
  ├── index.js
  └── package.json
```

6. সার্ভার রান করুন:
```bash
node index.js
```

7. ব্রাউজারে অ্যাক্সেস করুন:
- মেইন পেজ: `http://localhost:3000`
- অ্যাডমিন প্যানেল: `http://localhost:3000/admin`

এই প্রজেক্টে:
- মেইন পেজে মিউজিক প্লেয়ার ও প্ল্যাটফর্ম লিংক দেখা যাবে
- অ্যাডমিন প্যানেল থেকে সব কিছু আপডেট করা যাবে
- Socket.io দিয়ে রিয়েল-টাইম আপডেট হবে
- রেস্পন্সিভ ডিজাইন
- ইউজার-ফ্রেন্ডলি ইন্টারফেস
