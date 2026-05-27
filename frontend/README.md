# 주식 스크리너 프론트엔드 (Stock Scanner Frontend)

주식 조건 검색(스크리닝), 시장 분석, 어시스턴트(투자 비서) 워크플로우 및 관심종목 관리를 위한 React 18 싱글 페이지 어플리케이션(SPA)입니다.

> 전체 프로젝트 개요 및 스크린샷: [루트 README](../README.md)
> 백엔드 기술 문서: [백엔드 README](../backend/README.md)
> 개발 환경 설정 가이드: [개발 문서](../docs/DEVELOPMENT.md)

## 설정 (Setup)

```bash
npm install        # 의존성 패키지 설치
npm run dev        # 로컬 개발 서버 시작 (http://localhost:5173)
npm run build      # 운영 환경용 빌드 파일 생성
npm run lint       # ESLint 정적 분석 실행
```

포트 8000에서 구동되는 백엔드 API가 필요합니다. 설정은 [백엔드 README](../backend/README.md)를 참고하세요.

## 기술 스택 (Tech Stack)

| 라이브러리 | 사용 목적 |
|---------|---------|
| React 18 | UI 컴포넌트 프레임워크 |
| Vite | 프론트엔드 빌드 툴 및 개발 서버 |
| Material-UI (MUI) | 기본 컴포넌트 라이브러리 디자인 시스템 |
| TanStack Query | 서버 상태 관리 및 API 데이터 페칭 캐싱 |
| TanStack Table | 정렬, 필터, 열 숨김 등을 지원하는 테이블 컴포넌트 |
| TanStack Virtual | 대량 데이터의 빠른 로딩을 위한 행 가상화 (Virtualization) |
| lightweight-charts | TradingView 스타일의 고성능 주식 봉 차트 |
| Recharts | 영역 차트, 스파크라인, 시장 심도 시각화 |
| @hello-pangea/dnd | 관심종목 폴더 드래그 앤 드롭 정리 |
| react-markdown | AI 비서 대화방 내 마크다운 렌더링 |
| axios | API 통신용 HTTP 클라이언트 |
| react-router-dom | 클라이언트 사이드 라우팅 및 페이지 전환 |
| date-fns | 날짜 포맷 연산 보조 |

## 화면 (Pages)

| 경로 | 컴포넌트 | 로딩 방식 | 설명 |
|-------|-----------|---------|-------------|
| `/` | `MarketScanPage` | 즉시 로딩 | 주요 지수 요약, AI 발굴 테마, 관심종목, Stockbee 요약 대시보드 |
| `/scan` | `ScanPage` | 즉시 로딩 | 80개 이상의 조건식 필터 및 CSV 출력이 제공되는 다중 시장 스크리너 |
| `/breadth` | `BreadthPage` | 지연 로딩 | StockBee 스타일 시장 건전성 지표 분석 |
| `/groups` | `GroupRankingsPage` | 지연 로딩 | IBD 스타일 197개 산업군 순위 변동 조회 |
| `/themes` | `ThemesPage` | 지연 로딩 | 실시간 테마 발굴 현황 추적 |
| `/chatbot` | `ChatbotPage` | 지연 로딩 | Tavily 실시간 검색 기능이 내장된 Hermes AI 챗봇 대화 화면 |
| `/stock/:symbol` | `StockDetails` | 즉시 로딩 | 종목별 시세 차트, 재무 정보, 미네르비니/캔슬림 필터 평가 상세 |

## 디렉토리 구조 (Project Structure)

