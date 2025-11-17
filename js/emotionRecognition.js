/**
 * Emotion Recognition Module
 * Handles face detection and emotion recognition using face-api.js
 */

class EmotionRecognition {
    constructor() {
        this.modelsLoaded = false;
        this.videoElement = null;
        this.canvasElement = null;
        this.isRunning = false;
        this.detectionInterval = null;
        this.lastFrameTime = Date.now();
        this.fps = 0;

        // Emotion mappings
        this.emotionIcons = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            fearful: '😨',
            surprised: '😲',
            disgusted: '🤢',
            neutral: '😐'
        };

        this.emotionNames = {
            happy: '행복',
            sad: '슬픔',
            angry: '화남',
            fearful: '두려움',
            surprised: '놀람',
            disgusted: '혐오',
            neutral: '중립'
        };
    }

    /**
     * Load face-api.js models
     */
    async loadModels() {
        try {
            // Try CDN first (works with file:// protocol), fallback to local models
            const modelPaths = [
                'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights',
                './models'
            ];

            document.getElementById('modelStatus').textContent = '모델 로딩 중...';
            document.getElementById('modelStatus').classList.add('loading');

            let lastError = null;

            for (let i = 0; i < modelPaths.length; i++) {
                const modelPath = modelPaths[i];
                console.log(`🔄 Trying to load models from: ${modelPath}`);

                try {
                    await Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
                        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
                        faceapi.nets.faceExpressionNet.loadFromUri(modelPath)
                    ]);

                    this.modelsLoaded = true;
                    document.getElementById('modelStatus').textContent = '준비 완료';
                    document.getElementById('modelStatus').classList.remove('loading');
                    document.getElementById('modelStatus').style.color = '#10b981';

                    // Enable start button
                    const startBtn = document.getElementById('startBtn');
                    if (startBtn) {
                        startBtn.disabled = false;
                        startBtn.textContent = '시작하기';
                    }

                    console.log(`✅ Face-api.js models loaded successfully from: ${modelPath}`);
                    return true;
                } catch (error) {
                    console.warn(`⚠️ Failed to load from ${modelPath}:`, error.message);
                    lastError = error;
                    // Continue to next model path
                }
            }

            // If we get here, all paths failed
            throw lastError;

        } catch (error) {
            console.error('❌ Error loading models from all sources:', error);
            document.getElementById('modelStatus').textContent = '모델 로딩 실패';
            document.getElementById('modelStatus').style.color = '#ef4444';

            // More helpful error message
            const errorMsg = `모델 로드 실패:\n\n` +
                `1. 인터넷 연결을 확인하세요\n` +
                `2. 브라우저 콘솔(F12)에서 자세한 오류를 확인하세요\n` +
                `3. Chrome 브라우저를 사용하세요\n\n` +
                `오류 상세: ${error.message}`;

            alert(errorMsg);
            return false;
        }
    }

    /**
     * Initialize video stream from webcam
     */
    async startVideo() {
        try {
            this.videoElement = document.getElementById('video');
            this.canvasElement = document.getElementById('overlay');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false
            });

            this.videoElement.srcObject = stream;

            return new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    // Set canvas size to match video
                    this.canvasElement.width = this.videoElement.videoWidth;
                    this.canvasElement.height = this.videoElement.videoHeight;
                    resolve(true);
                };
            });
        } catch (error) {
            console.error('❌ Error accessing webcam:', error);
            alert('웹캠에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
            return false;
        }
    }

    /**
     * Stop video stream
     */
    stopVideo() {
        if (this.videoElement && this.videoElement.srcObject) {
            const stream = this.videoElement.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }

        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }

        this.isRunning = false;

        // Clear canvas
        if (this.canvasElement) {
            const ctx = this.canvasElement.getContext('2d');
            ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        }
    }

    /**
     * Start emotion detection loop
     * @param {EmotionTracker} tracker - Emotion tracker instance
     */
    async startDetection(tracker) {
        if (!this.modelsLoaded) {
            alert('모델이 아직 로드되지 않았습니다.');
            return;
        }

        this.isRunning = true;

        // Detection options
        const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.5
        });

        // Run detection loop
        const detectEmotions = async () => {
            if (!this.isRunning) return;

            try {
                // Detect faces with landmarks and expressions
                const detections = await faceapi
                    .detectAllFaces(this.videoElement, options)
                    .withFaceLandmarks()
                    .withFaceExpressions();

                // Update FPS
                this.updateFPS();

                // Clear canvas
                const ctx = this.canvasElement.getContext('2d');
                ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

                // Update face count
                document.getElementById('faceCount').textContent = detections.length;

                if (detections.length > 0) {
                    // Get the first face (you can modify this to handle multiple faces)
                    const detection = detections[0];

                    // Draw detection results
                    this.drawDetection(detection);

                    // Update emotion display
                    this.updateEmotionDisplay(detection.expressions);

                    // Add to tracker
                    if (tracker) {
                        tracker.addDataPoint(detection.expressions);
                    }
                } else {
                    // No face detected
                    this.resetEmotionDisplay();
                }
            } catch (error) {
                console.error('Error in detection loop:', error);
            }

            // Continue loop
            if (this.isRunning) {
                requestAnimationFrame(detectEmotions);
            }
        };

        // Start the detection loop
        detectEmotions();
    }

    /**
     * Draw detection results on canvas
     * @param {Object} detection - Face-api.js detection result
     */
    drawDetection(detection) {
        const ctx = this.canvasElement.getContext('2d');

        // Draw bounding box
        const box = detection.detection.box;
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Draw landmarks
        const landmarks = detection.landmarks.positions;
        ctx.fillStyle = '#10b981';
        landmarks.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Get dominant emotion
        const expressions = detection.expressions;
        let dominantEmotion = 'neutral';
        let maxConfidence = 0;

        for (const [emotion, confidence] of Object.entries(expressions)) {
            if (confidence > maxConfidence) {
                maxConfidence = confidence;
                dominantEmotion = emotion;
            }
        }

        // Draw emotion label
        const emotionText = `${this.emotionNames[dominantEmotion]} (${(maxConfidence * 100).toFixed(1)}%)`;
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(emotionText, box.x, box.y - 10);
    }

    /**
     * Update emotion display in UI
     * @param {Object} expressions - Face-api.js expressions
     */
    updateEmotionDisplay(expressions) {
        // Get dominant emotion
        let dominantEmotion = 'neutral';
        let maxConfidence = 0;

        for (const [emotion, confidence] of Object.entries(expressions)) {
            if (confidence > maxConfidence) {
                maxConfidence = confidence;
                dominantEmotion = emotion;
            }
        }

        // Update current emotion display
        document.getElementById('emotionIcon').textContent = this.emotionIcons[dominantEmotion];
        document.getElementById('emotionName').textContent = this.emotionNames[dominantEmotion];
        document.getElementById('emotionConfidence').textContent = `${(maxConfidence * 100).toFixed(1)}%`;

        // Update probability bars
        for (const [emotion, confidence] of Object.entries(expressions)) {
            const percentage = (confidence * 100).toFixed(1);
            const fillElement = document.getElementById(`prob-${emotion}`);
            const valueElement = document.getElementById(`val-${emotion}`);

            if (fillElement) {
                fillElement.style.width = `${percentage}%`;
            }
            if (valueElement) {
                valueElement.textContent = `${percentage}%`;
            }
        }
    }

    /**
     * Reset emotion display when no face is detected
     */
    resetEmotionDisplay() {
        document.getElementById('emotionIcon').textContent = '😐';
        document.getElementById('emotionName').textContent = '얼굴 없음';
        document.getElementById('emotionConfidence').textContent = '0%';

        // Reset all probability bars
        const emotions = ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral'];
        emotions.forEach(emotion => {
            const fillElement = document.getElementById(`prob-${emotion}`);
            const valueElement = document.getElementById(`val-${emotion}`);

            if (fillElement) {
                fillElement.style.width = '0%';
            }
            if (valueElement) {
                valueElement.textContent = '0%';
            }
        });
    }

    /**
     * Update FPS counter
     */
    updateFPS() {
        const now = Date.now();
        const delta = now - this.lastFrameTime;
        this.fps = Math.round(1000 / delta);
        this.lastFrameTime = now;

        document.getElementById('fps').textContent = this.fps;
    }

    /**
     * Take screenshot of current video frame with overlays
     * @returns {string} - Data URL of the screenshot
     */
    async takeScreenshot() {
        const canvas = document.createElement('canvas');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;

        const ctx = canvas.getContext('2d');

        // Draw video frame (flip horizontally to match display)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.videoElement, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // Draw overlay
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(this.canvasElement, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // Convert to data URL
        return canvas.toDataURL('image/png');
    }
}
