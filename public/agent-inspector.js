(() => {
  if (
    typeof window === "undefined" ||
    (window.location.hostname !== "localhost" && 
     window.location.hostname !== "127.0.0.1" && 
     !window.location.hostname.endsWith(".local") &&
     !window.location.hostname.startsWith("192.168."))
  ) {
    return;
  }
  if (window.__AGENT_INSPECTOR_INIT__) return;
  window.__AGENT_INSPECTOR_INIT__ = true;

  // --- STYLES FOR SHADOW DOM ---
  const styles = `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color-scheme: dark;
    }

    * {
      box-sizing: border-box;
    }

    /* Floating Action Pill / Dock */
    #agent-dock {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(15, 17, 26, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(139, 92, 246, 0.35);
      padding: 6px 12px;
      border-radius: 9999px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 16px rgba(124, 58, 237, 0.25);
      z-index: 999999;
      cursor: pointer;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #agent-dock:hover {
      transform: translateY(-2px) scale(1.02);
      border-color: rgba(168, 85, 247, 0.6);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(139, 92, 246, 0.4);
    }

    #agent-dock.inspecting {
      background: rgba(220, 38, 38, 0.9);
      border-color: rgba(248, 113, 113, 0.8);
      animation: pulse-border 1.8s infinite;
    }

    @keyframes pulse-border {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
      70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    .dock-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: white;
    }

    #agent-dock.inspecting .dock-icon {
      background: white;
      color: #dc2626;
    }

    .dock-label {
      font-size: 13px;
      font-weight: 600;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dock-shortcut {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      color: #cbd5e1;
      letter-spacing: 0.5px;
    }

    @media (max-width: 640px) {
      #agent-dock {
        bottom: 14px;
        right: 14px;
        padding: 6px 10px;
      }
      .dock-shortcut {
        display: none;
      }
    }

    /* Modal / Inspector Dialog */
    #agent-modal {
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 580px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 48px);
      background: #0f111a;
      color: #e2e8f0;
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7), 0 0 32px rgba(124, 58, 237, 0.18);
      z-index: 999999;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: modal-enter 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #agent-modal:not(.visible) {
      display: none !important;
    }

    @keyframes modal-enter {
      from {
        opacity: 0;
        transform: translate(-50%, -46%) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }

    /* Modal Header & Drag Bar */
    .modal-header {
      background: #141724;
      padding: 14px 18px;
      border-bottom: 1px solid #1e2235;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: grab;
      user-select: none;
    }

    .modal-header:active {
      cursor: grabbing;
    }

    .modal-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .modal-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(139, 92, 246, 0.18);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .modal-title {
      font-size: 15px;
      font-weight: 700;
      color: #f8fafc;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #f8fafc;
    }

    /* Modal Scrollable Body */
    .modal-body {
      padding: 16px 18px;
      overflow-y: auto;
      max-height: calc(85vh - 150px);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .modal-body::-webkit-scrollbar {
      width: 6px;
    }
    .modal-body::-webkit-scrollbar-thumb {
      background: #272c42;
      border-radius: 3px;
    }

    /* Breadcrumbs Navigation Bar */
    .breadcrumb-container {
      background: #151827;
      border: 1px solid #232840;
      border-radius: 10px;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .breadcrumb-label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .breadcrumb-trail {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
    }

    .crumb-pill {
      background: #1e2237;
      color: #cbd5e1;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #2e3452;
      cursor: pointer;
      transition: all 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .crumb-pill:hover {
      background: #2e3452;
      color: #f8fafc;
      border-color: #6366f1;
    }

    .crumb-pill.active {
      background: rgba(139, 92, 246, 0.25);
      color: #e9d5ff;
      border-color: #a855f7;
      font-weight: 700;
    }

    .crumb-separator {
      color: #475569;
      font-size: 11px;
    }

    /* Element Overview Grid */
    .element-specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    @media (max-width: 520px) {
      .element-specs-grid {
        grid-template-columns: 1fr;
      }
    }

    .spec-card {
      background: #141724;
      border: 1px solid #1f2338;
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .spec-card.full-width {
      grid-column: 1 / -1;
    }

    .spec-title {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .spec-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px;
      color: #38bdf8;
      word-break: break-all;
      background: #0b0d14;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #191c2b;
      max-height: 80px;
      overflow-y: auto;
    }

    .spec-value.react-component {
      color: #c084fc;
      font-weight: 700;
    }

    .spec-value.source-file {
      color: #34d399;
    }

    .spec-value.text-preview {
      color: #fcd34d;
      font-family: inherit;
      white-space: pre-wrap;
    }

    /* Tabs / Detail Toggle */
    .tabs-bar {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid #1e2235;
      padding-bottom: 8px;
      margin-top: 4px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .tab-btn:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.05);
    }

    .tab-btn.active {
      color: #a855f7;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .tab-content {
      display: none;
      background: #141724;
      border: 1px solid #1f2338;
      border-radius: 10px;
      padding: 10px 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
      color: #cbd5e1;
      max-height: 120px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .tab-content.visible {
      display: block;
    }

    /* Quick Prompt Presets */
    .presets-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .presets-label {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .presets-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .preset-chip {
      background: #171b2b;
      border: 1px solid #252a42;
      color: #cbd5e1;
      font-size: 11.5px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
    }

    .preset-chip:hover {
      background: #252b45;
      color: #f8fafc;
      border-color: #8b5cf6;
      transform: translateY(-1px);
    }

    /* Prompt Textarea */
    .prompt-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .prompt-label {
      font-size: 12px;
      font-weight: 600;
      color: #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .prompt-label span {
      font-size: 11px;
      font-weight: normal;
      color: #64748b;
    }

    textarea#prompt-input {
      width: 100%;
      height: 90px;
      background: #0b0d14;
      border: 1px solid #232840;
      border-radius: 8px;
      color: #f8fafc;
      padding: 10px 12px;
      font-family: inherit;
      font-size: 13px;
      line-height: 1.5;
      resize: vertical;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    textarea#prompt-input:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
    }

    /* Footer Buttons */
    .modal-footer {
      padding: 12px 18px;
      background: #141724;
      border-top: 1px solid #1e2235;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #64748b;
    }

    .btn-group {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.18s;
    }

    .btn-ghost {
      background: transparent;
      color: #94a3b8;
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #f8fafc;
    }

    .btn-locate {
      background: #1e2438;
      color: #38bdf8;
      border: 1px solid #2a3454;
    }

    .btn-locate:hover {
      background: #27304f;
      color: #7dd3fc;
      border-color: #38bdf8;
    }

    .btn-primary {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.45);
    }

    .btn-primary.copied {
      background: #10b981;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
    }
  `;

  // --- HTML TEMPLATE ---
  const template = document.createElement("template");
  template.innerHTML = `
    <style>${styles}</style>
    
    <!-- Floating Dock -->
    <div id="agent-dock" title="Agent Element Inspector (Alt+I)">
      <div class="dock-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 21 9-9"></path>
          <path d="M12.2 9.8l2 2"></path>
          <path d="M15 4V2"></path>
          <path d="M15 16v-2"></path>
          <path d="M8 9h2"></path>
          <path d="M20 9h2"></path>
          <path d="m17.8 11.8 1.4 1.4"></path>
          <path d="m10.6 6.2 1.4 1.4"></path>
          <path d="m17.8 6.2-1.4 1.4"></path>
          <path d="m10.6 11.8-1.4-1.4"></path>
        </svg>
      </div>
      <div class="dock-label" id="dock-label">
        Inspect Element
        <span class="dock-shortcut">Alt+I</span>
      </div>
    </div>

    <!-- Inspector Modal -->
    <div id="agent-modal">
      <div class="modal-header" id="modal-drag-bar">
        <div class="modal-title-wrap">
          <span class="modal-badge">Agentation 2.0</span>
          <h3 class="modal-title">Element Context & Prompt</h3>
        </div>
        <div class="header-actions">
          <button class="icon-btn" id="btn-flash" title="Locate on page">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="22" y1="12" x2="18" y2="12"></line>
              <line x1="6" y1="12" x2="2" y2="12"></line>
              <line x1="12" y1="6" x2="12" y2="2"></line>
              <line x1="12" y1="22" x2="12" y2="18"></line>
            </svg>
          </button>
          <button class="icon-btn" id="btn-close" title="Close (Esc)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="modal-body">
        <!-- Interactive Breadcrumbs -->
        <div class="breadcrumb-container">
          <div class="breadcrumb-label">
            <span>DOM / Component Hierarchy</span>
            <span style="font-size:10px; color:#94a3b8;">Click any node to re-target</span>
          </div>
          <div class="breadcrumb-trail" id="breadcrumb-trail"></div>
        </div>

        <!-- Element Specs Grid -->
        <div class="element-specs-grid">
          <div class="spec-card">
            <div class="spec-title">React Component</div>
            <div class="spec-value react-component" id="spec-react">Detecting...</div>
          </div>
          <div class="spec-card">
            <div class="spec-title">Source File</div>
            <div class="spec-value source-file" id="spec-source">Searching fiber...</div>
          </div>
          <div class="spec-card">
            <div class="spec-title">Tag & Dimensions</div>
            <div class="spec-value" id="spec-tag-dim">-</div>
          </div>
          <div class="spec-card">
            <div class="spec-title">Viewport / Breakpoint</div>
            <div class="spec-value" id="spec-viewport">-</div>
          </div>
          <div class="spec-card full-width">
            <div class="spec-title">Classes / Selectors</div>
            <div class="spec-value" id="spec-classes">-</div>
          </div>
          <div class="spec-card full-width">
            <div class="spec-title">Text Content Preview</div>
            <div class="spec-value text-preview" id="spec-text">-</div>
          </div>
        </div>

        <!-- Detail Tabs -->
        <div class="tabs-bar">
          <button class="tab-btn active" data-tab="tab-styles">Computed Styles</button>
          <button class="tab-btn" data-tab="tab-html">HTML Snippet</button>
          <button class="tab-btn" data-tab="tab-xpath">XPath & Selectors</button>
          <button class="tab-btn" data-tab="tab-props">Component Props</button>
        </div>

        <div class="tab-content visible" id="tab-styles"></div>
        <div class="tab-content" id="tab-html"></div>
        <div class="tab-content" id="tab-xpath"></div>
        <div class="tab-content" id="tab-props"></div>

        <!-- Quick Action Prompt Chips -->
        <div class="presets-container">
          <div class="presets-label">Quick Action Presets (Click to insert):</div>
          <div class="presets-chips">
            <button class="preset-chip" data-prefix="🎨 Restyle: Update colors, font sizes, and spacing to be ">🎨 Restyle</button>
            <button class="preset-chip" data-prefix="📱 Responsive: Fix layout, alignment, and wrapping on mobile/tablet screens for this element. ">📱 Responsive</button>
            <button class="preset-chip" data-prefix="✨ Animation: Add smooth hover, focus-visible, and transition effects to ">✨ Animations</button>
            <button class="preset-chip" data-prefix="♿ A11y: Improve accessibility, add missing ARIA labels/roles, and contrast for ">♿ Accessibility</button>
            <button class="preset-chip" data-prefix="🐛 Fix Layout: Fix overflow, clipping, or flex alignment issue where ">🐛 Fix Layout</button>
            <button class="preset-chip" data-prefix="🔄 Refactor: Clean up this component into a dedicated reusable component with props for ">🔄 Refactor</button>
          </div>
        </div>

        <!-- Prompt Textarea -->
        <div class="prompt-section">
          <div class="prompt-label">
            <span>What change should the AI Agent make?</span>
            <span>Markdown formatted for IDE</span>
          </div>
          <textarea id="prompt-input" placeholder="e.g. Change the background to dark slate, add 8px padding, and make the icon rotate on hover..."></textarea>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <div class="footer-left">
          <span>Shortcuts: <b>Alt+I</b> to toggle · <b>↑/↓</b> parent/child · <b>Esc</b> cancel</span>
        </div>
        <div class="btn-group">
          <button class="btn btn-ghost" id="btn-cancel">Cancel</button>
          <button class="btn btn-locate" id="btn-locate">Locate Element</button>
          <button class="btn btn-primary" id="btn-copy">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy Prompt
          </button>
        </div>
      </div>
    </div>
  `;

  // --- AGENT INSPECTOR CUSTOM ELEMENT ---
  class AgentInspector extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.isInspecting = false;
      this.targetElement = null;
      this.cachedData = null;

      // Highlighter element with floating live tooltip badge
      this.highlighter = document.createElement("div");
      this.highlighter.id = "agent-inspector-highlighter";
      Object.assign(this.highlighter.style, {
        position: "fixed",
        pointerEvents: "none",
        zIndex: "999998",
        border: "2px solid #8b5cf6",
        background: "rgba(139, 92, 246, 0.14)",
        boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.25), 0 0 16px rgba(139, 92, 246, 0.35)",
        display: "none",
        transition: "all 0.08s cubic-bezier(0.16, 1, 0.3, 1)",
        borderRadius: "4px"
      });

      this.tooltip = document.createElement("div");
      this.tooltip.id = "agent-inspector-tooltip";
      Object.assign(this.tooltip.style, {
        position: "absolute",
        bottom: "calc(100% + 6px)",
        left: "0",
        background: "#0f111a",
        color: "#f8fafc",
        padding: "4px 8px",
        borderRadius: "6px",
        border: "1px solid #313244",
        fontSize: "11px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        pointerEvents: "none",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        zIndex: "999999"
      });
      this.highlighter.appendChild(this.tooltip);
      document.body.appendChild(this.highlighter);

      // Flash highlight effect element
      this.flashOverlay = document.createElement("div");
      this.flashOverlay.id = "agent-inspector-flash";
      Object.assign(this.flashOverlay.style, {
        position: "fixed",
        pointerEvents: "none",
        zIndex: "999998",
        border: "2px solid #38bdf8",
        background: "rgba(56, 189, 248, 0.25)",
        boxShadow: "0 0 24px rgba(56, 189, 248, 0.6)",
        display: "none",
        borderRadius: "4px",
        transition: "opacity 0.4s ease-out"
      });
      document.body.appendChild(this.flashOverlay);

      // Cache DOM references inside Shadow DOM
      this.dock = this.shadowRoot.getElementById("agent-dock");
      this.dockLabel = this.shadowRoot.getElementById("dock-label");
      this.modal = this.shadowRoot.getElementById("agent-modal");
      this.dragBar = this.shadowRoot.getElementById("modal-drag-bar");
      this.btnClose = this.shadowRoot.getElementById("btn-close");
      this.btnCancel = this.shadowRoot.getElementById("btn-cancel");
      this.btnLocate = this.shadowRoot.getElementById("btn-locate");
      this.btnFlash = this.shadowRoot.getElementById("btn-flash");
      this.btnCopy = this.shadowRoot.getElementById("btn-copy");
      this.promptInput = this.shadowRoot.getElementById("prompt-input");
      
      this.breadcrumbTrail = this.shadowRoot.getElementById("breadcrumb-trail");
      this.specReact = this.shadowRoot.getElementById("spec-react");
      this.specSource = this.shadowRoot.getElementById("spec-source");
      this.specTagDim = this.shadowRoot.getElementById("spec-tag-dim");
      this.specViewport = this.shadowRoot.getElementById("spec-viewport");
      this.specClasses = this.shadowRoot.getElementById("spec-classes");
      this.specText = this.shadowRoot.getElementById("spec-text");

      // Bind methods
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleWindowResize = this.handleWindowResize.bind(this);

      this.bindEvents();
      this.setupDraggableModal();
    }

    bindEvents() {
      this.dock.addEventListener("click", () => this.toggleInspect());
      this.btnClose.addEventListener("click", () => this.closeModal());
      this.btnCancel.addEventListener("click", () => this.closeModal());
      this.btnLocate.addEventListener("click", () => this.flashTargetElement());
      this.btnFlash.addEventListener("click", () => this.flashTargetElement());
      this.btnCopy.addEventListener("click", () => this.copyPrompt());

      // Global keyboard shortcut: Alt + I to toggle inspect anywhere
      window.addEventListener("keydown", (e) => {
        if ((e.altKey && (e.code === "KeyI" || e.key.toLowerCase() === "i")) && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.toggleInspect();
        }
      });

      // Quick Action Preset Chips
      this.shadowRoot.querySelectorAll(".preset-chip").forEach((chip) => {
        chip.addEventListener("click", (e) => {
          const prefix = chip.getAttribute("data-prefix") || "";
          const curr = this.promptInput.value.trim();
          if (curr) {
            this.promptInput.value = `${prefix}\n\n${curr}`;
          } else {
            this.promptInput.value = prefix;
          }
          this.promptInput.focus();
        });
      });

      // Tabs switching
      this.shadowRoot.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.shadowRoot.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
          this.shadowRoot.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("visible"));

          btn.classList.add("active");
          const targetId = btn.getAttribute("data-tab");
          const targetContent = this.shadowRoot.getElementById(targetId);
          if (targetContent) targetContent.classList.add("visible");
        });
      });

      window.addEventListener("resize", this.handleWindowResize);
    }

    setupDraggableModal() {
      let isDragging = false;
      let startX = 0, startY = 0;
      let startLeft = 0, startTop = 0;

      this.dragBar.addEventListener("mousedown", (e) => {
        if (e.target.closest(".icon-btn")) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = this.modal.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        // Reset transform to absolute positioning
        this.modal.style.transform = "none";
        this.modal.style.left = startLeft + "px";
        this.modal.style.top = startTop + "px";

        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          let newLeft = Math.max(10, Math.min(window.innerWidth - rect.width - 10, startLeft + dx));
          let newTop = Math.max(10, Math.min(window.innerHeight - rect.height - 10, startTop + dy));
          this.modal.style.left = newLeft + "px";
          this.modal.style.top = newTop + "px";
        };

        const onMouseUp = () => {
          isDragging = false;
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      });
    }

    toggleInspect() {
      this.isInspecting = !this.isInspecting;
      if (this.isInspecting) {
        this.startInspect();
      } else {
        this.stopInspect();
      }
    }

    startInspect() {
      this.isInspecting = true;
      this.dock.classList.add("inspecting");
      this.dockLabel.innerHTML = `Inspecting... <span class="dock-shortcut">Esc to stop</span>`;
      this.closeModal();

      document.addEventListener("mousemove", this.handleMouseMove, true);
      document.addEventListener("click", this.handleClick, true);
      document.addEventListener("keydown", this.handleKeyDown, true);
      document.body.style.cursor = "crosshair";
    }

    stopInspect() {
      this.isInspecting = false;
      this.dock.classList.remove("inspecting");
      this.dockLabel.innerHTML = `Inspect Element <span class="dock-shortcut">Alt+I</span>`;
      this.highlighter.style.display = "none";

      document.removeEventListener("mousemove", this.handleMouseMove, true);
      document.removeEventListener("click", this.handleClick, true);
      document.removeEventListener("keydown", this.handleKeyDown, true);
      document.body.style.cursor = "default";
    }

    handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        this.stopInspect();
        this.closeModal();
        return;
      }

      // Hierarchy navigation while inspecting or selecting
      if (this.isInspecting && this.targetElement) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (this.targetElement.parentElement && this.targetElement.parentElement !== document.body) {
            this.targetElement = this.targetElement.parentElement;
            this.updateHighlighter(this.targetElement);
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (this.targetElement.firstElementChild) {
            this.targetElement = this.targetElement.firstElementChild;
            this.updateHighlighter(this.targetElement);
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          this.stopInspect();
          this.openModal(this.targetElement);
        }
      }
    }

    handleMouseMove(e) {
      if (!this.isInspecting) return;
      if (e.composedPath().includes(this)) return;

      const target = e.target;
      if (target && target !== this.highlighter && target !== this.flashOverlay) {
        this.targetElement = target;
        this.updateHighlighter(target);
      }
    }

    updateHighlighter(el) {
      if (!el || typeof el.getBoundingClientRect !== "function") return;
      const rect = el.getBoundingClientRect();

      this.highlighter.style.display = "block";
      this.highlighter.style.top = rect.top + "px";
      this.highlighter.style.left = rect.left + "px";
      this.highlighter.style.width = rect.width + "px";
      this.highlighter.style.height = rect.height + "px";

      // Live tooltip positioning
      if (rect.top < 36) {
        this.tooltip.style.bottom = "auto";
        this.tooltip.style.top = "calc(100% + 6px)";
      } else {
        this.tooltip.style.top = "auto";
        this.tooltip.style.bottom = "calc(100% + 6px)";
      }

      // Quick preview in tooltip
      const reactData = this.getReactData(el);
      const tag = el.tagName.toLowerCase();
      const firstClass = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/)[0] : "";
      const compLabel = reactData.name ? `<span style="color:#c084fc">&lt;${reactData.name} /&gt;</span>` : "";
      const dimLabel = `<span style="color:#94a3b8">${Math.round(rect.width)}×${Math.round(rect.height)}</span>`;
      
      this.tooltip.innerHTML = `${compLabel ? compLabel + " · " : ""}<span style="color:#38bdf8">${tag}${firstClass}</span> · ${dimLabel}`;
    }

    handleClick(e) {
      if (!this.isInspecting) return;
      if (e.composedPath().includes(this)) return;

      e.preventDefault();
      e.stopPropagation();

      const el = this.targetElement || e.target;
      this.stopInspect();
      this.openModal(el);
    }

    handleWindowResize() {
      if (this.targetElement && this.highlighter.style.display !== "none") {
        this.updateHighlighter(this.targetElement);
      }
    }

    flashTargetElement() {
      if (!this.targetElement) return;
      const rect = this.targetElement.getBoundingClientRect();
      
      // Scroll into view if offscreen
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        this.targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const updatedRect = this.targetElement.getBoundingClientRect();
      Object.assign(this.flashOverlay.style, {
        display: "block",
        top: updatedRect.top + "px",
        left: updatedRect.left + "px",
        width: updatedRect.width + "px",
        height: updatedRect.height + "px",
        opacity: "1"
      });

      setTimeout(() => {
        this.flashOverlay.style.opacity = "0";
        setTimeout(() => {
          this.flashOverlay.style.display = "none";
        }, 400);
      }, 800);
    }

    // --- DEEP REACT FIBER INSPECTION ---
    getReactData(el) {
      if (!el) return { name: null, hierarchy: [], source: null, props: {} };

      const fiberKey = Object.keys(el).find(
        (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")
      );
      if (!fiberKey) return { name: null, hierarchy: [], source: null, props: {} };

      let fiber = el[fiberKey];
      const hierarchy = [];
      let source = null;
      let leafComponent = null;
      const componentProps = {};

      const extractComponentName = (f) => {
        if (!f || !f.type) return null;
        const t = f.type;
        if (typeof t === "string") return null;
        if (typeof t === "function") return t.displayName || t.name || null;
        if (typeof t === "object") {
          // forwardRef
          if (t.$$typeof && String(t.$$typeof).includes("react.forward_ref")) {
            return t.displayName || t.render?.displayName || t.render?.name || "ForwardRef";
          }
          // memo
          if (t.$$typeof && String(t.$$typeof).includes("react.memo")) {
            return t.displayName || (t.type && (t.type.displayName || t.type.name)) || "Memo";
          }
          // provider
          if (t.$$typeof && String(t.$$typeof).includes("react.provider")) {
            return (t._context?.displayName || "Context") + ".Provider";
          }
          if (t.name) return t.name;
          if (t.displayName) return t.displayName;
        }
        return null;
      };

      const extractSource = (f) => {
        if (!f) return null;
        if (f._debugSource) {
          const { fileName, lineNumber, columnNumber } = f._debugSource;
          const clean = fileName.replace(/\\/g, "/");
          const relMatch = clean.match(/(?:src\/|app\/|components\/|features\/|visualizers\/|lib\/).*/i);
          const path = relMatch ? relMatch[0] : clean;
          return {
            path,
            line: lineNumber,
            column: columnNumber,
            formatted: `${path}:${lineNumber}`
          };
        }
        if (f._debugOwner && f._debugOwner._debugSource) {
          return extractSource(f._debugOwner);
        }
        return null;
      };

      let curr = fiber;
      while (curr) {
        const name = extractComponentName(curr);
        if (name && !hierarchy.includes(name)) {
          hierarchy.push(name);
          if (!leafComponent) {
            leafComponent = name;
            source = extractSource(curr);
            const props = curr.memoizedProps || curr.pendingProps || {};
            for (const [k, v] of Object.entries(props)) {
              if (["children", "style", "ref"].includes(k)) continue;
              if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
                componentProps[k] = v;
              } else if (Array.isArray(v) && v.length <= 5) {
                try { componentProps[k] = JSON.stringify(v); } catch (_) {}
              }
            }
          }
        }
        if (!source) {
          source = extractSource(curr);
        }
        curr = curr.return;
      }

      return {
        name: leafComponent,
        hierarchy: hierarchy.reverse(),
        source,
        props: componentProps
      };
    }

    // --- DOM & STYLE METRICS EXTRACTION ---
    getXPath(el) {
      if (el.id) return `//*[@id="${el.id}"]`;
      const parts = [];
      let curr = el;
      while (curr && curr.nodeType === Node.ELEMENT_NODE) {
        let index = 1;
        let sibling = curr.previousElementSibling;
        while (sibling) {
          if (sibling.nodeName === curr.nodeName) index++;
          sibling = sibling.previousElementSibling;
        }
        parts.unshift(`${curr.nodeName.toLowerCase()}[${index}]`);
        curr = curr.parentNode;
      }
      return "/" + parts.join("/");
    }

    getUniqueSelector(el) {
      if (el.id) return `#${el.id}`;
      const path = [];
      let curr = el;
      while (curr && curr.nodeType === Node.ELEMENT_NODE && curr !== document.body && curr !== document.documentElement) {
        let selector = curr.tagName.toLowerCase();
        if (curr.id) {
          selector += `#${curr.id}`;
          path.unshift(selector);
          break;
        } else if (typeof curr.className === "string" && curr.className.trim()) {
          const classes = curr.className.trim().split(/\s+/).slice(0, 3).join(".");
          selector += `.${classes}`;
        }
        path.unshift(selector);
        curr = curr.parentElement;
      }
      return path.join(" > ");
    }

    getComputedDetails(el) {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      return {
        dimensions: `${Math.round(rect.width)}px × ${Math.round(rect.height)}px`,
        display: computed.display,
        flexDirection: computed.flexDirection,
        justifyContent: computed.justifyContent,
        alignItems: computed.alignItems,
        gap: computed.gap,
        gridTemplateColumns: computed.gridTemplateColumns !== "none" ? computed.gridTemplateColumns : null,
        position: computed.position,
        zIndex: computed.zIndex,
        padding: `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`,
        margin: `${computed.marginTop} ${computed.marginRight} ${computed.marginBottom} ${computed.marginLeft}`,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        borderRadius: computed.borderRadius
      };
    }

    getBreakpoint() {
      const w = window.innerWidth;
      if (w < 640) return "xs (<640px Mobile)";
      if (w < 768) return "sm (640px Tablet)";
      if (w < 1024) return "md (768px Tablet)";
      if (w < 1280) return "lg (1024px Desktop)";
      if (w < 1536) return "xl (1280px Desktop)";
      return "2xl (1536px+ Ultrawide)";
    }

    getCleanOuterHTML(el) {
      const clone = el.cloneNode(true);
      // Remove any internal agent inspector markers
      clone.querySelectorAll("#agent-inspector-highlighter, #agent-dock, #agent-modal").forEach((n) => n.remove());
      
      // If HTML is huge, truncate inner children to keep prompt manageable
      if (clone.children.length > 4) {
        const first = clone.children[0].outerHTML;
        const last = clone.children[clone.children.length - 1].outerHTML;
        clone.innerHTML = `\n  ${first}\n  <!-- ... ${clone.children.length - 2} intermediate children ... -->\n  ${last}\n`;
      }
      let html = clone.outerHTML;
      if (html.length > 600) {
        html = html.substring(0, 600) + "\n<!-- truncated -->";
      }
      return html;
    }

    // --- POPULATE MODAL & UI ---
    openModal(el) {
      if (!el) return;
      this.targetElement = el;

      // Extract complete telemetry
      const reactData = this.getReactData(el);
      const computed = this.getComputedDetails(el);
      const xpath = this.getXPath(el);
      const selector = this.getUniqueSelector(el);
      const outerHTML = this.getCleanOuterHTML(el);
      const breakpoint = this.getBreakpoint();
      const theme = document.documentElement.classList.contains("dark") ? "Dark Mode" : "Light Mode";

      // Classes
      const classStr = typeof el.className === "string" ? el.className.trim() : (el.className?.baseVal || "");
      const tagWithClasses = `${el.tagName.toLowerCase()}${classStr ? "." + classStr.split(/\s+/).join(".") : ""}`;

      // Text content preview
      let textContent = (el.innerText || el.textContent || "").trim();
      if (textContent.length > 200) {
        textContent = textContent.substring(0, 200) + "...";
      }
      if (!textContent && (el.value || el.placeholder)) {
        textContent = `value: "${el.value || ""}" | placeholder: "${el.placeholder || ""}"`;
      }

      this.cachedData = {
        element: el,
        tag: el.tagName.toLowerCase(),
        classes: classStr,
        tagWithClasses,
        react: reactData,
        computed,
        xpath,
        selector,
        outerHTML,
        breakpoint,
        theme,
        textContent,
        route: window.location.pathname + window.location.search,
        viewport: `${window.innerWidth} × ${window.innerHeight} px`
      };

      // Populate UI Fields
      this.specReact.textContent = reactData.name ? `<${reactData.name} />` : "Not Found (Native HTML)";
      this.specSource.textContent = reactData.source ? reactData.source.formatted : "Search by component name";
      this.specTagDim.textContent = `${el.tagName.toLowerCase()} · ${computed.dimensions}`;
      this.specViewport.textContent = `${breakpoint} · ${theme}`;
      this.specClasses.textContent = classStr || "(none)";
      this.specText.textContent = textContent ? `"${textContent}"` : "(none / icon / container)";

      // Build Interactive Breadcrumbs
      this.renderBreadcrumbs(el, reactData);

      // Populate Tabs
      this.populateTabs();

      // Reset and display modal
      this.modal.classList.add("visible");
      this.modal.style.transform = "translate(-50%, -50%)";
      this.modal.style.top = "50%";
      this.modal.style.left = "50%";
      this.promptInput.value = "";
      setTimeout(() => this.promptInput.focus(), 150);

      // Flash target once so user has full visual clarity
      this.flashTargetElement();
    }

    renderBreadcrumbs(el, reactData) {
      this.breadcrumbTrail.innerHTML = "";

      // Combine React hierarchy with DOM ancestors
      const crumbs = [];

      // React component chain
      if (reactData.hierarchy && reactData.hierarchy.length > 0) {
        reactData.hierarchy.forEach((compName) => {
          crumbs.push({ label: `<${compName}>`, isReact: true, target: el });
        });
      }

      // DOM hierarchy chain up to 4 parents
      const domChain = [];
      let p = el;
      while (p && p !== document.body && p !== document.documentElement && domChain.length < 5) {
        domChain.unshift(p);
        p = p.parentElement;
      }

      domChain.forEach((domNode, idx) => {
        const tag = domNode.tagName.toLowerCase();
        const id = domNode.id ? `#${domNode.id}` : "";
        const firstCls = typeof domNode.className === "string" && domNode.className.trim()
          ? "." + domNode.className.trim().split(/\s+/)[0]
          : "";
        crumbs.push({
          label: `${tag}${id || firstCls}`,
          isReact: false,
          target: domNode,
          isCurrent: domNode === el
        });
      });

      crumbs.forEach((c, idx) => {
        if (idx > 0) {
          const sep = document.createElement("span");
          sep.className = "crumb-separator";
          sep.textContent = "›";
          this.breadcrumbTrail.appendChild(sep);
        }

        const pill = document.createElement("button");
        pill.className = `crumb-pill ${c.isCurrent ? "active" : ""}`;
        pill.textContent = c.label;
        pill.title = c.isReact ? `React Component: ${c.label}` : `Click to re-target ${c.label}`;
        
        pill.addEventListener("click", () => {
          if (c.target && c.target !== this.targetElement) {
            this.openModal(c.target);
          }
        });

        this.breadcrumbTrail.appendChild(pill);
      });
    }

    populateTabs() {
      const d = this.cachedData;
      if (!d) return;

      // Styles tab
      const stylesContent = this.shadowRoot.getElementById("tab-styles");
      stylesContent.textContent = [
        `Dimensions: ${d.computed.dimensions}`,
        `Display: ${d.computed.display}${d.computed.flexDirection ? ` (direction: ${d.computed.flexDirection}, gap: ${d.computed.gap})` : ""}`,
        `Padding: ${d.computed.padding}`,
        `Margin: ${d.computed.margin}`,
        `Typography: ${d.computed.fontSize} / ${d.computed.lineHeight} (weight: ${d.computed.fontWeight})`,
        `Colors: text: ${d.computed.color} | bg: ${d.computed.backgroundColor}`,
        `Border Radius: ${d.computed.borderRadius}`,
        `Position: ${d.computed.position} (z-index: ${d.computed.zIndex})`
      ].join("\n");

      // HTML tab
      const htmlContent = this.shadowRoot.getElementById("tab-html");
      htmlContent.textContent = d.outerHTML;

      // XPath & Selectors tab
      const xpathContent = this.shadowRoot.getElementById("tab-xpath");
      xpathContent.textContent = [
        `CSS Selector:`,
        `  ${d.selector}`,
        ``,
        `XPath:`,
        `  ${d.xpath}`,
        ``,
        `Full Tag & Classes:`,
        `  ${d.tagWithClasses}`
      ].join("\n");

      // Component Props tab
      const propsContent = this.shadowRoot.getElementById("tab-props");
      if (d.react.props && Object.keys(d.react.props).length > 0) {
        propsContent.textContent = JSON.stringify(d.react.props, null, 2);
      } else {
        propsContent.textContent = "// No explicit simple props detected on leaf fiber.\n// Inspect the component file in IDE.";
      }
    }

    closeModal() {
      this.modal.classList.remove("visible");
      this.highlighter.style.display = "none";
      this.flashOverlay.style.display = "none";
    }

    // --- ULTRA-INFORMATIVE PROMPT FOR AI CODING AGENT ---
    async copyPrompt() {
      if (!this.cachedData) return;
      const d = this.cachedData;
      const userPrompt = this.promptInput.value.trim() || "Please inspect this element and recommend or apply requested adjustments.";

      // Structured Markdown prompt engineered for AI comprehension
      const promptMarkdown = `
### 🎯 Target UI Element Context (Captured via Agent Inspector)

**User Change Request:**
> ${userPrompt}

---

#### 🧩 React Component & Location
- **Target React Component:** \`<${d.react.name || "NativeElement"}>\`
${d.react.hierarchy.length > 0 ? `- **Component Ancestry:** \`<${d.react.hierarchy.join("> › <")}>\`` : ""}
${d.react.source ? `- **Source File:** \`${d.react.source.formatted}\`` : "- **Source File Hint:** Search codebase for component `<" + (d.react.name || d.tag) + "`"}
${Object.keys(d.react.props).length > 0 ? `- **Component Props:** \`${JSON.stringify(d.react.props)}\`` : ""}

