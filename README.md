# 📈 Draw2Data

> 그림으로 주식 시나리오를 그리고 시뮬레이션하는 직관적인 웹 앱

Draw2Data는 마우스로 캔버스에 가격 궤적을 그려 주식 투자 시나리오를 시뮬레이션할 수 있는 도구입니다. 복잡한 코딩 없이 시각적으로 가격 패턴을 그리고, Buy & Hold 전략의 성과를 즉시 확인할 수 있습니다.

## ✨ 주요 기능

- **🎨 직관적인 그리기 인터페이스**: 마우스로 가격 궤적을 자유롭게 그리기
- **📊 자동 데이터 생성**: 그림을 일봉/주봉/월봉 종가 데이터로 변환
- **💰 시뮬레이션**: Buy & Hold 전략 성과 자동 계산
- **📈 KPI 계산**: Final Value, Cumulative Return, CAGR, MDD
- **📥 CSV 다운로드**: 생성된 데이터를 CSV 파일로 저장
- **⚙️ 유연한 설정**: 일봉 수, 가격 범위, 스케일(선형/로그), 스무딩 등
- **📱 반응형 디자인**: 데스크톱과 모바일에서 모두 사용 가능

## 🚀 로컬 실행

### Phase 2 (현재)

#### 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

#### 실행 방법

```bash
# 의존성 설치
npm install

# 개발 모드로 실행 (프론트엔드 + 백엔드)
npm run dev

# 또는 개별 실행
npm run dev:frontend  # 프론트엔드만
npm run dev:backend   # 백엔드만
```

- 프론트엔드: `http://localhost:5173`
- 백엔드 API: `http://localhost:3000/api`

### Phase 1 (레거시)

Phase 1 정적 웹 앱은 `apps/web` 디렉토리에 보관되어 있습니다.

#### Python 사용
```bash
cd apps/web
python -m http.server 5173
```

#### Node.js 사용
```bash
cd apps/web
npx http-server -p 5173
```

브라우저에서 `http://localhost:5173` 접속

## 📖 사용 방법

1. **가격 궤적 그리기**: 캔버스에서 마우스로 드래그하여 원하는 가격 패턴을 그립니다.
2. **설정 조정**: 왼쪽 패널에서 일봉 수, 가격 범위, 시뮬레이션 파라미터를 설정합니다.
3. **데이터 생성**: "생성" 버튼을 클릭하여 데이터를 생성하고 시뮬레이션을 실행합니다.
4. **결과 확인**: 오른쪽 패널에서 KPI와 데이터 미리보기를 확인합니다.
5. **CSV 다운로드**: 필요시 "CSV 다운로드" 버튼으로 데이터를 저장합니다.

### 주요 설정 항목

- **일봉 수 (N)**: 생성할 일봉 데이터 개수 (기본값: 252일 = 약 1년)
- **가격 범위**: 최소/최대 가격 설정
- **스케일**: 선형 또는 로그 스케일 선택
- **스무딩**: 이동평균 윈도우로 그림을 부드럽게 처리
- **리샘플링**: 주봉/월봉 기간 설정
- **초기 현금**: 시뮬레이션 시작 자본
- **거래 비용**: 매수 시 발생하는 거래 비용 (%)

## 🎯 사용 사례

- **시나리오 분석**: "만약 주가가 이렇게 움직인다면?" 가정에 대한 빠른 시뮬레이션
- **교육**: 주식 투자 개념을 시각적으로 학습
- **아이디어 검증**: 복잡한 툴 없이 간단한 투자 아이디어 테스트
- **데이터 생성**: 테스트용 시계열 데이터 생성

## 📂 프로젝트 구조

```
Draw2Data/
├── apps/
│   ├── frontend/          # React + TypeScript 앱 (Phase 2)
│   │   ├── src/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── backend/           # Node.js + Express API (Phase 2)
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── web/               # 정적 웹 앱 (Phase 1 - 레거시)
│       ├── index.html
│       ├── styles.css
│       └── app.js
├── docs/
│   ├── ARCHITECTURE.md    # 아키텍처 문서
│   └── ROADMAP.md         # 로드맵
├── package.json           # 루트 패키지 (워크스페이스)
├── .gitignore
├── LICENSE                # MIT 라이선스
└── README.md
```

## 🗺️ 로드맵

현재는 **Phase 2: 웹 플랫폼** 단계입니다.

- **Phase 1** ✅: 브라우저 전용 정적 웹 앱 (완료)
- **Phase 2** 🚀: 사용자 계정, 프로젝트 저장, API 백엔드 (진행 중)
- **Phase 3** 🌟: 공유 기능, 템플릿 마켓, 고급 시뮬레이션

자세한 내용은 [ROADMAP.md](docs/ROADMAP.md)를 참고하세요.

## 🏗️ 기술 스택

### Phase 2 (현재)
- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **인증**: JWT (JSON Web Tokens)
- **상태 관리**: React Hooks
- **API**: RESTful API

### Phase 1 (레거시)
- **HTML5**: 구조
- **CSS3**: 스타일링 및 반응형 디자인
- **Vanilla JavaScript**: 로직 및 인터랙션
- **Canvas API**: 그리기 인터페이스

### 향후 확장 (Phase 3)
- Database: PostgreSQL
- Worker: Python (NumPy, Pandas), Redis Queue
- Storage: S3/MinIO
- Real-time: WebSocket

자세한 아키텍처는 [ARCHITECTURE.md](docs/ARCHITECTURE.md)를 참고하세요.

## 🤝 기여

기여를 환영합니다! 다음과 같은 방법으로 기여할 수 있습니다:

1. 버그 리포트 및 기능 제안 (GitHub Issues)
2. 코드 기여 (Pull Requests)
3. 문서 개선
4. 테스트 추가

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.

## 🙏 감사의 글

이 프로젝트는 금융 시뮬레이션을 더 접근하기 쉽게 만들고자 하는 목표로 시작되었습니다.

## 📬 문의

- GitHub Issues: 버그 리포트 및 기능 제안
- Discussions: 일반적인 질문 및 토론

---

**Made with ❤️ for the financial simulation community**