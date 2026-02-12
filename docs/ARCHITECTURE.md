# Architecture

## 개요
Draw2Data는 단계적으로 확장 가능한 플랫폼으로 설계되었습니다. 현재 Phase 1(정적 MVP)에서 시작하여, 향후 전체 웹 플랫폼으로 발전할 수 있는 아키텍처를 제시합니다.

## 현재 상태: Phase 1 (정적 MVP)
- 순수 HTML/CSS/JS로 구현된 정적 웹 애플리케이션
- 브라우저에서 모든 계산 수행
- 외부 의존성 없음, 즉시 배포 가능

## 향후 확장 아키텍처 (Phase 2-3)

### 시스템 구성요소

```
┌─────────────────────────────────────────────────────────────┐
│                          Frontend                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Web UI  │  │  Mobile  │  │   API    │                  │
│  │ (React)  │  │   App    │  │  Client  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼─────────────┼────────────────────────┘
        │             │             │
        └─────────────┴─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │      API Gateway          │
        │    (REST / GraphQL)       │
        └─────────────┬─────────────┘
                      │
        ┌─────────────▼─────────────┐
        │    Application Layer      │
        │                           │
        │  ┌────────────────────┐   │
        │  │  Auth Service      │   │
        │  │  Project Service   │   │
        │  │  Scenario Service  │   │
        │  │  Run Service       │   │
        │  └────────────────────┘   │
        └─────┬───────────┬─────────┘
              │           │
    ┌─────────▼───┐   ┌──▼──────────────┐
    │  Database   │   │  Task Queue     │
    │  (Postgres) │   │  (Redis)        │
    └─────────────┘   └──┬──────────────┘
                         │
                   ┌─────▼─────────────┐
                   │  Worker Cluster   │
                   │                   │
                   │  ┌──────────────┐ │
                   │  │ Simulation   │ │
                   │  │ Engine       │ │
                   │  └──────────────┘ │
                   └─────┬─────────────┘
                         │
                   ┌─────▼─────────────┐
                   │  Object Storage   │
                   │  (S3 / MinIO)     │
                   └───────────────────┘
```

### 핵심 데이터 모델

#### 1. User
```
- id: UUID
- email: String
- username: String
- created_at: Timestamp
- plan: Enum (free, pro, enterprise)
```

#### 2. Project
```
- id: UUID
- user_id: UUID (FK)
- name: String
- description: Text
- created_at: Timestamp
- updated_at: Timestamp
```

#### 3. Drawing
```
- id: UUID
- project_id: UUID (FK)
- strokes_json: JSON
  - Array of strokes, each stroke is array of {x, y} points
- axis_config: JSON
  - numDays, priceMin, priceMax, scaleType, etc.
- created_at: Timestamp
```

#### 4. Scenario
```
- id: UUID
- drawing_id: UUID (FK)
- name: String
- simulation_config: JSON
  - initialCash, tradingCost, strategy parameters
- created_at: Timestamp
```

#### 5. Run
```
- id: UUID
- scenario_id: UUID (FK)
- status: Enum (queued, running, completed, failed)
- input_hash: String (for reproducibility)
- engine_version: String
- started_at: Timestamp
- completed_at: Timestamp
- result_uri: String (S3 path)
- metrics: JSON (KPIs: finalValue, CAGR, MDD, etc.)
```

### 핵심 설계 원칙

#### 1. 재현성 (Reproducibility)
- 모든 Run은 input_hash를 생성하여 동일한 입력에 대해 동일한 결과 보장
- engine_version 추적으로 계산 로직 변경 이력 관리
- 결과는 불변 객체로 S3에 저장

#### 2. 확장성 (Scalability)
- 계산 로직은 Worker로 분리하여 수평 확장 가능
- Redis 큐를 통한 비동기 처리
- 대용량 결과는 S3에 저장하고 DB에는 메타데이터만 저장

#### 3. 분리 (Separation of Concerns)
- Frontend: 사용자 인터페이스 및 Drawing 캡처
- API: 비즈니스 로직 및 인증/인가
- Worker: 계산 집약적 시뮬레이션 수행
- Storage: 데이터 영속성

#### 4. 보안 (Security)
- JWT 기반 인증
- API rate limiting
- 사용자별 리소스 격리
- 민감한 설정은 환경변수로 관리

### 기술 스택 (예상)

**Frontend:**
- React + TypeScript
- TailwindCSS or Material-UI
- Zustand or Redux (state management)
- React Query (data fetching)

**Backend API:**
- Node.js + Express or FastAPI (Python)
- PostgreSQL (primary database)
- Redis (caching, queue)
- JWT authentication

**Worker:**
- Python (NumPy, Pandas for calculations)
- Celery (task queue)
- Docker containers for isolation

**Infrastructure:**
- Docker + Kubernetes or AWS ECS
- AWS S3 or MinIO (object storage)
- AWS RDS or self-hosted PostgreSQL
- AWS ElastiCache or self-hosted Redis

### API 엔드포인트 (예상)

```
# Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

# Projects
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PUT    /api/v1/projects/:id
DELETE /api/v1/projects/:id

# Drawings
GET    /api/v1/projects/:id/drawings
POST   /api/v1/projects/:id/drawings
GET    /api/v1/drawings/:id
PUT    /api/v1/drawings/:id
DELETE /api/v1/drawings/:id

# Scenarios
GET    /api/v1/drawings/:id/scenarios
POST   /api/v1/drawings/:id/scenarios
GET    /api/v1/scenarios/:id
PUT    /api/v1/scenarios/:id
DELETE /api/v1/scenarios/:id

# Runs
POST   /api/v1/scenarios/:id/runs
GET    /api/v1/runs/:id
GET    /api/v1/runs/:id/results
DELETE /api/v1/runs/:id
```

### 확장 기능 (Phase 3)

1. **공유 링크**
   - 시나리오를 읽기 전용 링크로 공유
   - 임베드 가능한 위젯 제공

2. **템플릿 마켓**
   - 사용자가 만든 시나리오를 템플릿으로 공유
   - 인기 템플릿 갤러리
   - 댓글 및 평가 시스템

3. **협업 기능**
   - 프로젝트 멤버 초대
   - 실시간 협업 (WebSocket)

4. **고급 시뮬레이션**
   - 멀티 에셋 포트폴리오
   - 커스텀 전략 (Python 스크립트)
   - 백테스팅 엔진

## 마이그레이션 전략

Phase 1 → Phase 2:
1. Frontend를 React로 재작성하되, 기존 로직 재사용
2. Backend API 구축 및 PostgreSQL 스키마 생성
3. 정적 버전과 병행 운영하며 점진적 마이그레이션

Phase 2 → Phase 3:
1. Worker 클러스터 도입 (계산 분리)
2. 고급 기능 순차적 추가
3. 성능 최적화 및 모니터링 강화
