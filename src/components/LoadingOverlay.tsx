import "./LoadingOverlay.css";

type LoadingOverlayProps = {
  show: boolean;
  text?: string;
  overlay?: boolean;
};

function LoadingOverlay({ show, text, overlay }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className={`loading-overlay${overlay ? " with-overlay" : ""}`}>
      <div className="spinner"></div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
}

export default LoadingOverlay;
