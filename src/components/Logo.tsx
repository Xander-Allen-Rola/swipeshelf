import './Logo.css';
import swipeShelfLogo from '../assets/SwipeShelf.png';

interface LogoProps {
  position?: 'top' | 'bottom';
}

const Logo = ({ position = 'bottom' }: LogoProps) => {
  const style =
    position === 'top'
      ? { top: 30, bottom: 'auto' }
      : { bottom: 0, top: 'auto' };

  return (
    <img
      src={swipeShelfLogo}
      alt="SwipeShelf Logo"
      className="logo"
      style={style}
    />
  );
};

export default Logo;