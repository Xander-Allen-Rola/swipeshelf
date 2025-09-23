import './Button.css'

interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "invalid-primary";
  onClick?: () => void; // allow click handler
}

function Button({ text, variant = "primary", onClick }: ButtonProps) {
  return (
    <button className={`custom-button ${variant}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
