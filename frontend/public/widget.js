(function() {
  if (window.ResuMatchWidgetLoaded) return;
  window.ResuMatchWidgetLoaded = true;

  // Find script element tag to read data-api-key
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var apiKey = currentScript ? (currentScript.getAttribute('data-api-key') || '') : '';
  var scriptSrc = currentScript ? currentScript.src : 'http://localhost:5173/widget.js';
  var baseUrl = 'http://localhost:5173';

  try {
    baseUrl = new URL(scriptSrc).origin;
  } catch (e) {}

  // Inject Styles
  var style = document.createElement('style');
  style.textContent = `
    #resumatch-widget-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 20px;
      background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
      box-shadow: 0 10px 30px rgba(6, 182, 212, 0.45);
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid rgba(255, 255, 255, 0.25);
    }
    #resumatch-widget-trigger:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 15px 35px rgba(6, 182, 212, 0.65);
    }
    #resumatch-widget-container {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 420px;
      max-width: calc(100vw - 32px);
      height: 640px;
      max-height: calc(100vh - 120px);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      z-index: 999998;
      display: none;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: #090d16;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #resumatch-widget-container.open {
      display: block;
      animation: resumatchPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes resumatchPopIn {
      from { opacity: 0; transform: translateY(20px) scale(0.92); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);

  // Trigger Button
  var triggerBtn = document.createElement('div');
  triggerBtn.id = 'resumatch-widget-trigger';
  triggerBtn.title = 'AI Resume Screening';
  triggerBtn.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  document.body.appendChild(triggerBtn);

  // Iframe Container
  var container = document.createElement('div');
  container.id = 'resumatch-widget-container';

  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/widget-embed?apiKey=' + encodeURIComponent(apiKey);
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  container.appendChild(iframe);
  document.body.appendChild(container);

  // Toggle Popup
  var isOpen = false;
  triggerBtn.addEventListener('click', function() {
    isOpen = !isOpen;
    if (isOpen) {
      container.classList.add('open');
      triggerBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      container.classList.remove('open');
      triggerBtn.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
    }
  });
})();
