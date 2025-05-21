# MCP Server (Claude 기반 프롬프트 관리 서버)

## 수정 계획 요약

- **여러 프롬프트 동시 적용**
  - metadata.json에 `selectedPromptIds: string[]` 필드 추가
  - MCP 서버에서 여러 system 프롬프트를 합성하여 Claude에 전달 (예: `\n---\n` 등으로 결합)
  - 웹 UI에서 멀티 선택/적용 기능 제공

- **포트 동기화**
  - ClaudeDesktop 앱이 종료될 때 MCP 서버(Express 3001번 포트)도 자동 종료
  - ClaudeDesktop에서 MCP 서버에 종료 신호 전송(REST API 등), 서버에서 해당 신호 수신 시 `webServer.close()` 호출

---

## 클로드 데스크탑 연동

이 MCP 서버는 **클로드 데스크탑(ClaudeDesktop)**에서 자동 실행/종료 연동이 가능합니다.

### config.json 예시

`claude_desktop_config.json`에 아래와 같이 등록하세요:

```json
{
  "my-mcp-server": {
    "command": "node",
    "args": ["/Users/{UserName}/Desktop/mcp-server/build/app.js"],
    "env": {
      "PORT": "원하는 포트 적으면 됩니다.",
      "CLAUDE_API_KEY": "본인-API-키"
    }
  }
}
```

- `command`: 실행 명령어 (node)
- `args`: 빌드된 app.js의 절대경로
- `env.PORT`: **웹포트**로, MCP 서버의 웹 UI가 이 포트를 점유합니다.
- `env.CLAUDE_API_KEY`: 본인 Claude API 키

> ⚠️ **포트 안내:**
> - MCP 서버의 웹포트는 config(`"PORT"`)에서 지정한 값이 사용됩니다. 원하는 포트 번호로 자유롭게 지정할 수 있습니다.
> - 해당 포트가 이미 사용 중이면 실행이 안 될 수 있습니다.
> - 여러 MCP 서버를 동시에 등록할 경우, 포트가 겹치지 않게 각각 다르게 지정하세요.

#### 예시: 포트를 4000으로 지정할 경우



---

## 개요

이 프로젝트는 Anthropic Claude API와 연동되는 MCP 서버 및 프롬프트 관리 웹 인터페이스를 제공합니다.  
- **프롬프트 관리**: 다양한 system/user 프롬프트를 웹에서 생성, 수정, 삭제, 적용 가능  
- **Claude API 연동**: 선택한 프롬프트를 Claude system 프롬프트로 실시간 적용  
- **MCP 서버**: StdioServerTransport 기반으로 별도 포트 없이 동작, Express 웹서버(3001번 포트) 제공  
- **포트 동기화**: ClaudeDesktop 앱과 3001번 포트 동기화(예정)  
- **Node.js/TypeScript** 기반, ESM 호환

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

---

## 라이선스

MIT 