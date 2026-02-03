import Button from '../ui/Button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BackBtn = () => {
  const navigate = useNavigate();

  const handleBackBtnClick = () => {
    navigate(-1);
  }

  return (
    <Button
      icon={ChevronLeft}
      iconPosition="left"
      variant="primary"
      size="lg"
      onClick={handleBackBtnClick}
      className={`text-orange-400 hover:text-black`}
    >
      Back
    </Button>
  )
}

export default BackBtn