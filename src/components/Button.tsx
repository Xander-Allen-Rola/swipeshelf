import './Button.css'

interface ButtonProps {
  text: string;
  width: string;
  height: string;
  padding: string;
  variant?: "primary" | "secondary" | "invalid-primary";
  onClick?: () => void; // allow click handler
}

function Button({ text, width, height, padding, variant = "primary", onClick }: ButtonProps) {
  return (
    <button className={`custom-button ${variant}`} onClick={onClick} style={{ width, height, padding }}>
      {text}
    </button>
  );
}

export default Button;
