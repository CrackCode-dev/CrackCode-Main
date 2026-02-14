const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon: Icon,  // Rename to Icon (capitalized) for clarity
    iconPosition = 'left',
    disabled = false,
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
}) => {

    //Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none transition'
    
    //Variant styles with hover styles
    const variants = {
    primary: 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/30 text-white focus:ring-orange-500',

    outline: 'bg-transparent border-2 border-orange-600 text-orange-600 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10 focus:ring-orange-500',

    text: 'bg-none text-orange-400 hover:text-orange-500 focus:underline focus-visible:orange-500 focus:text-orange-500 text-sm !px-0 !py-0',

    // Difficulty badges
    easy: 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/30',
    medium: 'bg-yellow-500 text-black hover:bg-yellow-600 shadow-yellow-500/30',
};


    //Size Styles
    const sizes = {
        sm: 'text-sm px-3 py-1.5 h-8',
        md: 'text-base px-4 py-2 h-10',
        lg: 'text-lg px-6 py-3 h-12',
        xl: 'text-xl px-8 py-4 h-14',
    };

    //Width Styles
    const widthStyle = fullWidth ? 'w-full' : '';

    //Combine all styles
    const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`;

  return (
    <button 
      type={type}
      className={`${buttonClasses} group`} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className='mr-2 w-5 h-5' />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className='ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' />}
    </button>
  )
}

export default Button