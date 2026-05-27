# 주식 스크리너 🇺🇸 🇨🇳 🇭🇰 🇯🇵 🇰🇷 🇹🇼 🇮🇳 🇩🇪 🇨🇦 🇸🇬

**미국, 홍콩, 인도, 일본, 한국, 대만, 중국 A주, 독일, 캐나다, 싱가포르** 주식 시장에 걸친 멀티 방법론 종목 발굴(스캔), AI 보조 리서치, 소셜 및 뉴스 피드를 통한 테마 탐색, 실시간 시장 심도(마켓 브레드) 분석을 제공하는 종합 주식 스크리닝 플랫폼입니다. Docker, PostgreSQL, Redis, nginx를 기반으로 하는 단일 테넌트 서버 스택 배포를 지원합니다.

### 조건 검색(스캔) 워크플로우 데모

![Stock Scanner Demo](docs/gifs/scan-workflow.gif)

---

### 정적 데모 사이트 둘러보기

![Static site page tour — Daily, Scan, Breadth, Groups](docs/gifs/static-site-tour.gif)

정적 데모 페이지: [https://xang1234.github.io/stock-screener/](https://xang1234.github.io/stock-screener/)

*정적 페이지는 데모 전용입니다. 챗봇, 테마 파이프라인, 관심종목(워치리스트) 관리 및 인터랙티브 백엔드가 포함된 정식 버전에 비해 기능이 제한된 일일 스냅샷(읽기 전용) 형태로 제공됩니다.*

## 주요 기능 (Highlights)

### 다중 시장 지원 (Multi-Market Coverage)

다음 10개 시장을 스캔하고 모니터링할 수 있습니다:

- 🇺🇸 **미국** — NYSE, NASDAQ, AMEX, S&P 500
- 🇭🇰 **홍콩** — HSI (항셍 지수)
- 🇮🇳 **인도** — NSE, BSE
- 🇯🇵 **일본** — Nikkei 225
- 🇰🇷 **한국** — KOSPI, KOSDAQ
- 🇹🇼 **대만** — TAIEX
- 🇨🇳 **중국 본토 A주** — SSE, SZSE, BJSE
- 🇩🇪 **독일** — XETRA, DAX
- 🇨🇦 **캐나다** — TSX, TSXV
- 🇸🇬 **싱가포르** — SGX

각 시장은 자체 거래소 캘린더(XNYS / XHKG / XNSE / XTKS / XKRX / XTAI / XSHG / XETR / XTSE / XSES)와 독립적인 Celery 큐 및 락을 기반으로 동작하여, 미국, 아시아, 유럽 시장의 데이터 업데이트가 서로 간섭 없이 병렬로 수행됩니다. 조건 검색 창에서 시장을 자유롭게 전환할 수 있으며, 여러 시장이 섞인 결과 테이블에서는 종목 코드 옆에 국가별 색상 배지가 표시됩니다.

![Market selector](docs/screenshots/market-selector.jpg)
*조건 검색 바의 시장 선택기 — 미국, 홍콩, 인도, 일본, 한국, 대만, 중국, 독일, 캐나다, 싱가포르 중 선택 및 거래소/지수별 필터링*

![Market badges](docs/screenshots/market-badges.png)
*종목코드 열의 국가별 배지 — 미국(파랑), 홍콩(초록), 일본(노랑). 한국, 대만, 인도, 중국, 독일, 캐나다 등도 고유 색상 배지가 적용됩니다.*

자세히 보기: **[아시아 v2 ADR 및 운영 가이드 (영문)](docs/asia/README.md)**

### 멀티 전략 조건 검색 (Multi-Strategy Screening)

미네르비니(Minervini), 캔슬림(CANSLIM), IPO, 거래량 돌파, 셋업 엔진(Setup Engine), 커스텀 조건 스캔을 동시에 수행하고 80개 이상의 조건 필터를 종합한 복합 점수(Composite Score)를 매깁니다. 필터 설정을 프리셋으로 저장하고 스캔 결과를 CSV 파일로 내보낼 수 있습니다.

![Scan Results](docs/screenshots/scan-results.png)
*복합 점수, 상대강도(RS) 스파크라인, 멀티 스크리너 평가, GICS 섹터, IBD 산업군, 시장 테마, 산업군 내 순위가 포함된 스캔 결과 화면*

### 시장 심도 (Market Breadth) 대시보드

SPY 지수 차트가 오버레이된 StockBee 스타일의 등락 종목 수(Advance/Decline) 분석, 일일 주가 급등락 종목(4% 이상 변동), 분기/월/34일 거래일 기준의 다기간 트렌드 시각화를 지원합니다.

![Market Breadth](docs/screenshots/breadth-chart.png)
*SPY 지수 차트가 결합된 마켓 브레드(시장 심도) 차트와 주가 급등락 종목 현황*

### IBD 업종/산업군 순위 (IBD Industry Group Rankings)

상대강도(RS)를 기준으로 197개 산업군의 순위를 매기고 상승/하락 주도 업종(1주/1달/3달/6달) 정보, 업종 순위 역사 차트, 해당 업종 내 구성 종목 분석을 제공합니다.

![Group Rankings](docs/screenshots/group-rankings.png)
*산업군 순위 리스트 및 변동 정보 패널*

### 스파크라인 지원 관심종목 (Watchlists with Sparklines)

최근 30일간의 RS 및 주가 변동 스파크라인, 7개 기간별 주가 변동률 바, 드래그 앤 드롭 폴더 정리, 전체 화면 차트 탐색 기능 등을 통해 포트폴리오를 시각적으로 추적합니다.

![Watchlist Table](docs/screenshots/watchlist-table.png)
*스파크라인과 기간별 주가 변동률이 시각화된 관심종목 관리 화면*

### AI 리서치 챗봇 (AI Research Chatbot)

Groq 기반의 연구용 채팅 비서로, Tavily/Serper 웹 검색을 결합하여 실시간 정보 탐색이 가능하며 대화 기록 보존 및 도구 확장 기능을 제공합니다.

![Chatbot](docs/screenshots/chatbot.png)
*대화 기록 사이드바 및 연구용 웹 검색 도구가 결합된 AI 챗봇 화면*

### 테마 탐색 파이프라인 (Theme Discovery Pipeline)

RSS, Twitter/X, 뉴스 피드로부터 AI를 활용해 시장 테마를 추출하고 분류합니다. 트렌딩 테마 및 신흥(Emerging) 테마를 감시하고 테마별 구성 종목 모니터링과 모멘텀 전환 감지를 지원합니다.

![Themes](docs/screenshots/themes.png)
*테마 순위 및 신흥 테마 모니터링 패널*

## 시작하기

### Docker 설치 (서버 배포 시 권장)

```bash
cp .env.docker.example .env.docker
# .env.docker 파일 편집:
#   BACKEND_IMAGE=ghcr.io/<owner>/stockscreenclaude-backend
#   FRONTEND_IMAGE=ghcr.io/<owner>/stockscreenclaude-frontend
#   APP_IMAGE_TAG=v1.1.2
#   SERVER_AUTH_PASSWORD=비밀번호설정
#   GROQ_API_KEY=...
docker-compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.release.yml pull
ENABLED_MARKETS=US,HK,CN scripts/docker-compose-enabled-markets.sh -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.release.yml up -d --no-build
# 브라우저에서 http://localhost 접속
```

이 방식은 로컬에서 빌드하는 대신 배포된 `v1.1.2` 이미지(GHCR)를 다운로드하여 실행합니다. 스택이 시작되면 최초 실행용 초기화 화면(Bootstrap)이 나타나며, 시장 설정 및 기초 데이터 수집 단계를 거치게 됩니다. 자세한 내용은 [최초 실행 초기화 단계](#최초-실행-초기화-단계)를 참고하세요.

로컬 개발 환경이나 테스트 용도로 구축하는 경우 아래 로컬 컴포즈 명령을 사용하십시오:

```bash
cp .env.docker.example .env
# .env 파일 편집: SERVER_AUTH_PASSWORD 설정 및 최소 하나의 LLM API 키(예: GROQ_API_KEY) 입력
scripts/docker-compose-enabled-markets.sh up
```

상세 가이드 (홈랩, VPS, GHCR 배포): **[Docker 배포 가이드 (영문)](docs/INSTALL_DOCKER.md)**

### 활성화할 시장(Market)의 Worker만 실행하기

기본 컴포즈 파일에는 모든 지원 국가의 worker 서비스가 정의되어 있지만, 국가별 worker는 Compose 프로필 단위로 관리됩니다. `ENABLED_MARKETS`에 나열된 국가의 worker만 가볍게 실행하려면 도우미 스크립트를 사용합니다:

```bash
ENABLED_MARKETS=US,HK,CN,KR scripts/docker-compose-enabled-markets.sh up -d
```

`ENABLED_MARKETS=US,HK,CN,KR`로 실행하면 미국/홍콩/중국/한국 시장 및 사용자 스캔 worker만 실행되고, 인도/일본/대만 등 다른 국가용 컨테이너는 생성되지 않습니다. 공유 데이터 수집 worker도 `data_fetch_shared,data_fetch_us,data_fetch_hk,data_fetch_cn,data_fetch_kr` 채널만 감시하게 됩니다.

최초 실행 초기화 마법사(Bootstrap)에서 활성화할 시장 목록은 Docker로 배포할 때 설정한 `ENABLED_MARKETS` 범위 내로 맞추는 것이 좋습니다. 나중에 국가를 추가하려면 `ENABLED_MARKETS` 환경 변수를 수정하고 재시작하면 됩니다:

```bash
ENABLED_MARKETS=US,HK,CN,KR,TW scripts/docker-compose-enabled-markets.sh up -d
```

### 소스코드에서 직접 실행 (개발 참여자용)

개발 환경 설정, Celery 설정 및 백엔드/프론트엔드 연동에 대한 전체 안내는 **[개발자 가이드 (영문)](docs/DEVELOPMENT.md)**를 참고하십시오.

## 최초 실행 초기화 단계 (First-Run Bootstrap)

앱을 처음 켜면 데이터베이스 초기 설정 스크린으로 진입합니다. 데이터베이스 백업 파일이나 시드 데이터가 없어도 무방합니다. 기본으로 보여줄 **주 시장(Primary Market)**과 백그라운드에서 데이터를 수집할 **활성화할 시장(Enabled Markets)**을 선택한 뒤 **Start bootstrap** 버튼을 누릅니다.

> **데이터 초기화 성능 노트:** 한 번에 너무 많은 국가를 선택하면 종목 유니버스, 가격, 재무제표, 시장 심도, 업종 순위 등의 연산이 동시에 구동되어 소형 서버나 PC에서 처리가 많이 지연될 수 있습니다. 쾌적한 첫 실행을 위해 먼저 주 시장(Primary Market) 하나만 선택하여 데이터 수집을 완료한 뒤 순차적으로 추가하는 것을 권장합니다.

<img src="docs/screenshots/bootstrap-setup.jpg" alt="Bootstrap setup" width="500" />
*최초 기동 시 노출되는 주 시장 설정 및 활성 시장 체크박스*

오케스트레이터는 지정한 주 시장에 대해 다음과 같은 Celery 파이프라인 단계를 실행합니다:

1. **유니버스 동기화 (Universe refresh)** — 주식 목록 데이터 구성 (미국은 S&P 500/Russell/NDX, 아시아 국가는 각 거래소 공식 피드 동기화).
2. **벤치마크 및 시세 업데이트 (Price refresh)** — 5년치 시세를 Redis 캐시 및 PostgreSQL에 수집.
3. **재무 분석 데이터 업데이트 (Fundamentals refresh)** — 분기 및 연간 재무제표 수집.
4. **시장 심도 연산 (Breadth calculation)** — 등락 종목 수 계산 및 갭 보정.
5. **업종 순위 매기기 (Group rankings)** — 197개 IBD 스타일 산업군의 상대강도 순위 연산.
6. **특징값 스냅샷 (Feature snapshot)** — 셋업 엔진에 활용될 일일 분석 스냅샷 생성 (미국 한정).
7. **초기 스캔 실행 (Initial autoscan)** — 기본 스크리너 프로필로 첫 종목 스캔 결과를 자동 생성하여 대시보드에 즉시 채워지게 합니다.

<img src="docs/screenshots/bootstrap-progress.jpg" alt="Bootstrap progress" width="500" />
*파이프라인이 진행되는 동안 표시되는 단계별 진행률 및 국가별 큐 상태*

주 시장(Primary Market)이 `ready` 상태가 되면 바로 대시보드 화면으로 진입할 수 있습니다. 나머지 부 시장들은 전용 큐(`data_fetch_{us,hk,kr...}`)를 통해 백그라운드에서 계속 수집을 이어나갑니다. 데이터가 수집 중인 시장에 대해 스크리너 검색을 요청하면 HTTP 409 `market_refresh_active` 오류를 반환하며, 화면에는 실패 대신 로딩 안내가 표시됩니다.

설정 상태는 `AppSetting` 데이터베이스 내 `runtime.primary_market`, `runtime.enabled_markets`, `runtime.bootstrap_state`(`not_started` → `running` → `ready`)로 관리됩니다. 초기 설정 마법사를 다시 띄우고 싶다면 `runtime.bootstrap_state` 값을 `not_started`로 변경하면 됩니다.

## 설정 (Configuration)

AI 챗봇 기능에는 최소 하나 이상의 LLM API 키가 필요합니다. 조건 검색(스크리너) 및 다른 모든 기능들은 API 키 없이도 완벽하게 동작합니다.

| 제공사 | 환경 변수 | 무료 티어 지원 | 비고 |
2: |----------|---------|-----------|-------|
3: | Groq | `GROQ_API_KEY` | 지원함 | 챗봇 및 리서치 기본값 |
4: | Gemini | `GEMINI_API_KEY` | 지원함 | 테마 분석 보조/폴백 |
5: | Minimax | `MINIMAX_API_KEY` | 없음 | 테마 분석/머지 메인 제공사 |
6: | Z.AI | `ZAI_API_KEY` | 없음 | 선택적 대체 제공사 |

추가로 웹 검색 도구인 `TAVILY_API_KEY`나 `SERPER_API_KEY`를 설정하면 AI 챗봇이 최신 시장 뉴스를 검색할 수 있는 연구 모드가 활성화됩니다.

상세 참고: **[환경 변수 설정 가이드 (영문)](docs/ENVIRONMENT.md)**

## 어플리케이션 페이지 구성

| 경로 | 페이지 | 설명 |
|-------|------|-------------|
| `/` | 일일 요약 (Routine) | 주요 시장 지수, 테마 탐색, 워치리스트, Stockbee 지표 등이 포함된 시장 대시보드 |
| `/scan` | 대량 스크리너 | 10개 시장 통합 검색, 80개 이상의 미세 필터 제공, 스캔 결과 CSV 다운로드 |
| `/breadth` | 시장 심도 | StockBee 스타일의 마켓 브레드 흐름 및 장기 추세 차트 |
| `/groups` | 업종별 순위 | 197개 IBD 업종별 순위 변동 추적 및 관련 강세 주도 종목 검색 |
| `/themes` | 시장 테마 | 뉴스와 SNS 피드 분석을 통한 AI 기반 시장 테마 분석 및 생애주기 추적 |
| `/chatbot` | 투자 비서 챗봇 | 다중 LLM 제공사 지원 및 실시간 웹 검색 기능이 내장된 인공지능 주식 비서 |
| `/stock/:symbol` | 종목 상세 | 개별 주식 차트, 투자 지표, 미네르비니/캔슬림 조건 충족 현황 정보 조회 |

## 주요 기능 요약

- **10개 시장 완벽 지원** — 국가별 거래소 달력 적용, 독립 큐 제어 및 가격 데이터 신선도 자동 감지
- **최초 실행용 마법사** — 친절한 단계별 진행률 안내 및 부차 국가 백그라운드 지연 수집 지원
- **6개 조건 검색 방법론** — 미네르비니, 캔슬림, IPO, 거래량 돌파, 셋업 엔진, 커스텀 조건 제공
- **80개 이상의 세부 필터** — 재무, 기술적 지표, 등급 점수 조건에 따른 프리셋 저장 기능
- **AI 리서치 챗봇** — Groq 우선 라우팅, 실시간 검색 결합, 대화방 목록 영구 저장
- **테마 발굴 파이프라인** — AI 클러스터링 기반 뉴스 피드/트위터의 테마화 및 관련 종목 자동 바인딩
- **시장 심도 대시보드** — Stockbee 스타일 지표 시각화 및 추세 분석
- **197개 IBD 산업군 순위** — 모멘텀 상하위 순위, 업종 내 종목들의 등락률 현황
- **관심종목(워치리스트)** — 스파크라인 트렌드, 기간별 등락 차트 제공, 폴더 정리 및 차트 연속 보기 지원
- **MCP 통합** — AI 코파일럿 도구 연동 기능 (12개 CLI/HTTP 도구 지원, [자세히 보기](docs/MCP_INTEGRATION.md))
- **TradingView 스타일 차트** — 봉 차트(양음봉) 및 이동평균선(MA) 오버레이 제공
- **CSV 내보내기** — 조건 검색 결과 다운로드 지원
- **다크/라이트 모드** 기본 지원
- **Docker 배포 패키지** — PostgreSQL, 자동 Let's Encrypt HTTPS 발급, GHCR 이미지 릴리즈

## 기술 스택

**백엔드:** FastAPI, SQLAlchemy, Alembic, Celery, Redis, PostgreSQL
**프론트엔드:** React 18, Vite, Material-UI, TanStack Query / Table, Recharts
**데이터 소스:** yfinance, Finviz, Alpha Vantage, SEC EDGAR, X API (선택사항)

## 면책 조항 (Disclaimer)

본 소프트웨어는 교육 및 리서치 전용 목적으로 제작되었습니다. 제공되는 데이터와 정보는 투자 권유나 금융 조언이 아닙니다. 실제 투자 결정을 내리기 전에는 항상 본인이 직접 조사를 수행하고 공인 금융 전문가와 상담하시기 바랍니다.

## 라이선스

이 프로젝트는 [Apache License 2.0](LICENSE) 라이선스 하에 배포됩니다.
