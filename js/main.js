/**
 * Main Application Script
 * Integrates all modules and handles user interactions
 */

// Global instances
let emotionRecognition = null;
let emotionTracker = null;
let reportGenerator = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Emotion Recognition System...');

    // Create instances
    emotionRecognition = new EmotionRecognition();
    emotionTracker = new EmotionTracker();
    reportGenerator = new ReportGenerator();

    // Load face-api.js models
    await emotionRecognition.loadModels();

    // Setup event listeners
    setupEventListeners();

    console.log('✅ Application initialized successfully');
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Start button
    document.getElementById('startBtn').addEventListener('click', async () => {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const screenshotBtn = document.getElementById('screenshotBtn');

        startBtn.disabled = true;
        startBtn.textContent = '시작 중...';

        try {
            // Start video
            const videoStarted = await emotionRecognition.startVideo();

            if (videoStarted) {
                // Start emotion detection
                emotionTracker.start();
                await emotionRecognition.startDetection(emotionTracker);

                startBtn.textContent = '실행 중';
                stopBtn.disabled = false;
                screenshotBtn.disabled = false;

                console.log('✅ Detection started');
            } else {
                startBtn.disabled = false;
                startBtn.textContent = '시작하기';
            }
        } catch (error) {
            console.error('❌ Error starting detection:', error);
            alert('시작 중 오류가 발생했습니다.');
            startBtn.disabled = false;
            startBtn.textContent = '시작하기';
        }
    });

    // Stop button
    document.getElementById('stopBtn').addEventListener('click', () => {
        emotionRecognition.stopVideo();

        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const screenshotBtn = document.getElementById('screenshotBtn');

        startBtn.disabled = false;
        startBtn.textContent = '시작하기';
        stopBtn.disabled = true;
        screenshotBtn.disabled = true;

        console.log('⏹️ Detection stopped');
    });

    // Screenshot button
    document.getElementById('screenshotBtn').addEventListener('click', async () => {
        try {
            const screenshot = await emotionRecognition.takeScreenshot();

            // Download screenshot
            const link = document.createElement('a');
            link.href = screenshot;
            link.download = `emotion_screenshot_${Date.now()}.png`;
            link.click();

            console.log('📸 Screenshot taken');
        } catch (error) {
            console.error('❌ Error taking screenshot:', error);
            alert('스크린샷 저장 중 오류가 발생했습니다.');
        }
    });

    // Clear data button
    document.getElementById('clearDataBtn').addEventListener('click', () => {
        if (confirm('모든 트래킹 데이터를 초기화하시겠습니까?')) {
            emotionTracker.clear();
            console.log('🗑️ Data cleared');
        }
    });

    // Export data button
    document.getElementById('exportDataBtn').addEventListener('click', () => {
        const options = ['JSON', 'CSV'];
        const choice = prompt('데이터 형식을 선택하세요:\n1. JSON\n2. CSV', '1');

        if (choice === '1') {
            reportGenerator.exportJSON(emotionTracker);
        } else if (choice === '2') {
            reportGenerator.exportCSV(emotionTracker);
        }
    });

    // Generate report button
    document.getElementById('generateReportBtn').addEventListener('click', async () => {
        const patientName = document.getElementById('patientName').value.trim();
        const sessionNotes = document.getElementById('sessionNotes').value.trim();

        const generateBtn = document.getElementById('generateReportBtn');
        generateBtn.disabled = true;
        generateBtn.textContent = '생성 중...';

        try {
            await reportGenerator.generateReport(emotionTracker, patientName, sessionNotes);
            alert('임상 리포트가 성공적으로 생성되었습니다!');
        } catch (error) {
            console.error('❌ Error generating report:', error);
            alert('리포트 생성 중 오류가 발생했습니다.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '📄 임상 리포트 생성';
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Spacebar to toggle start/stop
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');

            if (!startBtn.disabled) {
                startBtn.click();
            } else if (!stopBtn.disabled) {
                stopBtn.click();
            }
        }

        // 'S' key for screenshot
        if (e.key === 's' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const screenshotBtn = document.getElementById('screenshotBtn');
            if (!screenshotBtn.disabled) {
                screenshotBtn.click();
            }
        }

        // 'R' key for report
        if (e.key === 'r' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const reportBtn = document.getElementById('generateReportBtn');
            if (!reportBtn.disabled) {
                reportBtn.click();
            }
        }
    });
}

/**
 * Handle errors gracefully
 */
window.addEventListener('error', (event) => {
    console.error('❌ Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
});

/**
 * Display keyboard shortcuts on page load
 */
window.addEventListener('load', () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  실시간 얼굴 표정 감정 인식 시스템                        ║
║  Real-time Facial Expression Emotion Recognition System  ║
╠═══════════════════════════════════════════════════════════╣
║  Keyboard Shortcuts:                                      ║
║  • Space        - Start/Stop detection                    ║
║  • S            - Take screenshot                         ║
║  • R            - Generate report                         ║
╠═══════════════════════════════════════════════════════════╣
║  7 Emotion Classes:                                       ║
║  😊 Happy     😢 Sad       😠 Angry                       ║
║  😨 Fearful   😲 Surprised  🤢 Disgusted                  ║
║  😐 Neutral                                               ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
