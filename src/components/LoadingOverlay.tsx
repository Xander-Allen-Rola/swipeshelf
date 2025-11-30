import "./LoadingOverlay.css";

type LoadingOverlayProps = {
  show: boolean;
  text?: string;
};

function LoadingOverlay({ show, text }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
}

export default LoadingOverlay;
