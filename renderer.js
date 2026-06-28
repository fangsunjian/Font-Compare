// renderer.js - UI logic for Font Compare Electron Application

// Global configuration state
const state = {
  fontSize: 32,
  lineHeight: 1.4,
  letterSpacing: 0,
  isBold: false,
  isItalic: false,
  hasGridlines: true,
  layout: 'grid', // 'grid' or 'list'
  zoomLevel: 0, // Electron zoom level (0 = 100%)
  language: '', // Will be detected or loaded
  fonts: []
};

// Translation dictionary
const i18n = {
  'en': {
    subtitle: 'Professional font comparison & rendering test tool',
    text_input_title: 'Comparison Text Content',
    text_input_placeholder: 'Enter text you want to compare...',
    preset_mixed: 'Mixed Content',
    preset_jp: 'Japanese Kana',
    preset_emoji: 'Emoji',
    preset_english: 'English Alphabet',
    global_styles_title: 'Global Font Styles',
    font_size: 'Size',
    line_height: 'Line Height',
    letter_spacing: 'Spacing',
    bold: 'Bold',
    italic: 'Italic',
    gridlines: 'Gridlines',
    zoom_title: 'Window Zoom',
    zoom_out: 'Zoom Out (Ctrl -)',
    zoom_in: 'Zoom In (Ctrl =)',
    zoom_reset_title: 'Reset Zoom (Ctrl 0)',
    zoom_reset: 'Reset',
    layout_title: 'Layout & Display',
    layout_grid_title: 'Grid Layout',
    layout_grid: '2x2 Grid',
    layout_list_title: 'List Layout',
    layout_list: 'Single Column',
    reset_all: 'Reset All Settings',
    loaded_fonts: 'Loaded System Fonts:',
    search_font_placeholder: 'Enter or search system font...',
    select_font_title: 'Select system font',
    search_keyword_placeholder: 'Type keyword to search...',
    loading_fonts: 'Loading fonts...',
    config_font: 'Configured:',
    actual_render: 'Actual Render:',
    devtools_locked: '[DevTools locked debugging channel]',
    no_content: 'No content / Rendering',
    chars: 'chars'
  },
  'zh-CN': {
    subtitle: '专业字体对比与渲染测试工具',
    text_input_title: '对比文本内容',
    text_input_placeholder: '输入你想对比的文字...',
    preset_mixed: '经典混合',
    preset_jp: '日文假名',
    preset_emoji: 'Emoji表情',
    preset_english: '英文字母',
    global_styles_title: '全局字体样式',
    font_size: '字号 (Size)',
    line_height: '行高 (Line Height)',
    letter_spacing: '字间距 (Spacing)',
    bold: '粗体',
    italic: '斜体',
    gridlines: '辅助线',
    zoom_title: '窗口缩放 (Zoom)',
    zoom_out: '缩小 (Ctrl -)',
    zoom_in: '放大 (Ctrl =)',
    zoom_reset_title: '重置缩放 (Ctrl 0)',
    zoom_reset: '重置',
    layout_title: '布局与显示',
    layout_grid_title: '网格布局',
    layout_grid: '2x2 网格',
    layout_list_title: '列表布局',
    layout_list: '单栏列表',
    reset_all: '重置所有设置',
    loaded_fonts: '已加载系统字体:',
    search_font_placeholder: '输入或搜索系统字体...',
    select_font_title: '选择系统字体',
    search_keyword_placeholder: '输入关键字搜索...',
    loading_fonts: '正在加载字体...',
    config_font: '配置:',
    actual_render: '实际渲染:',
    devtools_locked: '[DevTools占领调试通道]',
    no_content: '暂无内容 / 排版中',
    chars: '字'
  },
  'ja': {
    subtitle: 'プロフェッショナルなフォント比較とレンダリングテストツール',
    text_input_title: '比較テキストコンテンツ',
    text_input_placeholder: '比較したいテキストを入力...',
    preset_mixed: '混合コンテンツ',
    preset_jp: '日本語かな',
    preset_emoji: '絵文字',
    preset_english: '英字',
    global_styles_title: 'グローバルフォントスタイル',
    font_size: 'サイズ',
    line_height: '行の高さ',
    letter_spacing: '文字間隔',
    bold: '太字',
    italic: '斜体',
    gridlines: 'グリッド線',
    zoom_title: 'ウィンドウのズーム',
    zoom_out: '縮小 (Ctrl -)',
    zoom_in: '拡大 (Ctrl =)',
    zoom_reset_title: 'ズームをリセット (Ctrl 0)',
    zoom_reset: 'リセット',
    layout_title: 'レイアウトと表示',
    layout_grid_title: 'グリッドレイアウト',
    layout_grid: '2x2 グリッド',
    layout_list_title: 'リストレイアウト',
    layout_list: '単一列リスト',
    reset_all: 'すべての設定をリセット',
    loaded_fonts: 'ロードされたシステムフォント:',
    search_font_placeholder: 'システムフォントを入力または検索...',
    select_font_title: 'システムフォントを選択',
    search_keyword_placeholder: '検索キーワードを入力...',
    loading_fonts: 'フォントを読み込み中...',
    config_font: '設定:',
    actual_render: '実際のレンダリング:',
    devtools_locked: '[DevToolsがデバッグチャネルをロック]',
    no_content: 'コンテンツなし / レンダリング中',
    chars: '文字'
  },
  'ko': {
    subtitle: '전문적인 폰트 비교 및 렌더링 테스트 도구',
    text_input_title: '비교 텍스트 콘텐츠',
    text_input_placeholder: '비교할 텍스트를 입력하세요...',
    preset_mixed: '혼합 콘텐츠',
    preset_jp: '일본어 가나',
    preset_emoji: '이모지',
    preset_english: '영어 알파벳',
    global_styles_title: '글로벌 폰트 스타일',
    font_size: '크기',
    line_height: '줄 높이',
    letter_spacing: '자간',
    bold: '굵게',
    italic: '기울임꼴',
    gridlines: '눈금선',
    zoom_title: '창 확대/축소',
    zoom_out: '축소 (Ctrl -)',
    zoom_in: '확대 (Ctrl =)',
    zoom_reset_title: '확대/축소 초기화 (Ctrl 0)',
    zoom_reset: '초기화',
    layout_title: '레이아웃 및 표시',
    layout_grid_title: '그리드 레이아웃',
    layout_grid: '2x2 그리드',
    layout_list_title: '리스트 레이아웃',
    layout_list: '단일 열 리스트',
    reset_all: '모든 설정 초기화',
    loaded_fonts: '로드된 시스템 폰트:',
    search_font_placeholder: '시스템 폰트 입력 또는 검색...',
    select_font_title: '시스템 폰트 선택',
    search_keyword_placeholder: '검색할 키워드 입력...',
    loading_fonts: '폰트 로드 중...',
    config_font: '설정:',
    actual_render: '실제 렌더링:',
    devtools_locked: '[DevTools가 디버깅 채널 잠금]',
    no_content: '콘텐츠 없음 / 렌더링 중',
    chars: '자'
  }
};

