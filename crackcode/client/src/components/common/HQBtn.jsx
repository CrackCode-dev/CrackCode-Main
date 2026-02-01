import Button from "../ui/Button";
import { Warehouse } from 'lucide-react'

const HQBtn = () => {
    return (
    <Button
      icon={Warehouse}
      iconPosition="left"
      variant="outline"
      size="md"
      onClick={onClick}
      className={`text-orange-400 hover:text-orange-500 ${className}`}
    >
      HQ
    </Button>
  )
}

export default HQBtn;