#### 🏷️ Element Identity & Selectors
- **Tag & Classes:** \`${d.tagWithClasses}\`
- **Tailwind Classes:** \`${d.classes || "(none)"}\`
- **Unique CSS Selector:** \`${d.selector}\`
- **XPath:** \`${d.xpath}\`
${d.textContent ? `- **Text Content / Value:** \`"${d.textContent}"\`` : ""}

#### 📐 Dimensions & Computed Styles
- **Bounding Box:** \`${d.computed.dimensions}\`
- **Display & Flow:** \`${d.computed.display}\`${d.computed.flexDirection ? ` (\`flex-direction: ${d.computed.flexDirection}\`, \`gap: ${d.computed.gap}\`)` : ""}
- **Spacing:** \`padding: ${d.computed.padding}\` | \`margin: ${d.computed.margin}\`
- **Typography:** \`font-size: ${d.computed.fontSize}\`, \`weight: ${d.computed.fontWeight}\`
- **Colors:** \`text: ${d.computed.color}\` | \`bg: ${d.computed.backgroundColor}\`

#### 🌐 Environment & Viewport
- **Current Route:** \`${d.route}\`
- **Viewport:** \`${d.viewport}\` (\`${d.breakpoint}\`)
- **Active Theme:** \`${d.theme}\`

#### 💻 HTML Snippet
\`\`\`html
${d.outerHTML}
\`\`\`

---
💡 **Agent Instructions:** Locate the relevant file using the React component name \`<${d.react.name || d.tag}>\` or text content \`"${d.textContent ? d.textContent.slice(0, 40) : ""}"\` and execute the user's change request accurately.
`.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(promptMarkdown);
        } else {
          // Fallback for non-secure / local network
          const tempArea = document.createElement("textarea");
          tempArea.value = promptMarkdown;
          document.body.appendChild(tempArea);
          tempArea.select();
          document.execCommand("copy");
          document.body.removeChild(tempArea);
        }

        const originalText = this.btnCopy.innerHTML;
        this.btnCopy.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied to Clipboard!
        `;
        this.btnCopy.classList.add("copied");

        setTimeout(() => {
          this.btnCopy.innerHTML = originalText;
          this.btnCopy.classList.remove("copied");
          this.closeModal();
        }, 1400);
      } catch (err) {
        console.error("Failed to copy prompt to clipboard", err);
      }
    }
  }

  // Register Custom Element
  customElements.define("agent-inspector", AgentInspector);
  document.body.appendChild(document.createElement("agent-inspector"));
})();