// Default fonts for the 4 slots
const defaultFonts = [
  'Microsoft YaHei',
  'Cascadia Mono',
  'SimSun',
  'Segoe UI'
];

// DOM Elements
const elements = {
  globalTextInput: document.getElementById('global-text-input'),
  fontSizeSlider: document.getElementById('font-size-slider'),
  fontSizeVal: document.getElementById('font-size-val'),
  lineHeightSlider: document.getElementById('line-height-slider'),
  lineHeightVal: document.getElementById('line-height-val'),
  letterSpacingSlider: document.getElementById('letter-spacing-slider'),
  letterSpacingVal: document.getElementById('letter-spacing-val'),
  
  toggleBold: document.getElementById('toggle-bold'),
  toggleItalic: document.getElementById('toggle-italic'),
  toggleGridlines: document.getElementById('toggle-gridlines'),
  
  zoomOutBtn: document.getElementById('zoom-out-btn'),
  zoomInBtn: document.getElementById('zoom-in-btn'),
  zoomResetBtn: document.getElementById('zoom-reset-btn'),
  zoomLevelVal: document.getElementById('zoom-level-val'),
  zoomSlider: document.getElementById('zoom-slider'),
  
  layoutGridBtn: document.getElementById('layout-grid-btn'),
  layoutListBtn: document.getElementById('layout-list-btn'),
  workspace: document.getElementById('workspace'),
  resetAllBtn: document.getElementById('reset-all-btn'),
  fontCount: document.getElementById('font-count'),
  
  // Array of selectors, inputs, render canvases and spec displays for cards 1 to 4
  cards: [1, 2, 3, 4].map(num => ({
    num,
    container: document.getElementById(`select-container-${num}`),
    input: document.getElementById(`input-${num}`),
    trigger: document.getElementById(`trigger-${num}`),
    menu: document.getElementById(`menu-${num}`),
    search: document.getElementById(`search-${num}`),
    list: document.getElementById(`list-${num}`),
    canvas: document.getElementById(`render-${num}`),
    spec: document.getElementById(`spec-${num}`)
  })),
  
  langSwitcher: document.getElementById('lang-switcher')
};

