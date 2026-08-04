(() => {
  if (
    typeof window === "undefined" ||
    (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1")
  ) {
    return;
  }
  if (window.__AGENT_INSPECTOR_INIT__) return;
  window.__AGENT_INSPECTOR_INIT__ = true;

  // CSS for the shadow DOM (Modal & Button)
  const styles = `
    :host {
      all: initial;
    }
    #agent-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #7c3aed;
      color: white;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999999;
      border: none;
      transition: all 0.2s;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #agent-fab:hover {
      transform: scale(1.05);
      background: #6d28d9;
    }
    #agent-fab.inspecting {
      background: #ef4444;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    #agent-modal {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 450px;
      background: #1e1e2e;
      color: #cdd6f4;
      border: 1px solid #313244;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }
    #agent-modal.visible {
      display: block;
    }
    .modal-header {
      background: #181825;
      padding: 12px 16px;
      border-bottom: 1px solid #313244;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 {
      margin: 0;
      font-size: 16px;
      color: #f38ba8;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #a6adc8;
      cursor: pointer;
      font-size: 18px;
    }
    .modal-body {
      padding: 16px;
    }
    .info-group {
      margin-bottom: 12px;
    }
    .info-label {
      font-size: 12px;
      color: #a6adc8;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      background: #11111b;
      padding: 8px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      color: #a6e3a1;
      word-break: break-all;
    }
    textarea {
      width: 100%;
      height: 80px;
      background: #11111b;
      border: 1px solid #313244;
      border-radius: 6px;
      color: #cdd6f4;
      padding: 8px;
      font-family: inherit;
      resize: vertical;
      margin-top: 8px;
      box-sizing: border-box;
    }
    textarea:focus {
      outline: none;
      border-color: #7c3aed;
    }
    .modal-footer {
      padding: 12px 16px;
      background: #181825;
      border-top: 1px solid #313244;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-cancel {
      background: transparent;
      color: #cdd6f4;
    }
    .btn-cancel:hover {
      background: #313244;
    }
    .btn-copy {
      background: #7c3aed;
      color: white;
    }
    .btn-copy:hover {
      background: #6d28d9;
    }
    .btn-copy.copied {
      background: #a6e3a1;
      color: #11111b;
    }
  `;

  class AgentInspector extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.isInspecting = false;
      this.targetElement = null;

      // Create Highlighter Overlay directly on document.body to avoid clipping
      this.highlighter = document.createElement("div");
      this.highlighter.id = "agent-inspector-highlighter";
      Object.assign(this.highlighter.style, {
        position: "fixed",
        pointerEvents: "none",
        zIndex: "999998",
        border: "2px dashed #f38ba8",
        backgroundColor: "rgba(243, 139, 168, 0.1)",
        display: "none",
        transition: "all 0.1s ease-out",
        borderRadius: "4px"
      });
      document.body.appendChild(this.highlighter);

      this.render();
      this.bindEvents();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <button id="agent-fab" title="Toggle Agent Inspector (Magic Wand)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 4V2"></path>
            <path d="M15 16v-2"></path>
            <path d="M8 9h2"></path>
            <path d="M20 9h2"></path>
            <path d="M17.8 11.8l1.4 1.4"></path>
            <path d="M10.6 6.2l1.4 1.4"></path>
            <path d="M17.8 6.2l-1.4 1.4"></path>
            <path d="M10.6 11.8l-1.4-1.4"></path>
            <path d="m3 21 9-9"></path>
            <path d="M12.2 9.8l2 2"></path>
          </svg>
        </button>

        <div id="agent-modal">
          <div class="modal-header">
            <h3>Agent Element Prompt</h3>
            <button class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="info-group">
              <div class="info-label">Tag & Classes</div>
              <div class="info-value" id="info-tag"></div>
            </div>
            <div class="info-group">
              <div class="info-label">React Component</div>
              <div class="info-value" id="info-react">Not Found</div>
            </div>
            <div class="info-group">
              <div class="info-label">XPath</div>
              <div class="info-value" id="info-xpath"></div>
            </div>
            <div class="info-group">
              <div class="info-label">What should the AI do?</div>
              <textarea id="prompt-input" placeholder="e.g. Change the background color to red, update the font size..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-cancel">Cancel</button>
            <button class="btn btn-copy">Copy Prompt</button>
          </div>
        </div>
      `;

      this.fab = this.shadowRoot.getElementById("agent-fab");
      this.modal = this.shadowRoot.getElementById("agent-modal");
      this.closeBtn = this.shadowRoot.querySelector(".close-btn");
      this.cancelBtn = this.shadowRoot.querySelector(".btn-cancel");
      this.copyBtn = this.shadowRoot.querySelector(".btn-copy");
      this.promptInput = this.shadowRoot.getElementById("prompt-input");
      
      this.infoTag = this.shadowRoot.getElementById("info-tag");
      this.infoReact = this.shadowRoot.getElementById("info-react");
      this.infoXpath = this.shadowRoot.getElementById("info-xpath");

      // Bind methods
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    bindEvents() {
      this.fab.addEventListener("click", () => this.toggleInspect());
      this.closeBtn.addEventListener("click", () => this.closeModal());
      this.cancelBtn.addEventListener("click", () => this.closeModal());
      this.copyBtn.addEventListener("click", () => this.copyPrompt());
    }

    toggleInspect() {
      this.isInspecting = !this.isInspecting;
      if (this.isInspecting) {
        this.fab.classList.add("inspecting");
        document.addEventListener("mousemove", this.handleMouseMove, true);
        document.addEventListener("click", this.handleClick, true);
        document.addEventListener("keydown", this.handleKeyDown, true);
        document.body.style.cursor = "crosshair";
      } else {
        this.stopInspect();
      }
    }

    stopInspect() {
      this.isInspecting = false;
      this.fab.classList.remove("inspecting");
      this.highlighter.style.display = "none";
      document.removeEventListener("mousemove", this.handleMouseMove, true);
      document.removeEventListener("click", this.handleClick, true);
      document.removeEventListener("keydown", this.handleKeyDown, true);
      document.body.style.cursor = "default";
    }

    handleKeyDown(e) {
      if (e.key === "Escape") {
        this.stopInspect();
        this.closeModal();
      }
    }

    handleMouseMove(e) {
      if (!this.isInspecting) return;
      
      // Ignore if hovering over the agent inspector itself
      if (e.composedPath().includes(this)) return;

      const target = e.target;
      if (target && target !== this.highlighter) {
        this.targetElement = target;
        const rect = target.getBoundingClientRect();
        this.highlighter.style.display = "block";
        this.highlighter.style.top = rect.top + "px";
        this.highlighter.style.left = rect.left + "px";
        this.highlighter.style.width = rect.width + "px";
        this.highlighter.style.height = rect.height + "px";
      }
    }

    handleClick(e) {
      if (!this.isInspecting) return;
      if (e.composedPath().includes(this)) return;

      e.preventDefault();
      e.stopPropagation();

      this.stopInspect();
      this.openModal();
    }

    getReactComponentName(el) {
      // Find the __reactFiber key
      const key = Object.keys(el).find(k => k.startsWith("__reactFiber$"));
      if (!key) return null;
      let fiber = el[key];
      
      // Traverse up to find a composite component (function/class)
      while (fiber) {
        if (typeof fiber.type === "function") {
          return fiber.type.name || fiber.type.displayName;
        }
        if (fiber.type && typeof fiber.type.render === "function") {
          return fiber.type.render.name || fiber.type.render.displayName || "ForwardRef";
        }
        fiber = fiber.return;
      }
      return null;
    }

    getXPath(el) {
      if (el.id) return `//*[@id="${el.id}"]`;
      const parts = [];
      while (el && el.nodeType === Node.ELEMENT_NODE) {
        let sibling = el;
        let index = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName === el.nodeName) index++;
        }
        parts.unshift(`${el.nodeName.toLowerCase()}['${index}']`);
        el = el.parentNode;
      }
      return "/" + parts.join("/");
    }

    openModal() {
      if (!this.targetElement) return;

      const el = this.targetElement;
      
      // Fill data
      let tagClasses = el.tagName.toLowerCase();
      if (el.className && typeof el.className === "string") {
        tagClasses += "." + el.className.split(" ").filter(Boolean).join(".");
      }
      this.infoTag.textContent = tagClasses;
      
      const reactName = this.getReactComponentName(el);
      this.infoReact.textContent = reactName ? `<${reactName} />` : "Not Found (Native Element)";
      
      this.infoXpath.textContent = this.getXPath(el);
      this.promptInput.value = "";
      
      this.modal.classList.add("visible");
      setTimeout(() => this.promptInput.focus(), 100);
    }

    closeModal() {
      this.modal.classList.remove("visible");
      this.highlighter.style.display = "none";
    }

    async copyPrompt() {
      const prompt = `
<TargetElement>
Tag/Classes: ${this.infoTag.textContent}
React Component: ${this.infoReact.textContent}
XPath: ${this.infoXpath.textContent}
</TargetElement>

<ChangeRequest>
${this.promptInput.value}
</ChangeRequest>
`.trim();

      try {
        await navigator.clipboard.writeText(prompt);
        this.copyBtn.textContent = "Copied!";
        this.copyBtn.classList.add("copied");
        setTimeout(() => {
          this.copyBtn.textContent = "Copy Prompt";
          this.copyBtn.classList.remove("copied");
          this.closeModal();
        }, 1500);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  }

  customElements.define("agent-inspector", AgentInspector);
  document.body.appendChild(document.createElement("agent-inspector"));
})();
