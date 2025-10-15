import "./LoadingOverlay.css";

type LoadingOverlayProps = {
  show: boolean;
};

function LoadingOverlay({ show }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}

export default LoadingOverlay;
