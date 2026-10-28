type WireframeBoardProps = {
  navigate: (page: string) => void;
};

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flow-arrow">
      <span>{label}</span>
      <svg viewBox="0 0 120 20" aria-hidden="true">
        <path d="M2 10h110M104 3l9 7-9 7" />
      </svg>
    </div>
  );
}

function RouteBar({ route, back }: { route: string; back?: string }) {
  return (
    <div className="wf-routebar">
      <span className="wf-route-back">{back ? `← ${back}` : "BlockCAD"}</span>
      <code>{route}</code>
    </div>
  );
}

function LoginWireframe() {
  return (
    <div className="wf-screen wf-login">
      <RouteBar route="/login" />
      <div className="wf-auth-layout">
        <div className="wf-auth-brand">
          <div className="wf-cube" />
          <strong>Big ideas start with simple shapes.</strong>
          <span>Build, experiment, and create in 3D.</span>
        </div>
        <div className="wf-auth-forms">
          <div className="wf-form">
            <small>SIGN IN</small>
            <strong>Welcome back</strong>
            <label>Email<div className="wf-input">alex@school.edu</div></label>
            <label>Password<div className="wf-input">••••••••</div></label>
            <div className="wf-button primary">Sign in →</div>
            <span>New here? Create account</span>
          </div>
          <div className="wf-form signup">
            <small>SIGN UP</small>
            <strong>Create account</strong>
            <label>Name<div className="wf-input">Alex Morgan</div></label>
            <label>Email<div className="wf-input focus">alex@school.edu</div></label>
            <label>Password<div className="wf-input">8+ characters</div></label>
            <div className="wf-button primary">Create account →</div>
          </div>
        </div>
      </div>
      <div className="wf-annotation">Authentication success redirects to dashboard</div>
    </div>
  );
}

function ProjectThumb({ color, title }: { color: string; title: string }) {
  return (
    <div className="wf-project">
      <div className={`wf-project-art ${color}`}>
        <i /><b />
      </div>
      <strong>{title}</strong>
      <span>Edited recently</span>
    </div>
  );
}

function DashboardWireframe() {
  return (
    <div className="wf-screen wf-dashboard">
      <RouteBar route="/dashboard" back="Sign out" />
      <div className="wf-topnav"><strong>BlockCAD</strong><span>My projects</span><span>Learn</span><i />AM</div>
      <div className="wf-content">
        <div className="wf-page-head">
          <div><small>YOUR WORKSPACE</small><strong>Good afternoon, Alex.</strong><span>What will you imagine today?</span></div>
          <div className="wf-button primary">+ Create new project</div>
        </div>
        <div className="wf-section-head"><strong>Recent projects</strong><div className="wf-search">⌕ Search projects</div></div>
        <div className="wf-project-grid">
          <div className="wf-new-project"><i>+</i><strong>Start something new</strong><span>Blank 3D canvas</span></div>
          <ProjectThumb color="blue" title="My awesome robot" />
          <ProjectThumb color="green" title="Moon base" />
          <ProjectThumb color="red" title="Rocket ship" />
          <ProjectThumb color="purple" title="Tiny castle" />
          <ProjectThumb color="orange" title="Desk organizer" />
        </div>
      </div>
      <div className="wf-annotation">Project click opens its projectId route</div>
    </div>
  );
}

function EditorWireframe() {
  return (
    <div className="wf-screen wf-editor">
      <RouteBar route="/editor/:projectId" back="My projects" />
      <div className="wf-editor-toolbar">
        <strong>BlockCAD</strong><span>My awesome robot</span>
        <div>↶&nbsp;&nbsp;↷</div>
        <button>Save</button><button>Load</button><button className="export">Export STL</button><i>AM</i>
      </div>
      <div className="wf-editor-body">
        <aside className="wf-shapes">
          <small>BUILD</small><strong>Shapes</strong><span>Drag onto canvas</span>
          <div>{["Cube", "Sphere", "Cylinder", "Cone", "Pyramid", "Torus"].map((shape) => <i key={shape}><b /><em>{shape}</em></i>)}</div>
        </aside>
        <div className="wf-canvas">
          <span className="wf-mode">Isometric · Design mode</span>
          <div className="wf-grid-floor" />
          <div className="wf-robot"><i /><b /><em /></div>
          <div className="wf-selection" />
          <span className="wf-orbit">Drag: orbit · Scroll: zoom · Right-drag: pan</span>
        </div>
        <aside className="wf-properties">
          <small>INSPECTOR</small><strong>Cube</strong>
          {["Position", "Rotation", "Scale"].map((label) => (
            <div className="wf-prop" key={label}><b>{label}</b><span><i>X&nbsp; 0.00</i><i>Y&nbsp; 0.00</i><i>Z&nbsp; 0.00</i></span></div>
          ))}
          <div className="wf-prop"><b>Color</b><span className="wf-swatches"><i /><i /><i /><i /><i /></span></div>
          <div className="wf-delete">Delete shape</div>
        </aside>
      </div>
      <div className="wf-annotation">Toolbar actions open modal overlays without changing route</div>
    </div>
  );
}

