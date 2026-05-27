# 주식 스크리너 백엔드 (Stock Scanner Backend)

FastAPI 백엔드로, Feature Store, Hermes 기반의 AI 비서, 시장 분석 기능과 함께 CANSLIM, 미네르비니(Minervini), IPO, 거래량 돌파 및 커스텀 주식 스캔 조건을 구현합니다.

> 전체 프로젝트 개요 및 스크린샷: [루트 README](../README.md)
> 프론트엔드 문서: [프론트엔드 README](../frontend/README.md)
> 배포 가이드: [Docker 배포](../docs/INSTALL_DOCKER.md)
> 참고 문서: [아키텍처](../docs/ARCHITECTURE.md) | [환경 변수](../docs/ENVIRONMENT.md)

## 설정 (Setup)

### 1. 가상 환경 생성

```bash
python3.11 -m venv venv
source venv/bin/activate  # Windows 환경: venv\Scripts\activate
```

### 2. 패키지 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
# .env 편집 — 최소한 DATABASE_URL (PostgreSQL)과 하나 이상의 LLM API 키를 입력해야 합니다.
```

### 4. Redis 시작

```bash
redis-server
# 또는 macOS의 경우: brew services start redis
```

### 5. Twitter/X 테마 수집 설정

기본적으로 공식 X API 수집이 적용됩니다. 활성화하려면 `.env` 파일에 `TWITTER_BEARER_TOKEN`을 설정하십시오.

### 6. Celery Worker 시작

```bash
./start_celery.sh
```

> **macOS 관련 참고**: macOS에서는 Objective-C의 fork 안전성 체크로 인한 fork() 충돌을 방지하기 위해 Celery 실행 시 `--pool=solo` 옵션이 필요합니다. `start_celery.sh` 스크립트는 이를 자동으로 처리하며 필요한 `OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES` 변수도 내보냅니다(export).
>
> **Docker 관련 참고**: Docker 배포 환경은 PostgreSQL 및 Linux `prefork` worker들을 사용합니다. 로컬/macOS 실행 환경에서는 `solo` 풀 설정을 유지하고 Docker 풀 설정을 로컬 스크립트에 복사해오지 마십시오.

### 7. API 서버 시작

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API 레퍼런스 (API Reference)

서버 인증(Server Auth)이 활성화되어 있으면 대화형 API 문서가 기본적으로 비활성화됩니다. 로컬 개발 환경에서 안전하게 사용하려면 `backend/.env` 파일에 `SERVER_EXPOSE_API_DOCS=true`를 설정한 뒤 아래 경로를 사용하십시오:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 헬스 체크 엔드포인트

| 엔드포인트 | HTTP 메서드 | 설명 |
|----------|--------|-------------|
| `/livez` | GET | Liveness probe (의존성 없음) |
| `/readyz` | GET | Readiness probe (DB 및 Redis 연결 상태 확인) |
| `/health` | GET | `/readyz`로 연결되는 레거시 별칭 |

### 엔드포인트 그룹

| Swagger 태그 | 라우터 모듈 | 설명 |
|-------------|--------------|-------------|
| scans | `scans.py` | 스캔 관리, 결과 및 기록 조회 |
| stocks | `stocks.py` | 주식 시세 데이터, 재무제표, 차트 데이터 |
| features | `features.py` | Feature Store 관리 |
| breadth | `breadth.py` | 시장 심도(마켓 브레드) 지표 |
| groups | `groups.py` | IBD 업종별 순위 |
| themes | `themes.py` | 테마 탐색 및 분석 |
| technical | `technical.py` | 기술적 지표 |
| fundamentals | `fundamentals.py` | 재무 데이터 업데이트 및 통계 |
| assistant | `assistant.py` | Hermes 기반 AI 비서 세션, 스트리밍 및 상태 관리 |
| user-watchlists | `user_watchlists.py` | 관심종목(워치리스트) 관리 |
| user-themes | `user_themes.py` | 사용자 정의 테마 관리 |
| market-scan | `market_scan.py` | 대시보드 시장 스캔 목록 |
| filter-presets | `filter_presets.py` | 스캔 필터 설정 프리셋 저장 |
| universe | `universe.py` | 대상 주식 유니버스 관리 |
| cache | `cache.py` | 캐시 관리 및 모니터링 |
| tasks | `tasks.py` | 백그라운드 작업 상태 |
| config | `config.py` | 관리자 설정 (LLM, Ollama) |
| data-fetch | `data_fetch_status.py` | 데이터 수집 락 모니터링 |
| ticker-validation | `ticker_validation.py` | 티커 종목 코드 유효성 검증 |

모든 API 경로는 `/api/v1/` 아래에 위치합니다. 구체적인 경로는 `SERVER_EXPOSE_API_DOCS=true`로 설정된 경우에만 Swagger 문서에서 확인할 수 있습니다.

## 아키텍처 (Architecture)

### 개요

백엔드는 도메인 주도 설계(DDD)가 가미된 계층형 아키텍처를 따릅니다:

```
domain/       비즈니스 룰, 밸류 오브젝트(Value Object), 포트 인터페이스
use_cases/    어플리케이션 서비스 (도메인과 인프라 레이어 오케스트레이션)
infra/        SQLAlchemy 리포지토리, Celery 작업, 캐시 어댑터
api/          FastAPI 라우터 (얇은 레이어 — 유즈케이스로 호출 위임)
```

의존성 주입(DI)은 `wiring/bootstrap.py`에서 바인딩됩니다.

### 스크리너 (Scanners)

| 스크리너 | 소스 파일 | 주요 조건 |
|----------|------|----------|
| 미네르비니 템플릿 | `minervini_scanner.py` | RS > 70-80, Stage 2 상승 추세, 이동평균선 정배열, 주가가 52주 신저가 대비 30% 이상 상승 |
| 캔슬림 (CANSLIM) | `canslim_scanner.py` | 분기 EPS 성장률 > 25%, 3개년 연간 EPS 성장률 > 25%, 거래량 패턴, RS > 70 |
| IPO | `ipo_scanner.py` | 최근 상장한 종목 중 모멘텀 특성을 띄는 종목 추출 |
| 거래량 돌파 | `volume_breakthrough_scanner.py` | 비정상적 대량 거래량과 함께 가격 상승이 동반된 종목 |
| 커스텀 스크리너 | `custom_scanner.py` | 프리셋 저장이 가능한 80개 이상의 필터 조합 검색 |

모든 스크리너는 `BaseStockScreener` 추상 클래스를 상속하며 `screener_registry.py` 내의 `@register_screener` 데코레이터를 통해 등록됩니다. 조건 스캔 실행은 `scan_orchestrator.py`에 정의된 `ScanOrchestrator`가 조율합니다. `DataPreparationLayer`(`data_preparation.py`)는 한 번에 가격/재무 데이터를 긁어와 모든 활성 스크리너들에 분배해줍니다.

### 특징값 저장소 (Feature Store)

매일 연산되는 주식 특징값 스냅샷 데이터를 저장합니다. 주기적으로 실행되는 feature run이 유니버스 내 모든 주식들의 점수를 매기고 포인터 스왑을 통해 원자적으로 발행(publish)합니다. 스크리너 API 엔드포인트는 가장 최근에 발행된 run 데이터를 조회합니다.

생애주기: **RUNNING** → **COMPLETED** → 품질 검사 → **PUBLISHED** (또는 오류 시 **QUARANTINED**)

| 테이블 | 설명 |
|-------|---------|
| `feature_runs` | 실행 메타데이터 (상태, 시간, 유니버스 정보 등) |
| `feature_run_universe_symbols` | 각 실행에 포함된 종목 목록 |
| `stock_feature_daily` | 종목별 계산된 특징값 (점수, 기술적 지표, 재무 상태 등) |
| `feature_run_pointers` | 원자적 발행 메커니즘 (가장 최근 유효한 run에 대한 포인터) |

핵심 파일: `domain/feature_store/ports.py`, `domain/feature_store/models.py`, `infra/db/repositories/feature_store_repo.py`

### 백그라운드 작업 (Background Tasks)

외부 API 호출 제한(Rate Limit) 위반을 막기 위해 두 개의 Celery 큐가 정의되어 있습니다:

- **`celery`** 큐: 일반 연산 작업 수행
- **`data_fetch`** 큐: 외부 API 호출 및 콘텐츠 수집. Docker 내에서 보수적으로 직렬화되어 중복 수집 및 외부 요건 제한을 방어합니다.

| 작업 파일 | 설명 |
|-----------|-------------|
| `scan_tasks.py` | 조건 검색 실행 및 결과 데이터 영속화 |
| `cache_tasks.py` | Redis 캐시 준비 및 새로고침 |
| `breadth_tasks.py` | 시장 심도(마켓 브레드) 연산 |
| `group_rank_tasks.py` | IBD 업종 순위 업데이트 |
| `fundamentals_tasks.py` | 재무 제표 정보 수집 |
| `theme_discovery_tasks.py` | 테마 추출 및 클러스터링 |
| `universe_tasks.py` | 주식 유니버스 목록 업데이트 |

### 캐싱 (Caching)

세 개의 Redis 데이터베이스를 구분하여 사용합니다:

| DB 번호 | 용도 | 캐시 수명 (TTL) |
|----|---------|-----|
| 0 | Celery 브로커 | — |
| 1 | Celery 작업 결과 | 24시간, 자동 청소 |
| 2 | 어플리케이션 데이터 캐시 | 7일 (시세), 7일 (재무), 24시간 (SPY 벤치마크 지수) |
|

SPY 벤치마크 캐시 갱신은 캐시 만료 시 다중 요청이 쏠리는 것을 방지하기 위해 분산 락(Distributed Lock)을 적용하고 있습니다. 커넥션 풀은 `services/redis_pool.py`에서 관리됩니다.

### LLM 연동

투자 비서(Assistant)의 런타임은 `services/assistant_gateway_service.py`를 통해 Hermes 프록시(`HERMES_API_BASE`, 선택적으로 `HERMES_API_KEY`)를 타게 설계되어 있습니다.

그 외의 워크플로우에 대한 권장 제공사 경로는 다음과 같습니다: 리서치 작업에는 Groq, 주된 테마 추출에는 Minimax, 추출 실패 시 백업으로 Z.AI를 사용하고 웹 검색에는 Tavily나 Serper를 활용합니다. 코드 내에 타 연동 흔적이 남아있을 수 있으나 실제 배포 사양에는 포함되지 않습니다.

## 데이터베이스 (Database)

로컬 개발 환경과 Docker 배포 환경 모두 PostgreSQL을 정식 데이터베이스로 사용합니다. 마운트되는 공유 폴더 `./data` 아래에는 비 데이터베이스성 상태 정보(캐시 백업, Celery beat 스케줄 파일 등)가 위치합니다.

### 테이블 카테고리별 분류

**핵심 정보:**
`stock_prices`, `stock_fundamentals`, `stock_universe`, `stock_technicals`, `stock_industry`, `institutional_ownership_history`

**특징값 저장소:**
`feature_runs`, `feature_run_universe_symbols`, `stock_feature_daily`, `feature_run_pointers`

**조건 스캔:**
`scans`, `scan_results`

**시장 분석:**
`market_breadth`, `market_status`, `industries`, `industry_performance`, `sector_rotation`, `ibd_industry_groups`, `ibd_group_ranks`, `ibd_group_peer_cache`

**테마 관리:**
`theme_clusters`, `theme_constituents`, `theme_metrics`, `theme_alerts`, `theme_pipeline_runs`, `theme_mentions`, `theme_embeddings`, `theme_merge_suggestions`, `theme_merge_history`, `content_sources`, `content_items`

**사용자 데이터:**
`user_watchlists`, `watchlist_items`, `user_themes`, `user_theme_subgroups`, `user_theme_stocks`, `scan_watchlist`, `chatbot_conversations`, `chatbot_messages`, `filter_presets`

**시스템 설정:**
`app_settings`, `task_execution_history`, `ticker_validation_log`

테이블 스키마 변경 사항은 `alembic/` 디렉토리 아래 버전 관리 파일로 저장되어 Alembic을 통해 배포됩니다. 구버전 복구용 레거시 스크립트는 `app/db_migrations/` 아래 남아있을 수 있으나 직접 수동 작업 시에만 참조됩니다.

## 디렉토리 구조

```
app/
├── main.py                  # FastAPI 어플리케이션 시작점
├── celery_app.py            # Celery 작업 관리 환경 설정
├── database.py              # SQLAlchemy 엔진 및 세션 환경 설정
├── config/                  # 서버 상세 설정
├── api/v1/                  # FastAPI 라우팅 처리 모듈 (21개 모듈)
├── models/                  # SQLAlchemy ORM 모델 정의
├── schemas/                 # Pydantic 요청/응답 검증 스키마
├── scanners/                # 주식 스크리너 로직 구현체
│   ├── base_screener.py     #   추상 기본 클래스
│   ├── screener_registry.py #   @register_screener 데코레이터 정의
│   ├── scan_orchestrator.py #   다중 스크리너 조율 처리기
│   ├── data_preparation.py  #   공유 시세/재무 수집용 데이터 레이어
│   └── ...                  #   5개 스크리너 개별 구현 파일
├── services/                # 비즈니스 로직 (70개 이상의 서비스 파일)
│   ├── assistant_gateway_service.py # Hermes 프록시 및 대화 조율
│   ├── llm/                 #   LLM 연동 어댑터
│   └── ...                  #   데이터 수집, 캐싱, 데이터 연산 분석
├── tasks/                   # Celery 백그라운드 작업 태스크
├── domain/                  # 비즈니스 정책 및 포트 인터페이스 정의
│   ├── feature_store/       #   Feature Store 도메인 모델
│   ├── scanning/            #   Scan 도메인 모델
│   └── common/              #   공통 밸류 오브젝트(Value Object)
├── use_cases/               # 어플리케이션 유즈케이스 서비스
│   ├── feature_store/       #   Feature Store 연동 조율
│   └── scanning/            #   Scan 연동 조율
├── infra/                   # 인프라 구현체
│   ├── db/                  #   SQLAlchemy 리포지토리 구체화
│   ├── cache/               #   Redis 캐시 어댑터 구체화
│   ├── tasks/               #   Celery 작업 실행 기반 인프라
│   └── providers/           #   외부 API 연동 어댑터 구체화
├── wiring/                  # 의존성 주입(DI) 설정
│   └── bootstrap.py         #   DI 컨테이너 조립 설정
├── db_migrations/           # 멱등한 수동 마이그레이션 스크립트
└── utils/                   # 호출 빈도 제어(Rate Limiter) 및 보조 함수
```

## 테스트 실행

```bash
pytest                                         # 모든 테스트 실행
pytest tests/unit/                             # 단일 유닛 테스트만 실행
pytest tests/integration/ -m integration       # 통합 테스트 실행 (서버 작동 필요)
pytest tests/unit/test_minervini_scanner.py -v # 특정 테스트 파일 지정 실행
```

> **주의 사항**: 일부 단위 테스트는 외부 API(yfinance 등) 실시간 호출을 발생시키므로 속도가 느려질 수 있습니다. 빠른 코드 검증 시에는 로컬 단위 테스트 위주로 실행하십시오.

## 관리자 유틸리티 스크립트

`backend/scripts/` 디렉토리에 시스템 디버깅용 도구들이 제공됩니다:

| 스크립트 파일 | 설명 |
|--------|-------------|
| `inspect_redis.py` | Redis 캐시의 전체 키 목록 검사 |
| `cache_diagnostic.py` | DB와 Redis 캐시간의 데이터 흐름 추적 및 모니터링 |
| `check_cache_status.py` | 가격 데이터 캐시 갱신 현황 진단 |
| `clear_redis_price_cache.py` | 설정이 바뀌었을 때 기존 Redis 시세 캐시 강제 삭제 |
| `force_full_cache_refresh.py` | 강제 풀 캐시 리프레시 실행 |
| `cleanup_orphaned_scans.py` | 비정상 중단되었거나 만료된 스캔 데이터 정리 |

수동 스캔 데이터 정리 실행 방법:

```bash
python scripts/cleanup_orphaned_scans.py
```

주기적 스크립트는 Celery 태스크 `app.tasks.cache_tasks.cleanup_orphaned_scans`로 등록되어 일정 시간마다 자동으로 돕니다.

## 데이터 소스 제한 속도 (Rate Limits)

| 제공처 | 호출 한계 속도 | 비고 |
|--------|-------|-------|
| yfinance | 초당 1회 | 자체 제한 |
| Finviz | 요건 제어 적용 | 래퍼(wrapper)를 통해 조율 |
| Alpha Vantage | 하루 25회 | 무료 키 기준 |
| SEC EDGAR | 초당 10회 | 요청 간 150ms 대기 |
