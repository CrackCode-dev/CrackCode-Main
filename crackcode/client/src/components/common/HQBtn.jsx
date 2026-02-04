import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { Warehouse } from 'lucide-react'

const HQBtn = () => {
  const navigate = useNavigate();

  const handleHQBtnClick = () => {
    navigate('/home');
  }

  return (
    <Button
      icon={Warehouse}
      iconPosition="left"
      variant="primary"
      size="lg"
      onClick={handleHQBtnClick}
      className={`text-orange-400 hover:text-black`}
    >
      HQ
    </Button>
  )
}

export default HQBtn;