// Convert Electron zoom level to human-readable percentage
function zoomLevelToPercentage(level) {
  const percentage = Math.round(Math.pow(1.2, level) * 100);
  return `${percentage}%`;
}

// Timer for debouncing rendered font queries
let renderedFontsTimer = null;
let isInitializing = false;

// Query actual platform fonts from Chromium layout tree for all cards
async function updateAllRenderedFonts() {
  if (isInitializing) return;
  if (renderedFontsTimer) clearTimeout(renderedFontsTimer);
  
  renderedFontsTimer = setTimeout(async () => {
    try {
      if (typeof window.electronAPI.getAllRenderedFonts !== 'function') return;
      
      const selectors = elements.cards.map(card => `#render-${card.num}`);
      const results = await window.electronAPI.getAllRenderedFonts(selectors);
      
      const dict = i18n[state.language] || i18n['en'];
      
      elements.cards.forEach(card => {
        const selector = `#render-${card.num}`;
        const specEl = card.spec;
        let text = `${dict.config_font} ${card.input.value}`;
        
        if (results === null) {
          // Debugger is locked (DevTools is open)
          text += ` | ${dict.actual_render} ${dict.devtools_locked}`;
        } else {
          const fonts = results[selector];
          if (fonts && fonts.length > 0) {
            const fontDetails = fonts.map(f => `${f.familyName} (${f.glyphCount}${dict.chars})`).join(' + ');
            text += ` | ${dict.actual_render} ${fontDetails}`;
          } else {
            text += ` | ${dict.actual_render} ${dict.no_content}`;
          }
        }
        
        specEl.textContent = text;
      });
    } catch (e) {
      console.error('Failed to update rendered fonts:', e);
    }
  }, 200); // 200ms debounce gives Chromium engine time to layout text
}

// Sync render previews with the global text input
function syncPreviews() {
  const text = elements.globalTextInput.value;
  elements.cards.forEach(card => {
    card.canvas.innerText = text;
  });
  updateAllRenderedFonts();
}

// Apply styling to all previews
function applyStyling() {
  elements.cards.forEach(card => {
    const canvas = card.canvas;
    canvas.style.fontSize = `${state.fontSize}px`;
    canvas.style.lineHeight = state.lineHeight;
    canvas.style.letterSpacing = `${state.letterSpacing}px`;
    
    // Bold toggle
    if (state.isBold) {
      canvas.classList.add('bold');
    } else {
      canvas.classList.remove('bold');
    }
    
    // Italic toggle
    if (state.isItalic) {
      canvas.classList.add('italic');
    } else {
      canvas.classList.remove('italic');
    }
    
    // Gridlines toggle
    if (state.hasGridlines) {
      canvas.classList.add('gridlines');
    } else {
      canvas.classList.remove('gridlines');
    }
  });
  updateAllRenderedFonts();
}

// Set up UI values based on current state
function syncUIValues() {
  // Sliders
  elements.fontSizeSlider.value = state.fontSize;
  elements.fontSizeVal.textContent = `${state.fontSize}px`;
  
  elements.lineHeightSlider.value = state.lineHeight;
  elements.lineHeightVal.textContent = state.lineHeight;
  
  elements.letterSpacingSlider.value = state.letterSpacing;
  elements.letterSpacingVal.textContent = `${state.letterSpacing}px`;
  
  // Toggles
  elements.toggleBold.classList.toggle('active', state.isBold);
  elements.toggleItalic.classList.toggle('active', state.isItalic);
  elements.toggleGridlines.classList.toggle('active', state.hasGridlines);
  
  // Zoom
  elements.zoomSlider.value = state.zoomLevel;
  elements.zoomLevelVal.textContent = zoomLevelToPercentage(state.zoomLevel);
  
  // Layout
  if (state.layout === 'grid') {
    elements.layoutGridBtn.classList.add('active');
    elements.layoutListBtn.classList.remove('active');
    elements.workspace.className = 'workspace grid-layout';
  } else {
    elements.layoutGridBtn.classList.remove('active');
    elements.layoutListBtn.classList.add('active');
    elements.workspace.className = 'workspace list-layout';
  }
}

