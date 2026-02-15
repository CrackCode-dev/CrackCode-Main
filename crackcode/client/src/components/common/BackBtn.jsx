import Button from '../ui/Button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRef, useEffect } from 'react' 

const BackBtn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backBtnRef = useRef(null);

  useEffect(() => {
    backBtnRef.current = location.pathname;
  } , [location.pathname]);
  
  const handleBackBtnClick = () => {
    if(window.history.length > 2) {
      const currentPath = location.pathname;
      sessionStorage.setItem('backClickedFrom', currentPath);
      window.history.back();

      setTimeout(() => {
        if(window.location.pathname === currentPath) {
          window.history.back();
        }
      }, 100);
    } else {
      navigate('home');
    }
  }

  return (
    <Button
      icon={ChevronLeft}
      iconPosition="left"
      variant="primary"
      size="lg"
      onClick={handleBackBtnClick}
      // className={`text-orange-400 hover:text-black`}
    >
      Back
    </Button>
  )
}

export default BackBtn