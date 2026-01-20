const ProgressBar = ({
  completed = 0,
  total = 1,
  variant = 'default',
  size = 'md',
  showLabel = true,
  labelText = 'cases completed',
  className = '',   
}) => {
  const variants = {
    default: 'bg-orange-500',
    // success: 'bg-orange-500',
    // warning: 'bg-yellow-500',
    // danger: 'bg-red-500'
  }

  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  //manual calculation of percentage by completed/total
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const clampedCompleted = Math.max(0, Math.min(completed, total))
  const clampedTotal = Math.max(1, total)
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full ${variants[variant]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{clampedCompleted}/{clampedTotal} {labelText}</span>
          
        </div>
      )}
    </div>
  )
}

export default ProgressBar