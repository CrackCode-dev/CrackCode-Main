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

    //Base styles
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl focus:outline-none transition-all duration-150 ease-out relative overflow-hidden'
    
    //Variant styles with 3D depth and gamified look
    const variants = {
        primary: `bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 
                  border-4 border-orange-800 text-white
                  shadow-[0_6px_0_0_rgba(154,52,18,1),0_8px_12px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_4px_0_0_rgba(154,52,18,1),0_6px_10px_rgba(0,0,0,0.4)]
                  active:shadow-[0_2px_0_0_rgba(154,52,18,1),0_3px_6px_rgba(0,0,0,0.4)]
                  hover:translate-y-[2px] active:translate-y-[4px]
                  focus:ring-orange-500
                  [text-shadow:0_2px_4px_rgba(0,0,0,0.5),0_-1px_2px_rgba(255,255,255,0.2)]`,
        
        outline: `bg-gradient-to-b from-transparent to-black/10
                  border-4 border-current
                  shadow-[0_6px_0_0_currentColor,0_8px_12px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_4px_0_0_currentColor,0_6px_10px_rgba(0,0,0,0.4)]
                  active:shadow-[0_2px_0_0_currentColor,0_3px_6px_rgba(0,0,0,0.4)]
                  hover:translate-y-[2px] active:translate-y-[4px]
                  hover:brightness-110 hover:bg-current/10
                  [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]`,
        
        text: 'bg-none text-orange-400 hover:text-orange-500 focus:underline focus-visible:orange-500 focus:text-orange-500 text-sm !px-0 !py-0 !border-0 !shadow-none',
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
      {/* Glossy shine effect - for primary and outline variants */}
      {(variant === 'primary' || variant === 'outline') && (
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