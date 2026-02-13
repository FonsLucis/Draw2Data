import { useState } from 'react'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')

  return (
    <div className="app">
      <header className="app-header">
        <h1>📈 Draw2Data - Phase 2</h1>
        <p>그림으로 주식 시나리오를 그리고 시뮬레이션하는 웹 플랫폼</p>
      </header>
      
      <main className="app-main">
        {!isAuthenticated ? (
          <div className="auth-section">
            <h2>환영합니다!</h2>
            <p>Phase 2 기능을 사용하려면 로그인하세요.</p>
            <div className="auth-form">
              <input
                type="text"
                placeholder="이메일"
                className="auth-input"
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="auth-input"
              />
              <button
                className="auth-button"
                onClick={() => {
                  setIsAuthenticated(true)
                  setUsername('사용자')
                }}
              >
                로그인
              </button>
            </div>
          </div>
        ) : (
          <div className="dashboard">
            <h2>안녕하세요, {username}님!</h2>
            <div className="features">
              <div className="feature-card">
                <h3>🎨 새 프로젝트</h3>
                <p>가격 궤적을 그려 시뮬레이션 시작</p>
                <button className="feature-button">시작하기</button>
              </div>
              <div className="feature-card">
                <h3>💾 내 프로젝트</h3>
                <p>저장된 프로젝트 불러오기</p>
                <button className="feature-button">보기</button>
              </div>
              <div className="feature-card">
                <h3>📊 시뮬레이션 기록</h3>
                <p>과거 시뮬레이션 결과 확인</p>
                <button className="feature-button">확인</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Phase 2: 웹 플랫폼 - 사용자 인증 및 프로젝트 저장 기능 지원</p>
      </footer>
    </div>
  )
}

export default App
