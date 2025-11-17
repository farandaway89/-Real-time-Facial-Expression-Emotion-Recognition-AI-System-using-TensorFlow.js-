/**
 * Report Generator Module
 * Generates clinical reports in PDF format
 */

class ReportGenerator {
    constructor() {
        this.reportData = null;
    }

    /**
     * Generate clinical report PDF
     * @param {EmotionTracker} tracker - Emotion tracker instance
     * @param {string} patientName - Patient name
     * @param {string} sessionNotes - Session notes
     */
    async generateReport(tracker, patientName = '', sessionNotes = '') {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Get summary statistics
            const stats = tracker.getSummaryStats();

            // PDF dimensions
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            let yPos = margin;

            // Header
            pdf.setFillColor(99, 102, 241);
            pdf.rect(0, 0, pageWidth, 40, 'F');

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(24);
            pdf.setFont(undefined, 'bold');
            pdf.text('Facial Expression Analysis Report', margin, yPos + 10);

            pdf.setFontSize(12);
            pdf.setFont(undefined, 'normal');
            pdf.text('Real-time Emotion Recognition System', margin, yPos + 20);

            yPos = 50;

            // Report metadata
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(11);

            const reportDate = new Date().toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            pdf.text(`Report Date: ${reportDate}`, margin, yPos);
            yPos += 7;

            if (patientName) {
                pdf.text(`Patient Name: ${patientName}`, margin, yPos);
                yPos += 7;
            }

            pdf.text(`Session Duration: ${stats.sessionDuration} seconds`, margin, yPos);
            yPos += 7;

            pdf.text(`Total Data Points: ${stats.totalDataPoints}`, margin, yPos);
            yPos += 15;

            // Section: Summary Statistics
            this.addSectionHeader(pdf, 'Summary Statistics', yPos);
            yPos += 10;

            // Draw statistics box
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.5);
            pdf.rect(margin, yPos, pageWidth - 2 * margin, 60);

            pdf.setFontSize(10);
            const statsY = yPos + 8;

            // Dominant emotion
            const emotionNames = {
                happy: 'Happy (행복)',
                sad: 'Sad (슬픔)',
                angry: 'Angry (화남)',
                fearful: 'Fearful (두려움)',
                surprised: 'Surprised (놀람)',
                disgusted: 'Disgusted (혐오)',
                neutral: 'Neutral (중립)'
            };

            pdf.text(`Dominant Emotion: ${emotionNames[stats.dominantEmotion]}`, margin + 5, statsY);
            pdf.text(`Emotion Changes: ${stats.emotionChangeCount}`, margin + 5, statsY + 7);
            pdf.text(`Average Confidence: ${stats.averageConfidence}%`, margin + 5, statsY + 14);

            // Emotion distribution table
            pdf.setFont(undefined, 'bold');
            pdf.text('Emotion Distribution:', margin + 5, statsY + 25);
            pdf.setFont(undefined, 'normal');

            let tableY = statsY + 32;
            Object.entries(stats.emotionPercentages).forEach(([emotion, percentage], index) => {
                if (index === 4) {
                    tableY = statsY + 32;
                    pdf.text(`${emotionNames[emotion]}: ${percentage}%`, margin + 90, tableY);
                } else if (index > 4) {
                    tableY += 7;
                    pdf.text(`${emotionNames[emotion]}: ${percentage}%`, margin + 90, tableY);
                } else {
                    pdf.text(`${emotionNames[emotion]}: ${percentage}%`, margin + 5, tableY);
                    tableY += 7;
                }
            });

            yPos += 70;

            // Section: Emotion Timeline Chart
            this.addSectionHeader(pdf, 'Emotion Timeline', yPos);
            yPos += 10;

            // Capture chart as image
            const chartCanvas = document.getElementById('emotionChart');
            if (chartCanvas) {
                try {
                    const chartImage = chartCanvas.toDataURL('image/png');
                    const chartWidth = pageWidth - 2 * margin;
                    const chartHeight = 80;
                    pdf.addImage(chartImage, 'PNG', margin, yPos, chartWidth, chartHeight);
                    yPos += chartHeight + 10;
                } catch (error) {
                    console.error('Error capturing chart:', error);
                    pdf.text('Chart capture failed', margin, yPos);
                    yPos += 10;
                }
            }

            // Session Notes
            if (sessionNotes) {
                // Check if we need a new page
                if (yPos > pageHeight - 60) {
                    pdf.addPage();
                    yPos = margin;
                }

                this.addSectionHeader(pdf, 'Session Notes', yPos);
                yPos += 10;

                pdf.setFontSize(10);
                const splitNotes = pdf.splitTextToSize(sessionNotes, pageWidth - 2 * margin);
                pdf.text(splitNotes, margin, yPos);
                yPos += splitNotes.length * 7;
            }

            // Clinical Interpretation
            if (yPos > pageHeight - 80) {
                pdf.addPage();
                yPos = margin;
            }

            this.addSectionHeader(pdf, 'Clinical Interpretation', yPos);
            yPos += 10;

            const interpretation = this.generateInterpretation(stats);
            pdf.setFontSize(10);
            const splitInterpretation = pdf.splitTextToSize(interpretation, pageWidth - 2 * margin);
            pdf.text(splitInterpretation, margin, yPos);

