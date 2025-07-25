// ===== MAIN APP CONTROLLER =====
class ShortifyApp {
    constructor() {
        this.apiKey = 'YOUR_YOUTUBE_API_KEY'; // You'll need to get this from Google
        this.currentVideo = null;
        this.generatedShorts = [];
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.setupEventListeners();
        this.initializeTheme();
        this.setupFormHandlers();
        this.initializeAnimations();
    }
    
    setupEventListeners() {
        // URL Form submission
        document.getElementById('url-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUrlSubmission();
        });
        
        // Paste button
        document.getElementById('paste-btn').addEventListener('click', () => {
            this.pasteFromClipboard();
        });
        
        // Example URLs
        document.querySelectorAll('.example-url').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                document.getElementById('youtube-url').value = url;
            });
        });
        
        // Process button
        document.getElementById('process-btn').addEventListener('click', () => {
            this.processVideo();
        });
        
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    async handleUrlSubmission() {
        const url = document.getElementById('youtube-url').value.trim();
        
        if (!this.isValidYouTubeUrl(url)) {
            this.showNotification('Please enter a valid YouTube URL', 'error');
            return;
        }
        
        this.showLoading('Analyzing video...');
        
        try {
            const videoId = this.extractVideoId(url);
            const videoData = await this.fetchVideoData(videoId);
            
            this.currentVideo = videoData;
            this.displayVideoPreview(videoData);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error fetching video:', error);
            this.showNotification('Failed to load video. Please try again.', 'error');
            this.hideLoading();
        }
    }
    
    isValidYouTubeUrl(url) {
        const patterns = [
            /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
            /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
        ];
        return patterns.some(pattern => pattern.test(url));
    }
    
    extractVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }
    
    async fetchVideoData(videoId) {
        // Simulate API call - replace with actual YouTube API
        await this.delay(2000);
        
        return {
            id: videoId,
            title: "Amazing Tech Tutorial - Complete Guide",
            description: "Learn the fundamentals of modern web development in this comprehensive tutorial...",
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            duration: "15:32",
            views: "1.2M views",
            uploadDate: "2025-01-15"
        };
    }
    
    displayVideoPreview(videoData) {
        const previewSection = document.getElementById('video-preview');
        
        document.getElementById('video-thumb').src = videoData.thumbnail;
        document.getElementById('video-title').textContent = videoData.title;
        document.getElementById('video-description').textContent = videoData.description;
        document.getElementById('video-duration').textContent = videoData.duration;
        document.getElementById('video-views').textContent = videoData.views;
        
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    async processVideo() {
        if (!this.currentVideo) {
            this.showNotification('Please select a video first', 'error');
            return;
        }
        
        const options = this.getProcessingOptions();
        this.showLoading('AI is analyzing video content...');
        
        try {
            // Simulate AI processing
            await this.delay(4000);
            
            const shorts = await this.generateShorts(this.currentVideo, options);
            this.displayGeneratedShorts(shorts);
            this.hideLoading();
            
            this.showNotification(`Successfully generated ${shorts.length} shorts!`, 'success');
            
        } catch (error) {
            console.error('Processing error:', error);
            this.showNotification('Failed to process video. Please try again.', 'error');
            this.hideLoading();
        }
    }
    
    getProcessingOptions() {
        return {
            autoCaptions: document.getElementById('auto-captions').checked,
            highlightDetection: document.getElementById('highlight-detection').checked,
            autoCrop: document.getElementById('auto-crop').checked,
            trendingHashtags: document.getElementById('trending-hashtags').checked
        };
    }
    
    async generateShorts(videoData, options) {
        // Simulate AI-generated shorts
        const mockShorts = [
            {
                id: 1,
                title: "Epic Coding Moment",
                description: "AI detected high engagement at 2:15 - Perfect debugging explanation",
                startTime: "2:15",
                duration: "0:45",
                viralScore: 95,
                thumbnail: videoData.thumbnail,
                features: ['captions', '9:16', 'hashtags'],
                hashtags: ['#coding', '#webdev', '#tutorial', '#programming']
            },
            {
                id: 2,
                title: "Mind-Blowing Tip",
                description: "Game-changing technique revealed at 8:30",
                startTime: "8:30",
                duration: "0:35",
                viralScore: 88,
                thumbnail: videoData.thumbnail,
                features: ['captions', '9:16'],
                hashtags: ['#tips', '#webdev', '#coding', '#shorts']
            },
            {
                id: 3,
                title: "Quick Solution",
                description: "Perfect solution explained in under 30 seconds",
                startTime: "12:05",
                duration: "0:28",
                viralScore: 92,
                thumbnail: videoData.thumbnail,
                features: ['captions', '9:16', 'hashtags'],
                hashtags: ['#solution', '#quicktip', '#coding', '#viral']
            }
        ];
        
        return mockShorts;
    }
    
    displayGeneratedShorts(shorts) {
        const shortsSection = document.getElementById('generated-shorts');
        const shortsGrid = document.getElementById('shorts-grid');
        const shortsCount = document.getElementById('shorts-count');
        
        shortsCount.textContent = shorts.length;
        shortsGrid.innerHTML = '';
        
        shorts.forEach((shortData, index) => {
            const shortCard = this.createShortCard(shortData);
            shortCard.style.animationDelay = `${index * 0.1}s`;
            shortCard.classList.add('animate-fade-in-up');
            shortsGrid.appendChild(shortCard);
        });
        
        shortsSection.style.display = 'block';
        shortsSection.scrollIntoView({ behavior: 'smooth' });
        
        this.generatedShorts = shorts;
    }
    
    createShortCard(shortData) {
        const template = document.getElementById('short-template');
        const shortCard = template.content.cloneNode(true);
        
        // Set video source (placeholder)
        const video = shortCard.querySelector('.short-video');
        video.poster = shortData.thumbnail;
        
        // Set overlay info
        shortCard.querySelector('.short-duration').textContent = shortData.duration;
        shortCard.querySelector('.short-score').textContent = `${shortData.viralScore}% Viral Score`;
        
        // Set details
        shortCard.querySelector('.short-title').textContent = shortData.title;
        shortCard.querySelector('.short-description').textContent = shortData.description;
        
        // Set features
        const featuresContainer = shortCard.querySelector('.short-features');
        featuresContainer.innerHTML = '';
        shortData.features.forEach(feature => {
            const tag = document.createElement('span');
            tag.className = 'feature-tag';
            
            let icon, text;
            switch(feature) {
                case 'captions':
                    icon = 'fas fa-closed-captioning';
                    text = 'Captions';
                    break;
                case '9:16':
                    icon = 'fas fa-crop';
                    text = '9:16';
                    break;
                case 'hashtags':
                    icon = 'fas fa-hashtag';
                    text = 'Tags';
                    break;
            }
            
            tag.innerHTML = `<i class="${icon}"></i> ${text}`;
            featuresContainer.appendChild(tag);
        });
        
        // Set up action buttons
        const previewBtn = shortCard.querySelector('.preview-btn');
        const editBtn = shortCard.querySelector('.edit-btn');
        const downloadBtn = shortCard.querySelector('.download-btn');
        
        previewBtn.addEventListener('click', () => this.previewShort(shortData));
        editBtn.addEventListener('click', () => this.editShort(shortData));
        downloadBtn.addEventListener('click', () => this.downloadShort(shortData));
        
        return shortCard.querySelector('.short-card');
    }
    
    previewShort(shortData) {
        this.showNotification(`Previewing "${shortData.title}"`, 'info');
        // In a real app, this would open a video player modal
    }
    
    editShort(shortData) {
        this.showNotification(`Opening editor for "${shortData.title}"`, 'info');
        // In a real app, this would open a video editor interface
    }
    
    downloadShort(shortData) {
        this.showLoading('Preparing download...');
        
        // Simulate download preparation
        setTimeout(() => {
            this.hideLoading();
            this.showNotification(`"${shortData.title}" downloaded successfully! 🎉`, 'success');
            
            // In a real app, this would trigger an actual download
            const link = document.createElement('a');
            link.href = '#'; // Would be actual video blob URL
            link.download = `${shortData.title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
            // link.click(); // Uncomment for actual download
        }, 2000);
    }
    
    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (this.isValidYouTubeUrl(text)) {
                document.getElementById('youtube-url').value = text;
                this.showNotification('URL pasted successfully!', 'success');
            } else {
                this.showNotification('Clipboard does not contain a valid YouTube URL', 'error');
            }
        } catch (error) {
            this.showNotification('Failed to read clipboard. Please paste manually.', 'error');
        }
    }
    
    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loading-overlay');
        const text = overlay.querySelector('.loading-text');
        text.textContent = message;
        overlay.classList.add('active');
    }
    
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('active');
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-text">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Style notification
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6'
        };
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            color: 'white',
            background: colors[type] || colors.info,
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxWidth: '400px'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }
    
    removeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('shortify-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('shortify-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    setupFormHandlers() {
        // Real-time URL validation
        const urlInput = document.getElementById('youtube-url');
        urlInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            const isValid = url === '' || this.isValidYouTubeUrl(url);
            
            if (isValid) {
                urlInput.style.borderColor = 'var(--border-color)';
            } else {
                urlInput.style.borderColor = '#ef4444';
            }
        });
        
        // Handle Enter key in URL input
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('url-form').dispatchEvent(new Event('submit'));
            }
        });
    }
    
    initializeAnimations() {
        // Add intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs
