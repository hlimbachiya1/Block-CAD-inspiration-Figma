import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import ThreeViewport from "./ThreeViewport";
import WireframeBoard from "./WireframeBoard";

type IconName =
  | "arrow"
  | "box"
  | "check"
  | "chevron"
  | "cloud"
  | "download"
  | "eye"
  | "file"
  | "folder"
  | "grid"
  | "home"
  | "layers"
  | "minus"
  | "moon"
  | "more"
  | "plus"
  | "redo"
  | "save"
  | "search"
  | "trash"
  | "undo"
  | "x";

const iconPaths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  cloud: <path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 8.5 4.8 4.8 0 0 0 7 18Z" />,
  download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" /></>,
  eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  file: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5" /></>,
  folder: <path d="M3 6h7l2 2h9v11H3V6Z" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
  minus: <path d="M5 12h14" />,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  redo: <><path d="m17 7 4 4-4 4" /><path d="M3 17v-2a4 4 0 0 1 4-4h14" /></>,
  save: <><path d="M5 3h12l2 2v16H5V3Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  undo: <><path d="m7 7-4 4 4 4" /><path d="M21 17v-2a4 4 0 0 0-4-4H3" /></>,
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

function Button({
  children,
  variant = "secondary",
  icon,
  className = "",
  onClick,
  type = "button",
}: {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "icon" | "danger";
  icon?: IconName;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo">
      <div className="logo-mark">
        <span />
        <span />
        <span />
      </div>
      {!compact && <strong>BlockCAD</strong>}
    </div>
  );
}

const shapes = [
  { name: "Cube", kind: "cube", color: "#08A4BD" },
  { name: "Sphere", kind: "sphere", color: "#E71D36" },
  { name: "Cylinder", kind: "cylinder", color: "#6BA368" },
  { name: "Cone", kind: "cone", color: "#F5A623" },
  { name: "Pyramid", kind: "pyramid", color: "#8F72C9" },
  { name: "Torus", kind: "torus", color: "#F37B5C" },
];

function ShapeArt({ kind, color, large = false }: { kind: string; color: string; large?: boolean }) {
  return (
    <div className={`shape-art ${large ? "shape-large" : ""}`}>
      <div className={`shape-visual shape-${kind}`} style={{ "--shape-color": color } as React.CSSProperties}>
        {kind === "cube" && <><i /><b /></>}
        {kind === "cylinder" && <i />}
      </div>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">BLOCKCAD CLOUD</div>
            <div className="modal-title">{title}</div>
            <p>{subtitle}</p>
          </div>
          <Button variant="icon" icon="x" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

function ExportModal({ onClose }: { onClose: () => void }) {
  const [exported, setExported] = useState(false);
  return (
    <Modal title="Export your model" subtitle="Prepare your creation for 3D printing." onClose={onClose}>
      <div className="export-preview">
        <div className="export-model">
          <ShapeArt kind="cube" color="#08A4BD" large />
          <div className="mini-sphere" />
        </div>
        <div className="export-info">
          <div><span>File name</span><strong>My awesome robot.stl</strong></div>
          <div><span>Estimated size</span><strong>2.4 MB</strong></div>
          <div><span>Dimensions</span><strong>84 × 62 × 94 mm</strong></div>
        </div>
      </div>
      <div className="quality-row">
        <div><strong>Print quality</strong><span>Higher quality creates a larger file.</span></div>
        <div className="segmented"><button>Draft</button><button className="active">Standard</button><button>High</button></div>
      </div>
      <div className="modal-actions">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon={exported ? "check" : "download"} onClick={() => setExported(true)}>
          {exported ? "STL ready!" : "Download STL"}
        </Button>
      </div>
    </Modal>
  );
}

function SaveLoadModal({ mode, onClose }: { mode: "save" | "load"; onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <Modal
      title={mode === "save" ? "Save project" : "Open a project"}
      subtitle={mode === "save" ? "Keep your progress safe and continue anytime." : "Pick up right where you left off."}
      onClose={onClose}
    >
      {mode === "save" ? (
        <>
          <label className="field-label">PROJECT NAME<input defaultValue="My awesome robot" /></label>
          <div className="save-status"><Icon name="cloud" /><div><strong>Saved to BlockCAD Cloud</strong><span>Only you can access this project</span></div><Icon name="check" /></div>
          <div className="modal-actions"><Button onClick={onClose}>Cancel</Button><Button variant="primary" icon={saved ? "check" : "save"} onClick={() => setSaved(true)}>{saved ? "Saved" : "Save project"}</Button></div>
        </>
      ) : (
        <>
          <div className="load-list">
            {[
              ["My awesome robot", "Edited just now", "robot"],
              ["Moon base", "Edited yesterday", "base"],
              ["Rocket ship", "Edited 4 days ago", "rocket"],
            ].map(([name, date, art], index) => (
              <button className={`load-item ${index === 0 ? "selected" : ""}`} key={name}>
                <div className={`project-mini mini-${art}`}><ShapeArt kind={index === 1 ? "cylinder" : index === 2 ? "cone" : "cube"} color={index === 1 ? "#6BA368" : index === 2 ? "#E71D36" : "#08A4BD"} /></div>
                <div><strong>{name}</strong><span>{date}</span></div>
                {index === 0 && <Icon name="check" />}
              </button>
            ))}
          </div>
          <div className="modal-actions"><Button onClick={onClose}>Cancel</Button><Button variant="primary" icon="folder" onClick={onClose}>Open project</Button></div>
        </>
      )}
    </Modal>
  );
}

function Header({ page, setPage }: { page: string; setPage: (page: string) => void }) {
  return (
    <header className="site-header">
      <button className="logo-button" onClick={() => setPage("dashboard")}><Logo /></button>
      <nav>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>My projects</button>
        <button>Learn</button>
        <button>Explore</button>
      </nav>
      <div className="header-actions">
        <Button variant="ghost" icon="moon" />
        <Button variant="ghost" onClick={() => setPage("login")}>Sign out</Button>
        <button className="avatar">AM</button>
      </div>
    </header>
  );
}

const projectData = [
  { name: "My awesome robot", date: "Edited 8 min ago", type: "robot", color: "blue" },
  { name: "Moon base", date: "Edited yesterday", type: "base", color: "green" },
  { name: "Rocket ship", date: "Edited 4 days ago", type: "rocket", color: "red" },
  { name: "Tiny castle", date: "Edited 1 week ago", type: "castle", color: "purple" },
  { name: "Desk organizer", date: "Edited 2 weeks ago", type: "organizer", color: "orange" },
];

function ProjectArtwork({ type }: { type: string }) {
  return (
    <div className={`project-art art-${type}`}>
      <div className="art-floor" />
      <div className="art-main" />
      <div className="art-part one" />
      <div className="art-part two" />
      <div className="art-shadow" />
    </div>
  );
}

function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  const [query, setQuery] = useState("");
  const projects = projectData.filter((project) => project.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="dashboard-page">
      <Header page="dashboard" setPage={setPage} />
      <main className="dashboard-main">
        <div className="welcome-row">
          <div><div className="eyebrow">YOUR WORKSPACE</div><h1>Good afternoon, Alex.</h1><p>What will you imagine today?</p></div>
          <Button variant="primary" icon="plus" onClick={() => setPage("editor")}>Create new project</Button>
        </div>
        <div className="project-tools">
          <h2>Recent projects <span>{projectData.length}</span></h2>
          <label className="search-field"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." /></label>
        </div>
        <div className="project-grid">
          <button className="new-project-card" onClick={() => setPage("editor")}><span><Icon name="plus" size={24} /></span><strong>Start something new</strong><small>Blank 3D canvas</small></button>
          {projects.map((project) => (
            <article className="project-card" key={project.name} onClick={() => setPage("editor")}>
              <div className={`project-thumbnail thumb-${project.color}`}><ProjectArtwork type={project.type} /><button className="more-button"><Icon name="more" /></button></div>
              <div className="project-meta"><div><strong>{project.name}</strong><span>{project.date}</span></div><Icon name="arrow" /></div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

function AuthPage({ setPage }: { setPage: (page: string) => void }) {
  const [signup, setSignup] = useState(false);
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Logo />
        <div className="auth-copy"><div className="eyebrow">MAKE ANYTHING</div><h1>Big ideas start with simple shapes.</h1><p>Build, experiment, and bring your imagination to life in 3D.</p></div>
        <div className="floating-shape fs-cube"><ShapeArt kind="cube" color="#08A4BD" large /></div>
        <div className="floating-shape fs-sphere"><ShapeArt kind="sphere" color="#E71D36" /></div>
        <div className="floating-shape fs-torus"><ShapeArt kind="torus" color="#F5A623" /></div>
        <div className="visual-caption"><Icon name="layers" /><span>Made for curious minds, ages 8 and up.</span></div>
      </div>
      <div className="auth-panel">
        <div className="auth-form">
          <div className="mobile-logo"><Logo /></div>
          <div className="eyebrow">{signup ? "JOIN BLOCKCAD" : "WELCOME BACK"}</div>
          <h2>{signup ? "Create your account" : "Sign in to your workspace"}</h2>
          <p>{signup ? "Start building in less than a minute." : "Your next creation is waiting for you."}</p>
          {signup && <label className="field-label">YOUR NAME<input placeholder="Alex Morgan" /></label>}
          <label className="field-label">EMAIL<input type="email" placeholder="you@example.com" /></label>
          <label className="field-label">PASSWORD<input type="password" placeholder="At least 8 characters" /></label>
          <Button variant="primary" className="auth-submit" onClick={() => setPage("dashboard")}>{signup ? "Create account" : "Sign in"}<Icon name="arrow" /></Button>
          <div className="auth-switch">{signup ? "Already have an account?" : "New to BlockCAD?"}<button onClick={() => setSignup(!signup)}>{signup ? "Sign in" : "Create an account"}</button></div>
        </div>
      </div>
    </div>
  );
}

function VectorInput({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="property-group">
      <div className="property-label">{label}<span>mm</span></div>
      <div className="vector-row">
        {values.map((value, index) => <label key={index}><span>{["X", "Y", "Z"][index]}</span><input defaultValue={value} /></label>)}
      </div>
    </div>
  );
}

function Editor({ setPage }: { setPage: (page: string) => void }) {
  const [modal, setModal] = useState<null | "save" | "load" | "export">(null);
  const [selectedColor, setSelectedColor] = useState("#08A4BD");
  const [selectedShape, setSelectedShape] = useState("Cube");
  const [objectCount, setObjectCount] = useState(3);
  const [zoom, setZoom] = useState(82);
  const [viewResetKey, setViewResetKey] = useState(0);

  const addShape = (name: string, color: string) => {
    setSelectedShape(name);
    setSelectedColor(color);
    setObjectCount((count) => count + 1);
  };
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const shape = shapes.find((item) => item.name === event.dataTransfer.getData("shape"));
    if (shape) addShape(shape.name, shape.color);
  };

  return (
    <div className="editor-page">
      <header className="editor-toolbar">
        <button className="logo-button" onClick={() => setPage("dashboard")}><Logo /></button>
        <div className="project-name"><input defaultValue="My awesome robot" /><span>Saved just now</span></div>
        <div className="toolbar-center">
          <Button variant="ghost" icon="undo" />
          <Button variant="ghost" icon="redo" />
          <div className="toolbar-divider" />
          <Button variant="secondary" icon="save" onClick={() => setModal("save")}>Save</Button>
          <Button variant="secondary" icon="folder" onClick={() => setModal("load")}>Load</Button>
        </div>
        <div className="toolbar-right">
          <Button variant="primary" icon="download" onClick={() => setModal("export")}>Export STL</Button>
          <button className="avatar">AM</button>
        </div>
      </header>
      <div className="editor-shell">
        <aside className="shape-sidebar">
          <div className="panel-heading"><div><div className="eyebrow">BUILD</div><h2>Shapes</h2></div><Button variant="icon" icon="search" /></div>
          <p className="panel-hint">Drag a shape onto the canvas.</p>
          <div className="shape-grid">
            {shapes.map((shape) => (
              <button
                key={shape.name}
                draggable
                className={`shape-card ${selectedShape === shape.name ? "selected" : ""}`}
                onDragStart={(event) => event.dataTransfer.setData("shape", shape.name)}
                onClick={() => addShape(shape.name, shape.color)}
              >
                <ShapeArt kind={shape.kind} color={shape.color} />
                <span>{shape.name}</span>
              </button>
            ))}
          </div>
          <div className="tip-card"><div className="tip-icon"><Icon name="layers" /></div><div><strong>Quick tip</strong><p>Hold Shift to select more than one shape.</p></div></div>
          <div className="sidebar-bottom"><Button variant="ghost" icon="home" onClick={() => setPage("dashboard")}>My projects</Button><Button variant="icon" icon="moon" /></div>
        </aside>
        <main className="canvas" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
          <ThreeViewport
            color={selectedColor}
            objectCount={objectCount}
            selectedShape={selectedShape}
            zoom={zoom}
            resetKey={viewResetKey}
          />
          <div className="canvas-top-left"><div className="mode-pill"><Icon name="layers" /><span>Design mode</span><Icon name="chevron" /></div></div>
          <div className="view-cube">
            <div className="view-top">TOP</div><div className="view-front">FRONT</div><div className="view-side">R</div>
          </div>
          <div className="canvas-bottom-left">
            <div className="view-buttons"><Button variant="icon" icon="home" onClick={() => { setViewResetKey((key) => key + 1); setZoom(82); }} /><Button variant="icon" icon="eye" /><Button variant="icon" icon="grid" /></div>
          </div>
          <div className="zoom-controls"><Button variant="icon" icon="minus" onClick={() => setZoom(Math.max(25, zoom - 10))} /><span>{zoom}%</span><Button variant="icon" icon="plus" onClick={() => setZoom(Math.min(200, zoom + 10))} /></div>
          <div className="canvas-status"><span><i />Grid: 1 mm</span><span>{objectCount} objects</span></div>
        </main>
        <aside className="properties-sidebar">
          <div className="properties-title"><div><div className="eyebrow">INSPECTOR</div><h2>{selectedShape}</h2></div><Button variant="icon" icon="more" /></div>
          <div className="object-summary"><div className="object-preview"><ShapeArt kind={shapes.find(s => s.name === selectedShape)?.kind ?? "cube"} color={selectedColor} /></div><div><strong>Solid shape</strong><span>Object {objectCount}</span></div><Button variant="icon" icon="eye" /></div>
          <div className="properties-scroll">
            <VectorInput label="Position" values={["0.00", "0.00", "18.00"]} />
            <VectorInput label="Rotation" values={["0°", "0°", "0°"]} />
            <div className="property-group">
              <div className="property-label">Scale <button><Icon name="layers" size={14} /> Locked</button></div>
              <div className="vector-row"><label><span>W</span><input defaultValue="40.00" /></label><label><span>D</span><input defaultValue="40.00" /></label><label><span>H</span><input defaultValue="40.00" /></label></div>
            </div>
            <div className="property-group color-group">
              <div className="property-label">Color</div>
              <div className="color-row">
                {["#08A4BD", "#E71D36", "#6BA368", "#F5A623", "#8F72C9", "#FDFFFC", "#011627"].map((color) => (
                  <button key={color} aria-label={`Select color ${color}`} className={selectedColor === color ? "active" : ""} style={{ background: color }} onClick={() => setSelectedColor(color)}>{selectedColor === color && <Icon name="check" size={14} />}</button>
                ))}
              </div>
              <div className="hex-field"><span style={{ background: selectedColor }} /><input value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} /></div>
            </div>
            <div className="property-group">
              <div className="property-label">Shape</div>
              <div className="shape-settings"><div><span>Corner radius</span><strong>2.0</strong></div><input type="range" min="0" max="10" defaultValue="2" /><div><span>Segments</span><strong>24</strong></div><input type="range" min="4" max="64" defaultValue="24" /></div>
            </div>
          </div>
          <div className="properties-footer"><Button variant="danger" icon="trash">Delete shape</Button></div>
        </aside>
      </div>
      {modal === "export" && <ExportModal onClose={() => setModal(null)} />}
      {(modal === "save" || modal === "load") && <SaveLoadModal mode={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

export default function App() {
  const pageFromPath = () => {
    if (window.location.pathname.startsWith("/editor/")) return "editor";
    if (window.location.pathname === "/dashboard") return "dashboard";
    if (window.location.pathname === "/login") return "login";
    return "wireframes";
  };
  const [page, setCurrentPage] = useState(pageFromPath);
  const setPage = (nextPage: string) => {
    const paths: Record<string, string> = {
      login: "/login",
      dashboard: "/dashboard",
      editor: "/editor/my-awesome-robot",
      wireframes: "/",
    };
    window.history.pushState({}, "", paths[nextPage] ?? "/");
    setCurrentPage(nextPage);
  };
  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (page === "login") return <AuthPage setPage={setPage} />;
  if (page === "dashboard") return <Dashboard setPage={setPage} />;
  if (page === "editor") return <Editor setPage={setPage} />;
  return <WireframeBoard navigate={setPage} />;
}
