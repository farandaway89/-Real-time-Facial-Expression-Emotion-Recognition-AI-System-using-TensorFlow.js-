# 🎭 실시간 얼굴 표정 감정 인식 AI 시스템

Real-time Facial Expression Emotion Recognition AI System using TensorFlow.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.11.0-orange.svg)](https://www.tensorflow.org/js)
[![Face-API.js](https://img.shields.io/badge/Face--API.js-0.22.2-blue.svg)](https://github.com/justadudewhohacks/face-api.js)

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [데모](#데모)
- [설치 및 실행](#설치-및-실행)
- [사용 방법](#사용-방법)
- [프로젝트 구조](#프로젝트-구조)
- [API 문서](#api-문서)
- [키보드 단축키](#키보드-단축키)
- [성능 최적화](#성능-최적화)
- [문제 해결](#문제-해결)
- [기여하기](#기여하기)
- [라이선스](#라이선스)

## 🎯 프로젝트 소개

이 프로젝트는 **TensorFlow.js**와 **face-api.js**를 사용하여 웹 브라우저에서 실시간으로 얼굴 표정을 분석하고 감정을 인식하는 AI 시스템입니다. 별도의 서버나 복잡한 설치 과정 없이 브라우저에서 바로 실행할 수 있으며, 임상 및 연구 목적으로 활용할 수 있는 리포트 생성 기능을 제공합니다.

### ✨ 특징

- 🚀 **완전한 클라이언트 사이드 실행** - 서버 없이 브라우저에서 모든 처리
- 🎯 **7가지 감정 분류** - 높은 정확도의 감정 인식
- 📊 **실시간 시각화** - Chart.js를 활용한 감정 변화 추적
- 📄 **임상 리포트 생성** - PDF 형식의 전문 리포트
- 📱 **반응형 디자인** - 다양한 디바이스 지원
- ⚡ **빠른 처리 속도** - TinyFaceDetector를 통한 최적화

## 🎨 주요 기능

### 1. 실시간 얼굴 표정 분석

- 웹캠을 통한 실시간 비디오 스트림 처리
- 얼굴 감지 및 68개 랜드마크 추출
- 밀리초 단위의 빠른 감정 분석

### 2. 7가지 감정 분류

| 감정 | 영문 | 아이콘 |
|------|------|--------|
| 행복 | Happy | 😊 |
| 슬픔 | Sad | 😢 |
| 화남 | Angry | 😠 |
| 두려움 | Fearful | 😨 |
| 놀람 | Surprised | 😲 |
| 혐오 | Disgusted | 🤢 |
| 중립 | Neutral | 😐 |

### 3. 감정 변화 트래킹

- 시간에 따른 감정 변화를 실시간 그래프로 표시
- 최대 100개 데이터 포인트 저장
- 각 감정별 확률 분포 시각화

### 4. 통계 분석

- **분석 시간**: 전체 세션 시간 측정
- **가장 많은 감정**: 세션 동안 가장 자주 나타난 감정
- **감정 변화 횟수**: 감정 전환 빈도 추적
- **평균 신뢰도**: 감정 인식의 평균 정확도

### 5. 임상 리포트 생성

- PDF 형식의 전문 리포트
- 환자 이름 및 세션 노트 포함
- 감정 타임라인 차트 첨부
- 자동 임상 해석 제공

### 6. 데이터 내보내기

- **JSON 형식**: 전체 데이터 상세 정보
- **CSV 형식**: 스프레드시트 호환 형식

## 🛠 기술 스택

### Core Technologies

- **TensorFlow.js** (v4.11.0) - 딥러닝 프레임워크
- **face-api.js** (v0.22.2) - 얼굴 인식 라이브러리
- **Chart.js** (v4.4.0) - 데이터 시각화
- **jsPDF** (v2.5.1) - PDF 생성

### 딥러닝 모델

1. **TinyFaceDetector** - 경량화된 얼굴 감지 모델
2. **FaceLandmark68Net** - 68개 얼굴 랜드마크 추출
3. **FaceRecognitionNet** - 얼굴 특징 벡터 생성
4. **FaceExpressionNet** - 7가지 감정 분류

### Frontend

- HTML5 (Canvas, Video API)
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)

## 📸 데모

### 메인 인터페이스

```
┌─────────────────────────────────────────────────────────┐
│  🎭 실시간 얼굴 표정 감정 인식 시스템                   │
│     TensorFlow.js 기반 7가지 감정 분류 AI               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [비디오 스트림]     │     [감정 분석 결과]            │
│   - 얼굴 감지        │      - 현재 감정 표시            │
│   - 랜드마크 표시    │      - 확률 분포 막대            │
│                      │                                  │
├─────────────────────────────────────────────────────────┤
│  📊 감정 변화 트래킹 (실시간 차트)                      │
├─────────────────────────────────────────────────────────┤
│  📈 통계 분석                                           │
│  [분석 시간] [가장 많은 감정] [변화 횟수] [평균 신뢰도]│
├─────────────────────────────────────────────────────────┤
│  📋 임상 리포트 생성                                    │
└─────────────────────────────────────────────────────────┘
```

## 🚀 설치 및 실행

### 사전 요구사항

- 최신 웹 브라우저 (Chrome, Firefox, Edge, Safari)
- 웹캠
- 인터넷 연결 (CDN을 통한 라이브러리 로드)

### 방법 1: 직접 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/emotion-recognition-system.git
cd emotion-recognition-system

# 2. 웹 브라우저로 index.html 열기
# 방법 A: 파일 더블클릭
# 방법 B: 브라우저에서 Ctrl+O로 파일 열기
```

### 방법 2: 로컬 서버 사용 (권장)

```bash
# npm 사용
npm install
npm start

# 또는 Python 사용
python -m http.server 8080

# 또는 Node.js http-server 사용
npx http-server -p 8080
```

그런 다음 브라우저에서 `http://localhost:8080` 접속

### 방법 3: Live Server (VS Code)

1. VS Code에서 프로젝트 열기
2. Live Server 확장 설치
3. index.html에서 우클릭 > "Open with Live Server"

## 📖 사용 방법

### 기본 사용법

1. **시작하기**
   - 브라우저에서 애플리케이션 열기
   - 카메라 권한 허용
   - "시작하기" 버튼 클릭

2. **실시간 감정 인식**
   - 카메라 앞에서 다양한 표정 시도
   - 오른쪽 패널에서 실시간 감정 결과 확인
   - 하단 차트에서 감정 변화 추적

3. **스크린샷 찍기**
   - "스크린샷" 버튼 클릭 또는 'S' 키 입력
   - 현재 프레임이 자동으로 다운로드됨

4. **리포트 생성**
   - 환자 이름 및 세션 노트 입력 (선택사항)
   - "임상 리포트 생성" 버튼 클릭
   - PDF 파일이 자동으로 다운로드됨

5. **데이터 내보내기**
   - "데이터 내보내기" 버튼 클릭
   - JSON 또는 CSV 형식 선택
   - 파일이 자동으로 다운로드됨

### 고급 기능

#### 데이터 초기화

현재 세션의 모든 트래킹 데이터를 삭제하고 새로 시작:

```javascript
// UI 버튼 사용
document.getElementById('clearDataBtn').click();

// 또는 프로그래밍 방식으로
emotionTracker.clear();
```

#### 커스텀 분석

```javascript
// 현재 감정 통계 가져오기
const stats = emotionTracker.getSummaryStats();
console.log(stats);

// 특정 시점의 데이터 접근
const history = emotionTracker.emotionHistory;
console.log(history[0]); // 첫 번째 데이터 포인트
```

## 📁 프로젝트 구조

```
emotion-recognition-system/
├── index.html                 # 메인 HTML 파일
├── css/
│   └── styles.css            # 스타일시트
├── js/
│   ├── main.js               # 메인 애플리케이션 로직
│   ├── emotionRecognition.js # 얼굴 감지 및 감정 인식
│   ├── emotionTracker.js     # 감정 트래킹 및 시각화
│   └── reportGenerator.js    # 리포트 생성
├── package.json              # 프로젝트 메타데이터
├── .gitignore               # Git 제외 파일 목록
└── README.md                # 프로젝트 문서
```

## 📚 API 문서

### EmotionRecognition Class

얼굴 감지 및 감정 인식을 담당하는 클래스

#### Methods

```javascript
// 모델 로드
await emotionRecognition.loadModels()

// 비디오 스트림 시작
await emotionRecognition.startVideo()

// 감정 감지 시작
await emotionRecognition.startDetection(tracker)

// 비디오 정지
emotionRecognition.stopVideo()

// 스크린샷 찍기
const dataUrl = await emotionRecognition.takeScreenshot()
```

### EmotionTracker Class

감정 변화를 추적하고 시각화하는 클래스

#### Methods

```javascript
// 트래킹 시작
emotionTracker.start()

// 데이터 포인트 추가
emotionTracker.addDataPoint(expressions)

// 통계 요약 가져오기
const stats = emotionTracker.getSummaryStats()

// 데이터 내보내기
const data = emotionTracker.exportData()

// 데이터 초기화
emotionTracker.clear()
```

#### Properties

```javascript
emotionTracker.emotionHistory      // 전체 감정 히스토리
emotionTracker.emotionCounts       // 각 감정 카운트
emotionTracker.emotionChangeCount  // 감정 변화 횟수
```

### ReportGenerator Class

임상 리포트를 생성하는 클래스

#### Methods

```javascript
// PDF 리포트 생성
await reportGenerator.generateReport(tracker, patientName, sessionNotes)

// JSON 데이터 내보내기
reportGenerator.exportJSON(tracker)

// CSV 데이터 내보내기
reportGenerator.exportCSV(tracker)
```

## ⌨️ 키보드 단축키

| 키 | 기능 |
|----|------|
| `Space` | 감지 시작/정지 |
| `S` | 스크린샷 찍기 |
| `R` | 리포트 생성 |

## ⚡ 성능 최적화

### 권장 설정

- **입력 크기**: 416x416 (TinyFaceDetector)
- **신뢰도 임계값**: 0.5
- **최대 히스토리 길이**: 100 데이터 포인트
- **업데이트 방식**: requestAnimationFrame (약 60 FPS)

### 성능 향상 팁

1. **조명 개선**: 밝고 균일한 조명에서 사용
2. **카메라 위치**: 얼굴이 화면 중앙에 오도록 배치
3. **브라우저**: Chrome 또는 Edge 권장 (최적화된 TensorFlow.js 성능)
4. **GPU 가속**: 가능한 경우 GPU 가속 활성화

### 시스템 요구사항

| 구분 | 최소 | 권장 |
|------|------|------|
| CPU | Dual Core 2.0 GHz | Quad Core 2.5 GHz+ |
| RAM | 4 GB | 8 GB+ |
| GPU | - | WebGL 지원 GPU |
| 브라우저 | Chrome 90+ | Chrome 최신 버전 |

## 🔧 문제 해결

### 카메라가 작동하지 않음

**원인**: 브라우저 카메라 권한 거부

**해결**:
1. 브라우저 주소창 옆 카메라 아이콘 클릭
2. 카메라 권한 허용
3. 페이지 새로고침

### 모델 로딩 실패

**원인**: 인터넷 연결 문제 또는 CDN 접근 불가

**해결**:
1. 인터넷 연결 확인
2. 페이지 새로고침
3. 브라우저 캐시 삭제

### 감정 인식 정확도 낮음

**원인**: 조명 불량, 얼굴 각도 문제

**해결**:
1. 밝은 조명 환경에서 사용
2. 얼굴을 카메라 정면으로 향하게
3. 카메라와 적절한 거리 유지 (50-100cm)

### 낮은 FPS

**원인**: 시스템 리소스 부족

**해결**:
1. 다른 탭/프로그램 닫기
2. 브라우저 하드웨어 가속 활성화
3. 비디오 해상도 낮추기

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다!

### 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인

- 코드 스타일: JavaScript Standard Style
- 커밋 메시지: Conventional Commits
- 문서화: JSDoc 주석 작성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 글

- [TensorFlow.js](https://www.tensorflow.org/js) - Google의 JavaScript 딥러닝 프레임워크
- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Vladimir Mandic의 얼굴 인식 라이브러리
- [Chart.js](https://www.chartjs.org/) - 데이터 시각화 라이브러리
- [jsPDF](https://github.com/parallax/jsPDF) - PDF 생성 라이브러리

## 📞 연락처

프로젝트 관련 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해주세요.

## 🔮 향후 계획

- [ ] 다중 얼굴 동시 감지 및 분석
- [ ] 감정 히트맵 시각화
- [ ] 실시간 감정 알림 시스템
- [ ] 모바일 앱 버전
- [ ] 커스텀 모델 학습 기능
- [ ] 클라우드 데이터 동기화
- [ ] 다국어 지원 확대

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!

Made with ❤️ using TensorFlow.js
