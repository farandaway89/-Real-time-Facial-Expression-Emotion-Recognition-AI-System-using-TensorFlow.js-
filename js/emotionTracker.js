/**
 * Emotion Tracker Module
 * Tracks emotion changes over time and provides visualization
 */

class EmotionTracker {
    constructor() {
        this.emotionHistory = [];
        this.maxHistoryLength = 100;
        this.startTime = null;
        this.chart = null;
        this.emotionCounts = {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            surprised: 0,
            disgusted: 0,
            neutral: 0
        };
        this.previousEmotion = null;
        this.emotionChangeCount = 0;

        this.initChart();
    }

    /**
     * Initialize Chart.js emotion tracking chart
     */
    initChart() {
        const ctx = document.getElementById('emotionChart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: '행복 (Happy)',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '슬픔 (Sad)',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '화남 (Angry)',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '두려움 (Fearful)',
                        data: [],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '놀람 (Surprised)',
                        data: [],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '혐오 (Disgusted)',
                        data: [],
                        borderColor: '#14b8a6',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '중립 (Neutral)',
                        data: [],
                        borderColor: '#6b7280',
                        backgroundColor: 'rgba(107, 114, 128, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '시간',
                            color: '#a0a0b0'
                        },
                        ticks: {
                            color: '#a0a0b0',
                            maxTicksLimit: 10
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '확률 (%)',
                            color: '#a0a0b0'
                        },
                        ticks: {
                            color: '#a0a0b0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        min: 0,
                        max: 100
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    /**
     * Start tracking session
     */
    start() {
        this.startTime = Date.now();
        this.emotionHistory = [];
        this.emotionCounts = {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            surprised: 0,
            disgusted: 0,
            neutral: 0
        };
        this.previousEmotion = null;
        this.emotionChangeCount = 0;
        this.clearChart();
    }

    /**
     * Add emotion data point
     * @param {Object} expressions - Face-api.js expression results
     */
    addDataPoint(expressions) {
        if (!this.startTime) {
            this.start();
        }

        const timestamp = Date.now() - this.startTime;
        const timeLabel = this.formatTime(timestamp);

        // Get dominant emotion
        const dominantEmotion = this.getDominantEmotion(expressions);

        // Track emotion changes
        if (this.previousEmotion && this.previousEmotion !== dominantEmotion) {
            this.emotionChangeCount++;
        }
        this.previousEmotion = dominantEmotion;

        // Update emotion counts
        this.emotionCounts[dominantEmotion]++;

        // Add to history
        const dataPoint = {
            timestamp: timestamp,
            timeLabel: timeLabel,
            expressions: { ...expressions },
            dominantEmotion: dominantEmotion
        };

        this.emotionHistory.push(dataPoint);

        // Limit history length
        if (this.emotionHistory.length > this.maxHistoryLength) {
            this.emotionHistory.shift();
        }

        // Update chart
        this.updateChart(timeLabel, expressions);

        // Update statistics
        this.updateStatistics();
    }

    /**
     * Get dominant emotion from expressions
     * @param {Object} expressions
     * @returns {string}
     */
    getDominantEmotion(expressions) {
        let maxEmotion = 'neutral';
        let maxValue = 0;

        for (const [emotion, value] of Object.entries(expressions)) {
            if (value > maxValue) {
                maxValue = value;
                maxEmotion = emotion;
            }
        }

        return maxEmotion;
    }

    /**
     * Update chart with new data
     * @param {string} timeLabel
     * @param {Object} expressions
     */
    updateChart(timeLabel, expressions) {
        if (!this.chart) return;

        this.chart.data.labels.push(timeLabel);

        // Update each emotion dataset
        const emotionMap = ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral'];
        emotionMap.forEach((emotion, index) => {
            const value = (expressions[emotion] * 100).toFixed(2);
            this.chart.data.datasets[index].data.push(value);
        });

        // Limit chart data points
        if (this.chart.data.labels.length > this.maxHistoryLength) {
            this.chart.data.labels.shift();
            this.chart.data.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }

        this.chart.update('none'); // Update without animation for better performance
    }

    /**
     * Clear chart data
     */
    clearChart() {
        if (!this.chart) return;

        this.chart.data.labels = [];
        this.chart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        this.chart.update();
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        // Analysis time
        if (this.startTime) {
            const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            document.getElementById('analysisTime').textContent = `${elapsedSeconds}초`;
        }

        // Dominant emotion
        const dominantEmotion = this.getMostFrequentEmotion();
        const emotionNames = {
            happy: '행복',
            sad: '슬픔',
            angry: '화남',
            fearful: '두려움',
            surprised: '놀람',
            disgusted: '혐오',
            neutral: '중립'
        };
        document.getElementById('dominantEmotion').textContent = emotionNames[dominantEmotion] || '-';

        // Emotion changes
        document.getElementById('emotionChanges').textContent = this.emotionChangeCount;

        // Average confidence
        if (this.emotionHistory.length > 0) {
            const avgConfidence = this.emotionHistory.reduce((sum, point) => {
                const maxConfidence = Math.max(...Object.values(point.expressions));
                return sum + maxConfidence;
            }, 0) / this.emotionHistory.length;
            document.getElementById('avgConfidence').textContent = `${(avgConfidence * 100).toFixed(1)}%`;
        }
    }

    /**
     * Get most frequent emotion
     * @returns {string}
     */
    getMostFrequentEmotion() {
        let maxEmotion = 'neutral';
        let maxCount = 0;

        for (const [emotion, count] of Object.entries(this.emotionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxEmotion = emotion;
            }
        }

        return maxEmotion;
    }

    /**
     * Format milliseconds to readable time
     * @param {number} ms
     * @returns {string}
     */
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${seconds}s`;
    }

    /**
     * Clear all tracking data
     */
    clear() {
        this.emotionHistory = [];
        this.emotionCounts = {
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            surprised: 0,
            disgusted: 0,
            neutral: 0
        };
        this.previousEmotion = null;
        this.emotionChangeCount = 0;
        this.startTime = null;
        this.clearChart();
        this.updateStatistics();
    }

    /**
     * Export tracking data as JSON
     * @returns {Object}
     */
    exportData() {
        return {
            sessionDuration: this.startTime ? Date.now() - this.startTime : 0,
            emotionHistory: this.emotionHistory,
            emotionCounts: this.emotionCounts,
            emotionChangeCount: this.emotionChangeCount,
            mostFrequentEmotion: this.getMostFrequentEmotion(),
            exportDate: new Date().toISOString()
        };
    }

    /**
     * Get summary statistics
     * @returns {Object}
     */
    getSummaryStats() {
        const totalDataPoints = this.emotionHistory.length;
        const dominantEmotion = this.getMostFrequentEmotion();

        // Calculate percentages based on CURRENT history only (not accumulated counts)
        const currentCounts = {
            happy: 0, sad: 0, angry: 0, fearful: 0,
            surprised: 0, disgusted: 0, neutral: 0
        };

        // Count emotions in current history
        this.emotionHistory.forEach(point => {
            currentCounts[point.dominantEmotion]++;
        });

        // Calculate percentages
        const emotionPercentages = {};
        for (const [emotion, count] of Object.entries(currentCounts)) {
            emotionPercentages[emotion] = totalDataPoints > 0
                ? ((count / totalDataPoints) * 100).toFixed(1)
                : '0.0';
        }

        // Calculate average confidence
        let avgConfidence = 0;
        if (this.emotionHistory.length > 0) {
            avgConfidence = this.emotionHistory.reduce((sum, point) => {
                const maxConfidence = Math.max(...Object.values(point.expressions));
                return sum + maxConfidence;
            }, 0) / this.emotionHistory.length;
        }

        return {
            totalDataPoints,
            dominantEmotion,
            emotionPercentages,
            emotionChangeCount: this.emotionChangeCount,
            averageConfidence: (avgConfidence * 100).toFixed(1),
            sessionDuration: this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0
        };
    }
}