            // Footer
            const footerY = pageHeight - 15;
            pdf.setFontSize(8);
            pdf.setTextColor(128, 128, 128);
            pdf.text('Generated by Real-time Facial Expression Emotion Recognition AI System', margin, footerY);
            pdf.text(`Page 1 of ${pdf.internal.getNumberOfPages()}`, pageWidth - margin - 20, footerY);

            // Add page numbers if multiple pages
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(128, 128, 128);
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, footerY);
            }

            // Save PDF
            const filename = `emotion_report_${patientName || 'patient'}_${Date.now()}.pdf`;
            pdf.save(filename);

            console.log('✅ Report generated successfully:', filename);
            return true;
        } catch (error) {
            console.error('❌ Error generating report:', error);
            alert('리포트 생성 중 오류가 발생했습니다.');
            return false;
        }
    }

    /**
     * Add section header to PDF
     * @param {jsPDF} pdf
     * @param {string} title
     * @param {number} yPos
     */
    addSectionHeader(pdf, title, yPos) {
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yPos - 5, pdf.internal.pageSize.getWidth() - 40, 8, 'F');

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, 22, yPos);
    }

    /**
     * Generate clinical interpretation based on statistics
     * @param {Object} stats - Summary statistics
     * @returns {string}
     */
    generateInterpretation(stats) {
        const emotionNames = {
            happy: 'happiness',
            sad: 'sadness',
            angry: 'anger',
            fearful: 'fear',
            surprised: 'surprise',
            disgusted: 'disgust',
            neutral: 'neutral state'
        };

        let interpretation = `During this ${stats.sessionDuration}-second session, the subject's facial expressions were analyzed continuously. `;

        // Dominant emotion analysis
        const dominantEmotion = emotionNames[stats.dominantEmotion];
        const dominantPercentage = stats.emotionPercentages[stats.dominantEmotion];
        interpretation += `The dominant emotion observed was ${dominantEmotion}, appearing in ${dominantPercentage}% of the analyzed frames. `;

        // Emotion stability analysis
        if (stats.emotionChangeCount < 5) {
            interpretation += `The subject showed high emotional stability with only ${stats.emotionChangeCount} emotion transitions. `;
        } else if (stats.emotionChangeCount < 15) {
            interpretation += `The subject displayed moderate emotional variability with ${stats.emotionChangeCount} emotion transitions. `;
        } else {
            interpretation += `The subject exhibited significant emotional fluctuation with ${stats.emotionChangeCount} emotion transitions, suggesting heightened emotional responsiveness. `;
        }

        // Confidence analysis
        const avgConf = parseFloat(stats.averageConfidence);
        if (avgConf > 70) {
            interpretation += `The average detection confidence of ${stats.averageConfidence}% indicates highly reliable measurements. `;
        } else if (avgConf > 50) {
            interpretation += `The average detection confidence of ${stats.averageConfidence}% suggests moderately reliable measurements. `;
        } else {
            interpretation += `The average detection confidence of ${stats.averageConfidence}% indicates potential limitations in measurement reliability. `;
        }

        // Emotional diversity
        const significantEmotions = Object.entries(stats.emotionPercentages)
            .filter(([emotion, percentage]) => parseFloat(percentage) > 10)
            .length;

        if (significantEmotions > 3) {
            interpretation += `The subject displayed a diverse emotional range with ${significantEmotions} emotions showing significant presence. `;
        } else if (significantEmotions > 1) {
            interpretation += `The subject showed ${significantEmotions} primary emotional states during the session. `;
        } else {
            interpretation += `The subject maintained a relatively consistent emotional state throughout the session. `;
        }

        interpretation += '\n\nNote: This automated analysis should be used as a supplementary tool and interpreted within the broader clinical context by qualified professionals.';

        return interpretation;
    }

    /**
     * Export raw data as JSON
     * @param {EmotionTracker} tracker - Emotion tracker instance
     */
    exportJSON(tracker) {
        const data = tracker.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `emotion_data_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        console.log('✅ Data exported successfully');
    }

    /**
     * Export data as CSV
     * @param {EmotionTracker} tracker - Emotion tracker instance
     */
    exportCSV(tracker) {
        const data = tracker.exportData();
        const history = data.emotionHistory;

        if (history.length === 0) {
            alert('내보낼 데이터가 없습니다.');
            return;
        }

        // CSV headers
        let csv = 'Timestamp,Time Label,Happy,Sad,Angry,Fearful,Surprised,Disgusted,Neutral,Dominant Emotion\n';

        // CSV data rows
        history.forEach(point => {
            const row = [
                point.timestamp,
                point.timeLabel,
                (point.expressions.happy * 100).toFixed(2),
                (point.expressions.sad * 100).toFixed(2),
                (point.expressions.angry * 100).toFixed(2),
                (point.expressions.fearful * 100).toFixed(2),
                (point.expressions.surprised * 100).toFixed(2),
                (point.expressions.disgusted * 100).toFixed(2),
                (point.expressions.neutral * 100).toFixed(2),
                point.dominantEmotion
            ];
            csv += row.join(',') + '\n';
        });

        // Download CSV
        const csvBlob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `emotion_data_${Date.now()}.csv`;
        link.click();

        URL.revokeObjectURL(url);
        console.log('✅ CSV exported successfully');
    }
}
