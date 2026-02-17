const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
}) => {

    //Base styles - improved focus management
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl focus:outline-none focus-visible:outline-none transition-all duration-150 ease-out relative overflow-hidden'
    
    //Variant styles with 3D depth and gamified look
    const variants = {
<<<<<<< HEAD
    primary: 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/30 text-white focus:ring-orange-500',

    outline: 'bg-transparent border-2 border-orange-600 text-orange-600 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10 focus:ring-orange-500',

    text: 'bg-none text-orange-400 hover:text-orange-500 focus:underline focus-visible:orange-500 focus:text-orange-500 text-sm !px-0 !py-0',

    // Difficulty badges
    easy: 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/30',
    medium: 'bg-yellow-500 text-black hover:bg-yellow-600 shadow-yellow-500/30',
};

=======
        primary: `bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 
                  border-4 border-orange-800 text-white
                  shadow-[0_6px_0_0_rgba(154,52,18,1),0_8px_12px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_4px_0_0_rgba(154,52,18,1),0_6px_10px_rgba(0,0,0,0.4)]
                  active:shadow-[0_2px_0_0_rgba(154,52,18,1),0_3px_6px_rgba(0,0,0,0.4)]
                  hover:translate-y-[2px] active:translate-y-[4px]
                  focus-visible:ring-4 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  [text-shadow:0_2px_4px_rgba(0,0,0,0.5),0_-1px_2px_rgba(255,255,255,0.2)]`,
        
        outline: `bg-transparent
                  border-4 border-current
                  shadow-[0_6px_0_0_currentColor,0_8px_12px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_4px_0_0_currentColor,0_6px_10px_rgba(0,0,0,0.4)]
                  active:shadow-[0_2px_0_0_currentColor,0_3px_6px_rgba(0,0,0,0.4)]
                  hover:translate-y-[2px] active:translate-y-[4px]
                  hover:brightness-110 hover:bg-current/10
                  focus-visible:ring-4 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-black
                  [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]`,
        
        text: 'bg-none text-orange-400 hover:text-orange-500 focus:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black text-sm !px-0 !py-0 !border-0 !shadow-none',

        ghost: 'bg-transparent focus:ring-white/20 p-0'
    };
>>>>>>> 32beb94dcb1dcb92935785bee5fc382a709652c5

    //Size Styles
    const sizes = {
        sm: 'text-sm px-3 py-1.5 h-8',
        md: 'text-base px-4 py-2 h-10',
        lg: 'text-lg px-6 py-3 h-12',
        xl: 'text-xl px-8 py-4 h-14',
        icon: 'p-0'
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
      {/* Glossy shine effect - for primary and outline variants */}
      {variant === 'primary' && (
        <>
          <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/30 via-transparent to-transparent opacity-80 pointer-events-none"></div>
          {variant === 'primary' && (
            <div className="absolute inset-0.5 rounded-xl bg-linear-to-b from-orange-400/50 to-transparent pointer-events-none"></div>
          )}
        </>
      )}
      
      {/* Content wrapper with 3D text effect */}
      <span className={`flex items-center justify-center relative z-10
        ${variant === 'primary' ? 'filter-[drop-shadow(0_2px_3px_rgba(0,0,0,0.4))_drop-shadow(0_-1px_1px_rgba(255,255,255,0.2))]' : ''}
        ${variant === 'outline' ? 'filter-[drop-shadow(0_2px_3px_rgba(0,0,0,0.3))]' : ''}`}>
        {Icon && iconPosition === 'left' && <Icon className='mr-2 w-5 h-5' />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className='ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' />}
      </span>
    </button>
  )
}

export default Button