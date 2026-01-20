
const Badge = ({
  type = 'default', // 'default' | 'point' | 'difficulty'
  difficulty = 'easy', // 'easy' | 'medium' | 'hard' (used when type='difficulty')
  children,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  ...rest
}) => {
  // Size variants
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-md px-4 py-1.5'
  }

  // Type variants
  const types = {
    default: 'bg-none text-[#08C908] font-semibold',
    
    // Point badge - greenish background with bright green text
    point: 'bg-[#0E240E] text-[#08C908] font-semibold',
    
    // Difficulty badges
    difficulty: difficulty === 'easy' 
      ? 'bg-[#185718] text-[#00FF6E] font-semibold'
      : difficulty === 'medium'
      ? 'bg-[#3D310E] text-[#FFF705] font-semibold'
      : 'bg-[#FFF705] text-[#F25941] font-semibold' // hard
  }

  const badgeClasses = [
    'inline-flex items-center rounded-full transition-colors duration-200',
    sizes[size],
    types[type],
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClasses} {...rest}>
      {children}
    </span>
  )
}

export default Badge