// Handle font family update for a card
function updateCardFont(card, fontFamily) {
  card.canvas.style.fontFamily = `"${fontFamily}", sans-serif`;
  updateAllRenderedFonts();
}

// Update application language
function applyLanguage() {
  const dict = i18n[state.language] || i18n['en'];
  
  // Update texts
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Update titles/tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {
      el.setAttribute('title', dict[key]);
    }
  });
  
  // Refresh rendered font strings
  updateAllRenderedFonts();
}

// Save state to localStorage for persistence
function saveState() {
  if (isInitializing) return;
  const data = {
    text: elements.globalTextInput.value,
    fontSize: state.fontSize,
    lineHeight: state.lineHeight,
    letterSpacing: state.letterSpacing,
    isBold: state.isBold,
    isItalic: state.isItalic,
    hasGridlines: state.hasGridlines,
    layout: state.layout,
    zoomLevel: state.zoomLevel,
    language: state.language,
    fonts: elements.cards.map(c => c.input.value)
  };
  localStorage.setItem('fontCompareState', JSON.stringify(data));
}

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem('fontCompareState') || localStorage.getItem('font_compare_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.fontSize !== undefined) state.fontSize = parsed.fontSize;
      if (parsed.lineHeight !== undefined) state.lineHeight = parsed.lineHeight;
      if (parsed.letterSpacing !== undefined) state.letterSpacing = parsed.letterSpacing;
      if (parsed.isBold !== undefined) state.isBold = parsed.isBold;
      if (parsed.isItalic !== undefined) state.isItalic = parsed.isItalic;
      if (parsed.hasGridlines !== undefined) state.hasGridlines = parsed.hasGridlines;
      if (parsed.layout !== undefined) state.layout = parsed.layout;
      if (parsed.zoomLevel !== undefined) state.zoomLevel = parsed.zoomLevel;
      if (parsed.text !== undefined) elements.globalTextInput.value = parsed.text;
      if (parsed.language !== undefined) state.language = parsed.language;
      
      // Load card fonts (supporting both old and new schema)
      const fontsArray = parsed.fonts || parsed.cardFonts;
      if (fontsArray && Array.isArray(fontsArray)) {
        fontsArray.forEach((font, index) => {
          if (elements.cards[index] && font) {
            elements.cards[index].input.value = font;
            updateCardFont(elements.cards[index], font);
          }
        });
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
  }
}

// Render the dropdown list with optional filtering
function renderDropdownList(card, filterText = '') {
  card.list.innerHTML = '';
  const searchLower = filterText.toLowerCase().trim();
  
  // Custom option (allows resetting selection to custom typed)
  const customItem = document.createElement('div');
  customItem.className = 'dropdown-item';
  customItem.textContent = '-- 自定义 / 手动输入 --';
  customItem.addEventListener('click', () => {
    selectDropdownItem(card, '');
  });
  card.list.appendChild(customItem);
  
  // Filter the system fonts
  const filteredFonts = state.fonts.filter(font => 
    font.toLowerCase().includes(searchLower)
  );
  
  if (filteredFonts.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'dropdown-item no-results';
    noResults.textContent = '未找到匹配字体';
    card.list.appendChild(noResults);
    return;
  }
  
  // Append filtered fonts
  filteredFonts.forEach(font => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    
    // Highlight if selected
    if (card.input.value.trim().toLowerCase() === font.toLowerCase()) {
      item.classList.add('active');
    }
    
    item.textContent = font;
    item.addEventListener('click', () => {
      selectDropdownItem(card, font);
    });
    card.list.appendChild(item);
  });
}

// Select item from the custom dropdown menu
function selectDropdownItem(card, value) {
  if (value !== '') {
    card.input.value = value;
    updateCardFont(card, value);
  }
  card.menu.classList.remove('show');
  saveState();
}

// Populate system fonts
async function loadSystemFonts() {
  try {
    const fonts = await window.electronAPI.getSystemFonts();
    state.fonts = fonts;
    elements.fontCount.textContent = fonts.length;
    
    // Render initial states for each card
    elements.cards.forEach(card => {
      const defaultFont = defaultFonts[card.num - 1];
      const match = fonts.find(f => f.toLowerCase() === defaultFont.toLowerCase());
      
      if (match) {
        card.input.value = match;
        updateCardFont(card, match);
      } else {
        card.input.value = defaultFont;
        updateCardFont(card, defaultFont);
      }
      
      // Initially populate list (no filter)
      renderDropdownList(card);
    });
  } catch (error) {
    console.error('Error fetching system fonts:', error);
    elements.fontCount.textContent = '加载失败';
    
    // Fallback options
    elements.cards.forEach(card => {
      updateCardFont(card, defaultFonts[card.num - 1]);
    });
  }
}