```
src/
├── main.jsx                     # 어플리케이션 시작 파일
├── App.jsx                      # 라우터, 공통 테마, 글로벌 프로바이더 관리
├── index.css                    # 글로벌 스타일 설정
├── api/                         # 백엔드 연동용 API 클라이언트 모듈 모음
│   ├── client.js                #   Axios 클라이언트 인스턴스 (baseURL 설정)
│   ├── scans.js                 #   조건 검색 연동
│   ├── stocks.js                #   주식 개별 정보 조회
│   ├── breadth.js               #   시장 심도 데이터 조회
│   ├── groups.js                #   업종/산업군 정보 조회
│   ├── themes.js                #   테마 분석 데이터 연동
│   ├── assistant.js             #   AI 비서 채팅 세션 관리
│   ├── userWatchlists.js        #   관심종목(워치리스트) 관리
│   ├── userThemes.js            #   사용자 커스텀 테마 관리
│   ├── marketScan.js            #   대시보드 노출 지수 관리
│   ├── filterPresets.js         #   스캔 필터 설정 프리셋 조회
│   ├── priceHistory.js          #   시세/차트 데이터 연동
│   ├── tasks.js                 #   백그라운드 스캔 작업 진행 현황 조회
│   └── cache.js                 #   시스템 캐시 설정 관리
├── pages/                       # 최상위 라우팅 페이지 컴포넌트 모음
│   ├── ScanPage.jsx             #   대량 주식 스크리너 화면
│   ├── MarketScanPage.jsx       #   시장 요약 대시보드 (홈)
│   ├── BreadthPage.jsx          #   시장 심도 대시보드
│   ├── GroupRankingsPage.jsx    #   업종별 순위 변동 화면
│   ├── ThemesPage.jsx           #   테마 발견 화면
│   └── ChatbotPage.jsx          #   AI 비서 대화 전체 화면
├── components/                  # 재사용 및 기능별 컴포넌트 모음
│   ├── Layout/                  #   앱 헤더, 네비게이션, 전체 레이아웃
│   ├── Scan/                    #   스크리너 세부 요소 (필터 패널, 결과 표)
│   ├── MarketScan/              #   지수 카드, 관심종목 표 컴포넌트
│   ├── Stock/                   #   개별 종목 상세 대시보드 컴포넌트
│   ├── Charts/                  #   차트 모달 팝업 및 lightweight-chart 캔들 차트
│   ├── AssistantChat/           #   AI 챗봇 채팅창 및 메시지 렌더러
│   ├── Themes/                  #   테마 순위 및 신흥 테마 모니터링 카드
│   ├── Technical/               #   기술적 지표 분석 정보 표출 컴포넌트
│   ├── Settings/                #   앱 전체 설정 창
│   ├── common/                  #   공통 UI 기본 요소들
│   └── PipelineProgressCard.jsx #   백그라운드 연산 진행률 알리미
├── contexts/                    # 리액트 글로벌 Context 모음
│   └── PipelineContext.jsx      #   연산 파이프라인 진척도 상태 공유
├── hooks/                       # 커스텀 훅 모음
│   ├── useChartNavigation.js    #   차트 뷰어 키보드 단축키 핸들러
│   ├── useFilterPresets.js      #   필터 설정 프리셋 관리
│   └── ...                      #   기타 화면별 기능 제어용 훅
├── config/                      # 정적 설정 및 모드 관리
│   └── runtimeMode.js           #   정적 데모 배포 모드 플래그
└── utils/                       # 유틸리티 함수 모음
    ├── colorUtils.js            #   지표 값에 따른 일관된 색상 변환
    ├── filterUtils.js           #   필터 쿼리 연산 처리 도우미
    └── formatUtils.js           #   숫자 및 날짜 포맷 포매터
```

## API 호출 규약 (API Client Convention)

`api/client.js` 파일에 정의된 axios 클라이언트는 자동으로 API 요청 주소 앞에 `/api` 경로를 덧붙입니다:
- **로컬 개발 모드**: `baseURL = 'http://localhost:8000/api'`
- **Docker 배포 모드**: `baseURL = '/api'` (`VITE_API_URL` 빌드 환경 변수로 지정)

따라서 신규 API 모듈을 추가하거나 변경할 때, 경로 이름 앞부분에 절대 중복해서 `/api`를 쓰지 마시고 `/v1/...` 형태로만 입력하십시오:

```javascript
// ✅ 올바른 방식 — 경로 앞에 /api를 붙이지 않습니다.
const response = await apiClient.get('/v1/themes/rankings');

// ❌ 잘못된 방식 — Docker에서 경로가 /api/api/v1/... 으로 두 번 중첩되어 404 오류를 냅니다.
const response = await apiClient.get('/api/v1/themes/rankings');
```

API 모듈에 정의하는 공통 `BASE_PATH` 상수도 동일한 원칙을 따릅니다:

```javascript
const BASE_PATH = '/v1/user-themes';     // ✅ 올바른 방식
const BASE_PATH = '/api/v1/user-themes'; // ❌ 잘못된 방식
```

## 어플리케이션 주요 패턴

### 데이터 연동 (Data Fetching)

TanStack Query를 사용하며, API 쿼리의 기본 만료 기한(staleTime)은 5분, 가비지 컬렉터 유지 기한(gcTime)은 30분입니다. 로딩이 반복되어 깜빡이는 문제를 막기 위해 데이터를 새로 불러오는 도중에도 이전 데이터 상태를 임시 유지(`placeholderData`)하도록 전역 처리하였습니다. (`App.jsx`에서 클라이언트 통합 정의)

### 공통 테마 디자인 시스템

다크 모드를 기본(Default)으로 제공합니다. 테이블 높이는 24px, 글꼴 크기는 11~14px 범위의 조밀하고 컴팩트한 디자인이 적용되어 전문 트레이딩 도구에 걸맞는 밀도를 보여줍니다. 라이트 모드로의 토글도 제공되며 테마 색상 정의 토큰은 `App.jsx` 내 `getDesignTokens()` 함수에서 일괄 조율됩니다.

### 코드 스플리팅 (Code Splitting)

가장 빈번하게 접속하는 `MarketScanPage`(홈), `ScanPage`(스크리너), `StockDetails`(종목 상세)는 처음 로딩 시 즉시 주입(Eager Loading)됩니다. 그 외 보조 성격의 화면인 `BreadthPage`, `GroupRankingsPage`, `ThemesPage`, `ChatbotPage`는 지연 로딩(`React.lazy()`) 기법을 통해 첫 방문 시에만 동적 import되며, 로딩 대기 상태 동안 공통 스피너 배너를 출력합니다.

### 상태 관리 (State Management)

복잡한 글로벌 상태 저장소(Redux, Recoil 등)를 사용하지 않습니다. 모든 서버 동기화 상태는 TanStack Query 캐시가 담당하며 단순한 화면별 상호작용은 리액트의 기본 `useState` 훅을 사용합니다. 아래 두 가지 전역 컨텍스트만 활용됩니다:
- `PipelineContext` — 백그라운드 데이터 수집 진척률 정보용
- `ColorModeContext` — 밝은/어두운 테마 스위칭용
