document.addEventListener('DOMContentLoaded', function() {
  // 검색 기능
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  
  if (searchInput && searchButton) {
    // 검색 입력란에서 엔터 키 처리
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    
    // 검색 버튼 클릭 처리
    searchButton.addEventListener('click', performSearch);
    
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const promptElements = document.querySelectorAll('.list-group-item');
      
      if (searchTerm === '') {
        // 검색어가 비어 있으면 모든 프롬프트 표시
        promptElements.forEach(element => {
          element.style.display = 'block';
        });
        return;
      }
      
      // 검색어로 프롬프트 필터링
      promptElements.forEach(element => {
        const title = element.querySelector('h5').textContent.toLowerCase();
        const tags = Array.from(element.querySelectorAll('.badge'))
          .map(tag => tag.textContent.toLowerCase());
        
        // 제목이나 태그에 검색어가 포함되어 있으면 표시, 그렇지 않으면 숨김
        if (title.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
          element.style.display = 'block';
        } else {
          element.style.display = 'none';
        }
      });
    }
  }
  
  // 텍스트 영역 자동 크기 조정
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
    
    // 초기 높이 설정
    textarea.dispatchEvent(new Event('input'));
  });
  
  // 프롬프트 태그 클릭 처리 (태그 필터링)
  const tagBadges = document.querySelectorAll('.badge');
  tagBadges.forEach(badge => {
    badge.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (searchInput) {
        searchInput.value = this.textContent;
        const event = new Event('keypress');
        event.key = 'Enter';
        searchInput.dispatchEvent(event);
      }
    });
  });
});