// Setup language switcher
function setupLanguageSwitcher() {
  elements.langSwitcher.value = state.language;
  elements.langSwitcher.addEventListener('change', (e) => {
    state.language = e.target.value;
    applyLanguage();
    saveState();
  });
}

// Initialize Application
async function init() {
  isInitializing = true;
  
  // Load fonts first
  await loadSystemFonts();
  
  // Load saved state (will overwrite font values if they exist)
  loadState();
  
  // Determine language if not loaded
  if (!state.language && window.electronAPI && typeof window.electronAPI.getSystemLocale === 'function') {
    const sysLocale = await window.electronAPI.getSystemLocale();
    if (sysLocale.startsWith('zh')) state.language = 'zh-CN';
    else if (sysLocale.startsWith('ja')) state.language = 'ja';
    else if (sysLocale.startsWith('ko')) state.language = 'ko';
    else state.language = 'en';
  } else if (!state.language) {
    state.language = 'en';
  }
  
  applyLanguage();
  setupLanguageSwitcher();
  
  // Set initial previews
  syncPreviews();
  
  // Apply styling
  applyStyling();
  
  // Apply UI and layout state
  syncUIValues();
  
  // Apply zoom factor
  try {
    await window.electronAPI.setZoomLevel(state.zoomLevel);
  } catch (e) {
    console.error("Zoom API not available yet", e);
  }
  
  isInitializing = false;
  
  // Refresh rendered font displays on startup with a short delay to allow rendering
  setTimeout(updateAllRenderedFonts, 500);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Global text input change
elements.globalTextInput.addEventListener('input', () => {
  syncPreviews();
  saveState();
});

// Presets
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const text = e.target.getAttribute('data-text');
    elements.globalTextInput.value = text;
    syncPreviews();
    saveState();
  });
});

// Font size slider
elements.fontSizeSlider.addEventListener('input', (e) => {
  state.fontSize = parseInt(e.target.value);
  elements.fontSizeVal.textContent = `${state.fontSize}px`;
  applyStyling();
  saveState();
});

// Line height slider
elements.lineHeightSlider.addEventListener('input', (e) => {
  state.lineHeight = parseFloat(e.target.value);
  elements.lineHeightVal.textContent = state.lineHeight;
  applyStyling();
  saveState();
});

// Letter spacing slider
elements.letterSpacingSlider.addEventListener('input', (e) => {
  state.letterSpacing = parseInt(e.target.value);
  elements.letterSpacingVal.textContent = `${state.letterSpacing}px`;
  applyStyling();
  saveState();
});

// Bold toggle
elements.toggleBold.addEventListener('click', () => {
  state.isBold = !state.isBold;
  elements.toggleBold.classList.toggle('active', state.isBold);
  applyStyling();
  saveState();
});

// Italic toggle
elements.toggleItalic.addEventListener('click', () => {
  state.isItalic = !state.isItalic;
  elements.toggleItalic.classList.toggle('active', state.isItalic);
  applyStyling();
  saveState();
});

// Gridlines toggle
elements.toggleGridlines.addEventListener('click', () => {
  state.hasGridlines = !state.hasGridlines;
  elements.toggleGridlines.classList.toggle('active', state.hasGridlines);
  applyStyling();
  saveState();
});

// Zoom: In, Out, Reset, Slider
const changeZoomLevel = async (level) => {
  state.zoomLevel = level;
  elements.zoomSlider.value = level;
  elements.zoomLevelVal.textContent = zoomLevelToPercentage(level);
  await window.electronAPI.setZoomLevel(level);
  saveState();
  updateAllRenderedFonts();
};

elements.zoomInBtn.addEventListener('click', () => {
  const next = Math.min(state.zoomLevel + 0.5, 5);
  changeZoomLevel(next);
});

elements.zoomOutBtn.addEventListener('click', () => {
  const next = Math.max(state.zoomLevel - 0.5, -3);
  changeZoomLevel(next);
});

elements.zoomResetBtn.addEventListener('click', () => {
  changeZoomLevel(0);
});

elements.zoomSlider.addEventListener('input', (e) => {
  const level = parseFloat(e.target.value);
  changeZoomLevel(level);
});

