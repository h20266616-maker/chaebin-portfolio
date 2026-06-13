# 작품 이미지 추가 가이드

1. 이 폴더(`public/images/work/`)에 작품 이미지 파일을 넣으세요.
2. 파일명 형식 권장: `project-01-1.jpg`, `project-01-2.jpg` (프로젝트번호-이미지순서)
3. `src/data/projects.js` 파일을 열어서 각 프로젝트의 `images` 배열에 파일 경로를 적어주세요.
   예: `images: ["/images/work/project-01-1.jpg"]`
4. 새 프로젝트를 추가하려면 `projects.js` 배열에 새 객체를 추가하면 됩니다.
   필수 항목: `id`, `title`, `category`, `year`, `description`, `tools`, `images`
5. 이미지 비율은 3:4(세로형)를 권장합니다. 다른 비율도 자동으로 잘려서(`object-fit: cover`) 표시됩니다.
6. 프로젝트 개수가 늘어나거나 줄어들어도 갤러리와 카운터가 자동으로 조정됩니다.
7. 이미지가 없거나 파일명이 틀리면 카테고리 텍스트(예: POSTER DESIGN)가 대신 표시됩니다.
