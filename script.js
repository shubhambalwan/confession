const totalFrames = 33;
const frameDelay = 100; // ms per frame (10fps for "cartoon" feel)
const framePath = (num) => `assets/ezgif-frame-${String(num).padStart(3, '0')}.jpg`;

const frameImg = document.getElementById('story-frame');
const loadingScreen = document.getElementById('loading-screen');
const textOverlay = document.getElementById('text-overlay');
const interactionContainer = document.getElementById('interaction-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const letterOverlay = document.getElementById('letter-overlay');

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

let currentFrame = 1;
let images = [];

// Preload Assets
function preloadImages() {
    let loadedCount = 0;
    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = framePath(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalFrames) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        startScreen.classList.remove('hidden'); // Show start screen
                    }, 500);
                }, 500);
            }
        };
        img.onerror = () => {
            console.error(`Failed to load frame ${i}`);
            loadedCount++;
            if (loadedCount === totalFrames) {
                loadingScreen.style.display = 'none';
                startScreen.classList.remove('hidden');
            }
        }
        images[i] = img;
    }
}

startBtn.onclick = () => {
    startScreen.style.opacity = '0';
    setTimeout(() => {
        startScreen.classList.add('hidden');
        startStory();
    }, 500);
};

function updateFrame(frameNum) {
    if (images[frameNum]) {
        frameImg.src = images[frameNum].src;
    }
}

function playSequence(start, end, onComplete) {
    currentFrame = start;

    function next() {
        if (currentFrame > end) {
            if (onComplete) onComplete();
            return;
        }
        updateFrame(currentFrame);
        currentFrame++;
        setTimeout(next, frameDelay);
    }
    next();
}

function showPrompt(text, yesCallback) {
    questionText.textContent = text;
    optionsContainer.innerHTML = ''; // Clear previous options

    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes';
    yesBtn.onclick = () => {
        interactionContainer.classList.add('hidden');
        yesCallback();
    };

    optionsContainer.appendChild(yesBtn);
    interactionContainer.classList.remove('hidden');
}

function startStory() {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';

        // Phase 1: Hi Text + frames 1-12
        textOverlay.classList.remove('hidden');
        playSequence(1, 12, () => {
            // Phase 2: Prompt
            showPrompt("Can you plant a seed for me?", () => {
                // Phase 3: Planting sequence (13-40)
                playSequence(13, 33, () => {
                    // Phase 4: Final Prompt
                    showPrompt("Can you read this letter for me?", () => {
                        // Phase 5: Show letter
                        letterOverlay.classList.remove('hidden');
                        // Force reflow
                        void letterOverlay.offsetWidth;
                        letterOverlay.classList.add('visible');
                    });
                });
            });
        });

    }, 500);
}

// Start
preloadImages();