// Sync zoom changes from keyboard shortcuts (Main process sends zoom-changed)
window.electronAPI.onZoomChanged((level) => {
  state.zoomLevel = level;
  elements.zoomSlider.value = level;
  elements.zoomLevelVal.textContent = zoomLevelToPercentage(level);
  saveState();
  updateAllRenderedFonts();
});

// Layout controls
elements.layoutGridBtn.addEventListener('click', () => {
  state.layout = 'grid';
  elements.layoutGridBtn.classList.add('active');
  elements.layoutListBtn.classList.remove('active');
  elements.workspace.className = 'workspace grid-layout';
  saveState();
  updateAllRenderedFonts();
});

elements.layoutListBtn.addEventListener('click', () => {
  state.layout = 'list';
  elements.layoutGridBtn.classList.remove('active');
  elements.layoutListBtn.classList.add('active');
  elements.workspace.className = 'workspace list-layout';
  saveState();
  updateAllRenderedFonts();
});

// Reset all settings
elements.resetAllBtn.addEventListener('click', () => {
  // Clear persistent storage
  localStorage.removeItem('font_compare_state');
  
  state.fontSize = 32;
  state.lineHeight = 1.4;
  state.letterSpacing = 0;
  state.isBold = false;
  state.isItalic = false;
  state.hasGridlines = true;
  state.layout = 'grid';
  state.zoomLevel = 0;
  
  elements.globalTextInput.value = `永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，群贤毕至，少长咸集。\nThe quick brown fox jumps over the lazy dog.\nいろはにほへと ちりぬるを わ开よたれそ つねならむ。\n🎨🍜🥷 ✨🌟🔥 0123456789 &?#@%!`;
  
  // Reapply UI state
  syncUIValues();
  syncPreviews();
  applyStyling();
  window.electronAPI.setZoomLevel(0);
  
  // Reset card font fields to original defaults
  elements.cards.forEach(card => {
    const defaultFont = defaultFonts[card.num - 1];
    const match = state.fonts.find(f => f.toLowerCase() === defaultFont.toLowerCase());
    
    if (match) {
      card.input.value = match;
      updateCardFont(card, match);
    } else {
      card.input.value = defaultFont;
      updateCardFont(card, defaultFont);
    }
    
    renderDropdownList(card);
    card.menu.classList.remove('show');
  });
});

// Setup specific events for individual Font Cards
elements.cards.forEach(card => {
  // Toggle dropdown on trigger click
  card.trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isShown = card.menu.classList.contains('show');
    
    // Close other menus
    elements.cards.forEach(c => {
      if (c.num !== card.num) c.menu.classList.remove('show');
    });
    
    if (isShown) {
      card.menu.classList.remove('show');
    } else {
      card.menu.classList.add('show');
      card.search.value = '';
      renderDropdownList(card);
      setTimeout(() => card.search.focus(), 50);
    }
  });

  // Typing in dropdown search box filters list
  card.search.addEventListener('input', (e) => {
    renderDropdownList(card, e.target.value);
  });

  // Typing in dropdown search box stops propagation to window/card shortcuts
  card.search.addEventListener('click', (e) => e.stopPropagation());

  // Show dropdown when clicking/focusing the main font name input
  card.input.addEventListener('focus', () => {
    elements.cards.forEach(c => {
      if (c.num !== card.num) c.menu.classList.remove('show');
    });
    card.menu.classList.add('show');
    card.search.value = card.input.value;
    renderDropdownList(card, card.input.value);
  });

  // Typing in main input updates rendering and filters search list
  card.input.addEventListener('input', (e) => {
    const typedFont = e.target.value.trim();
    updateCardFont(card, typedFont || 'sans-serif');
    
    card.menu.classList.add('show');
    card.search.value = typedFont;
    renderDropdownList(card, typedFont);
    saveState();
  });

  // Stop click propagation on containers so click-outside works correctly
  card.container.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

// Close all menus when clicking outside
document.addEventListener('click', () => {
  elements.cards.forEach(card => {
    card.menu.classList.remove('show');
  });
});

// Setup copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetId = btn.getAttribute('data-target');
    const inputEl = document.getElementById(targetId);
    if (inputEl) {
      const textToCopy = inputEl.value;
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change icon to a checkmark temporarily
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        btn.style.borderColor = '#10B981';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.borderColor = '';
        }, 1500);
      }).catch(err => {
        console.error('Could not copy font name:', err);
      });
    }
  });
});

// Launch on load
window.addEventListener('DOMContentLoaded', init);
