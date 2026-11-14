# 파크리오 안건 제안 홈페이지

입주자대표회의 안건 제안서를 작성하고 PDF 또는 Word 파일로 저장하는 정적 홈페이지입니다. 제안서 파일은 브라우저에서 생성됩니다. 메일 버튼은 메일쓰기 화면만 열며, 파일 첨부와 발송은 이용자가 직접 합니다.

## 출처와 범위

2026-11-14 Netlify의 `parkrio-agenda` 배포 파일을 내려받아 GitHub에 옮긴 **게시본 기반 백업**입니다. 원래 개발 저장소의 전체 소스나 변경 기록은 아닙니다. 글꼴 파일명은 대소문자를 구분하는 호스팅에서도 PDF가 작동하도록 참조 이름과 일치시켰습니다. 기존 ChatGPT Sites와 Netlify 사이트는 변경하지 않았습니다.

## Windows 11에서 실행

1. 저장소에서 **Code → Download ZIP**으로 파일을 받거나 저장소를 복제합니다.
2. [Node.js LTS](https://nodejs.org/)가 없다면 설치합니다. 추가 패키지는 필요하지 않습니다.
3. 압축을 푼 폴더에서 `start-local.bat`를 실행합니다.
4. 브라우저에서 `http://localhost:8765/`를 엽니다. 종료하려면 명령 창에서 `Ctrl+C`를 누릅니다.

`index.html`을 직접 여는 `file://` 방식은 브라우저가 PDF용 글꼴을 차단할 수 있으므로 로컬 주소를 이용해 주세요.

## 수정

- 화면·문구·색상·양식: `index.html`
- 입력 검사·메일 연결: `app.js`
- PDF 형식: `proposal-pdf.js`
- Word 형식: `proposal-word.js`
- 한글 글꼴 및 라이선스: `fonts/`
- 문서 생성 라이브러리: `vendor/`

수정 후 미리보기와 PDF·Word 다운로드를 각각 시험해 보세요. 수신 주소를 바꾸려면 `index.html`과 `app.js`의 `js-parkrio@naver.com`을 함께 수정해야 합니다.
