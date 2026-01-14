// Common JavaScript for All Video Pages

// Get storage key based on page
function getStorageKey() {
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    return `watched${page}Videos`;
}

// DOM elements
let mainVideo, mainVideoTitle, mainVideoLecture, mainVideoCategory, mainVideoDesc;
let videoList, categoryButtons, searchInput;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    mainVideo = document.getElementById('mainVideo');
    mainVideoTitle = document.getElementById('mainVideoTitle');
    mainVideoLecture = document.getElementById('mainVideoLecture');
    mainVideoCategory = document.getElementById('mainVideoCategory');
    mainVideoDesc = document.getElementById('mainVideoDesc');
    videoList = document.getElementById('videoList');
    categoryButtons = document.querySelectorAll('.category-btn');
    searchInput = document.getElementById('searchInput');

    // Initialize watched videos from localStorage
    if (typeof videos !== 'undefined') {
        const storageKey = getStorageKey();
        let watchedVideos = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        videos.forEach(video => {
            video.watched = watchedVideos.includes(video.id);
        });

        // Display initial video list
        displayVideoList(videos);

        // Set up event listeners
        setupEventListeners();

        // Add smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
});

// Display video list
function displayVideoList(videosToDisplay) {
    if (!videoList) return;
    
    videoList.innerHTML = '';
    
    videosToDisplay.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.setAttribute('data-category', video.category);
        videoItem.setAttribute('data-id', video.id);
        
        // Add watched class if video is watched
        if (video.watched) {
            videoItem.classList.add('watched');
        }
        
        // Set first video as active by default (or the default video specified)
        const firstVideo = videosToDisplay[0];
        if (video.id === firstVideo.id) {
            videoItem.classList.add('active');
        }
        
        videoItem.innerHTML = `
            <div class="video-thumb">
                <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                        title="${video.title}" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
            <div class="video-item-info">
                <h4 class="video-item-title">${video.title}</h4>
                <div class="video-item-meta">
                    <span><i class="fas fa-play-circle"></i> Lecture ${video.id}</span>
                    <span>${getCategoryName(video.category)}</span>
                </div>
                ${video.watched ? '<i class="fas fa-check-circle" style="color: var(--success); margin-top: 5px;"></i>' : ''}
            </div>
        `;
        
        // Add click event to load video in main player
        videoItem.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.video-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            videoItem.classList.add('active');
            
            // Update main video player
            mainVideo.src = `https://www.youtube.com/embed/${video.youtubeId}`;
            mainVideoTitle.textContent = video.title;
            mainVideoLecture.innerHTML = `<i class="fas fa-book-open"></i> Lecture ${video.id}`;
            mainVideoCategory.innerHTML = `<i class="fas fa-folder"></i> ${getCategoryName(video.category)}`;
            mainVideoDesc.textContent = video.description;
            
            // Mark as watched
            if (!video.watched) {
                video.watched = true;
                saveWatchedVideos();
                displayVideoList(videosToDisplay); // Refresh list to show checkmarks
            }

            // Scroll to top on mobile
            if (window.innerWidth <= 768) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        videoList.appendChild(videoItem);
    });
}

// Helper function to get category display name
function getCategoryName(category) {
    const categoryMaps = {
        'intro': 'Introduction',
        'complexity': 'Complexity Analysis',
        'divide': 'Divide & Conquer',
        'greedy': 'Greedy Algorithms',
        'dp': 'Dynamic Programming',
        'graph': 'Graph Algorithms',
        'instructions': 'Instructions',
        'arithmetic': 'Arithmetic',
        'pipelining': 'Pipelining',
        'memory': 'Memory',
        'lexical': 'Lexical Analysis',
        'parsing': 'Parsing',
        'sdt': 'Syntax Directed Translation',
        'codegen': 'Code Generation',
        'addressing': 'IP Addressing',
        'subnetting': 'Subnetting',
        'error': 'Error Detection',
        'protocols': 'Protocols',
        'tcp': 'TCP/IP',
        'datatypes': 'Data Types',
        'operators': 'Operators',
        'control': 'Control Flow',
        'functions': 'Functions',
        'arrays': 'Arrays & Pointers',
        'advanced': 'Advanced Topics',
        'linked': 'Linked Lists',
        'stack': 'Stacks & Queues',
        'trees': 'Trees',
        'hashing': 'Hashing',
        'keys': 'Keys & FDs',
        'normalization': 'Normalization',
        'transactions': 'Transactions',
        'concurrency': 'Concurrency',
        'ermodel': 'ER Model',
        'sql': 'SQL & RA',
        'file': 'File Organization',
        'gates': 'Logic Gates',
        'algebra': 'Boolean Algebra',
        'kmap': 'K-Maps',
        'combinational': 'Combinational Circuits',
        'sequential': 'Sequential Circuits',
        'counters': 'Counters',
        'numbers': 'Number Systems',
        'conversion': 'ADC/DAC',
        'practice': 'Practice Questions',
        'logic': 'Logic',
        'set': 'Set Theory',
        'combinatorics': 'Combinatorics'
    };
    
    return categoryMaps[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// Save watched videos to localStorage
function saveWatchedVideos() {
    const storageKey = getStorageKey();
    const watchedVideos = videos.filter(video => video.watched).map(video => video.id);
    localStorage.setItem(storageKey, JSON.stringify(watchedVideos));
}

// Filter videos by category
function filterVideos(category) {
    if (category === 'all') {
        return videos;
    }
    return videos.filter(video => video.category === category);
}

// Search videos
function searchVideos(query) {
    const lowerCaseQuery = query.toLowerCase();
    return videos.filter(video => 
        video.title.toLowerCase().includes(lowerCaseQuery) || 
        video.description.toLowerCase().includes(lowerCaseQuery)
    );
}

// Setup event listeners
function setupEventListeners() {
    // Category buttons
    if (categoryButtons) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.getAttribute('data-category');
                const filteredVideos = filterVideos(category);
                displayVideoList(filteredVideos);
                
                // Reset main video to first video in filtered list
                if (filteredVideos.length > 0) {
                    updateMainVideo(filteredVideos[0]);
                }
            });
        });
    }

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            let filteredVideos;
            
            if (query === '') {
                // If search is empty, show videos based on active category
                const activeCategory = document.querySelector('.category-btn.active')?.getAttribute('data-category') || 'all';
                filteredVideos = filterVideos(activeCategory);
            } else {
                // Otherwise, search across all videos
                filteredVideos = searchVideos(query);
            }
            
            displayVideoList(filteredVideos);
            
            // Reset main video to first video in filtered list
            if (filteredVideos.length > 0) {
                updateMainVideo(filteredVideos[0]);
            }
        });
    }
}

// Update main video player
function updateMainVideo(video) {
    if (!mainVideo || !video) return;
    
    mainVideo.src = `https://www.youtube.com/embed/${video.youtubeId}`;
    mainVideoTitle.textContent = video.title;
    mainVideoLecture.innerHTML = `<i class="fas fa-book-open"></i> Lecture ${video.id}`;
    mainVideoCategory.innerHTML = `<i class="fas fa-folder"></i> ${getCategoryName(video.category)}`;
    mainVideoDesc.textContent = video.description;
    
    // Update active state in list
    document.querySelectorAll('.video-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.video-item[data-id="${video.id}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements when they exist
setTimeout(() => {
    document.querySelectorAll('.video-item, .course-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}, 100);