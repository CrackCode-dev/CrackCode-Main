import Button from '../ui/Button'
import { ChevronLeft } from 'lucide-react'

const BackBtn = ({ onClick, className = '' }) => {
  return (
    <Button
      icon={ChevronLeft}
      iconPosition="left"
      variant="outline"
      size="md"
      onClick={onClick}
      className={`text-orange-400 hover:text-orange-500 ${className}`}
    >
      Back
    </Button>
  )
}

export default BackBtn