function ModalWireframe({ type }: { type: "save" | "load" | "export" }) {
  const content = {
    save: {
      title: "Save project",
      description: "Keep your progress safe.",
      action: "Save project",
    },
    load: {
      title: "Open a project",
      description: "Pick up where you left off.",
      action: "Open project",
    },
    export: {
      title: "Export your model",
      description: "Prepare your creation for 3D printing.",
      action: "Download STL",
    },
  }[type];
  return (
    <div className="wf-modal-card">
      <div className="wf-overlay-label">EDITOR OVERLAY</div>
      <div className="wf-modal-window">
        <span className="wf-modal-close">×</span>
        <small>BLOCKCAD CLOUD</small>
        <strong>{content.title}</strong>
        <p>{content.description}</p>
        {type === "save" && <><label>PROJECT NAME</label><div className="wf-input focus">My awesome robot</div><div className="wf-success">Saved to BlockCAD Cloud</div></>}
        {type === "load" && <div className="wf-file-list"><i>My awesome robot <b>✓</b></i><i>Moon base</i><i>Rocket ship</i></div>}
        {type === "export" && <><div className="wf-export-preview"><div className="wf-cube" /><span>my-awesome-robot.stl<br />2.4 MB · 84 × 62 × 94 mm</span></div><div className="wf-quality">Draft <b>Standard</b> High</div></>}
        <div className="wf-modal-actions"><span>Cancel</span><b>{content.action}</b></div>
      </div>
    </div>
  );
}

function StatesPanel() {
  return (
    <section className="wf-states">
      <div className="wf-section-title"><small>DEVELOPER HANDOFF</small><strong>Interaction states</strong><span>Every interactive element includes visible feedback and keyboard focus.</span></div>
      <div className="wf-state-grid">
        <div className="wf-state-group">
          <strong>Primary button</strong>
          <div><span><button>Default</button><small>Default</small></span><span><button className="is-hover">Hover</button><small>Hover</small></span><span><button className="is-focus">Focus</button><small>Focus</small></span><span><button className="is-active">Active</button><small>Active</small></span><span><button disabled>Disabled</button><small>Disabled</small></span></div>
        </div>
        <div className="wf-state-group">
          <strong>Input</strong>
          <div><span><input placeholder="Project name" /><small>Default</small></span><span><input className="is-hover" placeholder="Project name" /><small>Hover</small></span><span><input className="is-focus" value="Robot" readOnly /><small>Focus</small></span><span><input className="is-active" value="Robot|" readOnly /><small>Active</small></span><span><input disabled placeholder="Unavailable" /><small>Disabled</small></span></div>
        </div>
      </div>
    </section>
  );
}

export default function WireframeBoard({ navigate }: WireframeBoardProps) {
  return (
    <main className="wireframe-board">
      <header className="wf-board-header">
        <div><small>BLOCKCAD · PRODUCT BLUEPRINT</small><h1>Wireframes & navigation flow</h1><p>Production-ready screen architecture, interaction states, and modal behavior.</p></div>
        <button onClick={() => navigate("editor")}>Open live prototype →</button>
      </header>

      <section className="wf-token-strip">
        <div><small>COLOR SYSTEM</small><span className="token ink">#011627</span><span className="token porcelain">#FDFFFC</span><span className="token blue">#08A4BD</span><span className="token red">#E71D36</span><span className="token sage">#6BA368</span></div>
        <div><small>TYPE SCALE</small><strong>Inter</strong><span>Heading 32 / Body 14 / Label 12</span></div>
        <div><small>RADII</small><span>Buttons 8</span><span>Cards 12</span><span>Inputs 6</span></div>
      </section>

      <section className="wf-flow">
        <div className="wf-flow-node"><div className="wf-step">01 · AUTHENTICATE</div><LoginWireframe /></div>
        <FlowArrow label="Successful sign in" />
        <div className="wf-flow-node"><div className="wf-step">02 · SELECT PROJECT</div><DashboardWireframe /></div>
        <FlowArrow label="Create or open" />
        <div className="wf-flow-node"><div className="wf-step">03 · BUILD IN 3D</div><EditorWireframe /></div>
      </section>

      <section className="wf-modal-flow">
        <div className="wf-modal-connector"><span>Save</span></div>
        <div className="wf-modal-connector"><span>Load</span></div>
        <div className="wf-modal-connector"><span>Export STL</span></div>
        <ModalWireframe type="save" />
        <ModalWireframe type="load" />
        <ModalWireframe type="export" />
      </section>

      <StatesPanel />

      <footer className="wf-handoff-footer">
        <strong>Navigation specification</strong>
        <code>/login</code><span>→</span><code>/dashboard</code><span>→</span><code>/editor/:projectId</code>
        <p>Browser Back returns to the previous route. Closing a modal returns focus to its toolbar trigger.</p>
      </footer>
    </main>
  );
}
