# MCP Server (Claude 기반 프롬프트 관리 서버)

## 수정 계획 요약

- **여러 프롬프트 동시 적용**
  - metadata.json에 `selectedPromptIds: string[]` 필드 추가
  - MCP 서버에서 여러 system 프롬프트를 합성하여 Claude에 전달 (예: `\n---\n` 등으로 결합)
  - 웹 UI에서 멀티 선택/적용 기능 제공

- **포트 동기화**
  - ClaudeDesktop 앱이 종료될 때 MCP 서버(Express 3001번 포트)도 자동 종료
  - ClaudeDesktop에서 MCP 서버에 종료 신호 전송(REST API 등), 서버에서 해당 신호 수신 시 `webServer.close()` 호출

## 개요

이 프로젝트는 Anthropic Claude API와 연동되는 MCP 서버 및 프롬프트 관리 웹 인터페이스를 제공합니다.  
- **프롬프트 관리**: 다양한 system/user 프롬프트를 웹에서 생성, 수정, 삭제, 적용 가능  
- **Claude API 연동**: 선택한 프롬프트를 Claude system 프롬프트로 실시간 적용  
- **MCP 서버**: StdioServerTransport 기반으로 별도 포트 없이 동작, Express 웹서버(3001번 포트) 제공  
- **포트 동기화**: ClaudeDesktop 앱과 3001번 포트 동기화(예정)  
- **Node.js/TypeScript** 기반, ESM 호환

## 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   - `.env` 파일에 아래와 같이 Claude API 키를 입력
     ```
     CLAUDE_API_KEY=sk-xxxxxxx
     ```

3. **서버 실행**
   ```bash
   npm run start
   ```
   - 웹 인터페이스: [http://localhost:3001](http://localhost:3001)
   - MCP 서버: Stdio 기반(포트 불필요, MCP 클라이언트에서 직접 연결)

## 주요 기능

- **프롬프트 관리**
  - 웹 UI에서 프롬프트 생성/수정/삭제/적용
  - metadata.json에 선택된 프롬프트 ID 저장, Claude system 프롬프트로 실시간 반영
- **Claude API 연동**
  - system/user 프롬프트 분리, 커스텀 프롬프트 실시간 적용
  - 답변 전략(계획) 툴(`answer-plan`)을 반드시 선행 호출
- **MCP 서버**
  - StdioServerTransport 기반, 별도 포트 불필요
  - Express(3001번 포트)는 웹 UI 용도
- **포트 동기화(예정)**
  - ClaudeDesktop 앱 종료 시 3001번 포트 자동 종료(연동 예정)
- **Node.js/TypeScript 호환**
  - fetch, ReadableStream 등 polyfill 적용
  - ESM/ts-node 환경 지원

## 사용 예시

1. 웹 UI에서 프롬프트 생성 및 적용
2. MCP 툴에서 system 프롬프트로 자동 반영
3. `/api/test-claude-api`로 Claude 응답 테스트

## 주의사항

- Node.js 버전 차이로 인한 호환성 문제 발생 시, `process.version` 로그로 실제 실행 환경 확인 권장
- 프론트엔드(ClaudeDesktop)에서 응답 후처리 시 system 프롬프트가 100% 강제되지 않을 수 있음(서버에서 최대한 래핑)
- MCP 툴 등록 시 description 파라미터 위치/방식에 주의(타입 에러 발생 가능)

## 향후 개선/계획

- 여러 프롬프트를 동시에 활성/비활성화(멀티 system 프롬프트 적용)
- ClaudeDesktop 앱 종료와 3001번 포트 동기화
- 프롬프트 그룹/태그별 관리, 프롬프트 버전 관리 등

---

## 라이선스

MIT 