import './Button.css'

interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "invalid-primary"; // optional prop
}

function Button({ text, variant = "primary" }: ButtonProps) {
  return (
    <button className={`custom-button ${variant}`}>
      {text}
    </button>
  )
}

export default Button;