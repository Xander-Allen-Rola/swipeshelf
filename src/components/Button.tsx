import './Button.css'

interface ButtonProps {
  text: string;
  width: string;
  height: string;
  padding: string;
  variant?: "primary" | "secondary" | "invalid-primary";
  onClick?: () => void; // allow click handler
  disabled?: boolean;
}

function Button({ text, width, height, padding, variant = "primary", onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`custom-button ${variant}`}
      onClick={onClick}
      style={{ width, height, padding }}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
