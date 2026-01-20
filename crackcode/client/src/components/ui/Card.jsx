// ContentCard.jsx
import React from 'react';

const ContentCard = ({
  // Layout & Structure
  variant = 'default',
  orientation = 'vertical',
  padding = 'md',
  
  // Icon props (for icon components like lucide-react)
  icon,
  iconPosition = 'top',
  
  // Image props (for actual images/photos)
  image,
  imagePosition = 'top',
  imagePadding = 'none', // 'none' | 'sm' | 'md' | 'lg' - controls space around images
  
  // Content props
  title,
  subtitle,
  description,
  badge,
  footer,
  
  // Visual customization
  className = '',
  hoverable = false, // Deprecated: use hoverEffect instead
  hoverEffect = 'none', // 'none' | 'slide' (landing page) | 'lift' (general hover)
  clickable = false,
  bordered = true,
  shadow = 'sm',
  
  // Actions
  onClick,
  onIconClick,
  onImageClick,
  actions,
  
  // Advanced
  children,
  as: Component = 'div',
  ...rest
}) => {
  // Base styles
  const baseStyles = 'rounded-lg transition-all duration-200 text-left';
  
  // Variant styles
  const variants = {
    default: 'bg-white text-white',
    outlined: 'bg-transparent text-white border-1',
    elevated: 'bg-white',
    flat: 'bg-[#121212]'
  };
  
  // Padding sizes
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  // Image padding options (for actual images only)
  const imagePaddings = {
    none: '-mx-4 -mt-4', // Extends to card edges
    sm: 'mx-2 mt-2',
    md: 'mx-4 mt-4',
    lg: 'mx-6 mt-6'
  };
  
  // Shadow styles
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  // Interactive states
  const interactiveStyles = [
    hoverEffect === 'lift' && 'hover:shadow-lg hover:-translate-y-1',
    clickable && 'cursor-pointer active:scale-98',
    onClick && 'cursor-pointer'
  ].filter(Boolean).join(' ');
  
  const cardClasses = [
    baseStyles,
    variants[variant],
    paddings[padding],
    shadows[shadow],
    bordered && 'border border-[#444040]',
    interactiveStyles,
    'relative overflow-hidden group', // Added 'group' for hover effect
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={cardClasses}
      onClick={onClick}
      {...rest}
    >
      {/* Hover overlay effect - slides from left to right (Landing page only) */}
      {hoverEffect === 'slide' && (
        <div 
          className="absolute inset-0 bg-[#44404050] bg-opacity-20 transition-all duration-500 ease-out -translate-x-full group-hover:translate-x-0 rounded-lg"
          style={{
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}
      
      {/* Content wrapper - ensures content stays above overlay */}
      <div className={`relative z-10 transition-transform duration-500 ease-out ${hoverEffect === 'slide' ? 'group-hover:scale-105' : ''}`}>
      
      {/* Badge */}
      {badge && (
        <div className="right-0 absolute top-0" >
          {badge}
        </div>
      )}
      
      {/* Icon (for icon components) */}
      {icon && iconPosition === 'top' && (
        <div className="mb-4" onClick={onIconClick}>
          {icon}
        </div>
      )}
      
      {/* Image (for actual photos/images) */}
      {image && imagePosition === 'top' && (
        <div 
          className={`${imagePaddings[imagePadding]} mb-4 overflow-hidden rounded-t-lg`}
          onClick={onImageClick}
        >
          <img src={image} alt={title || ''} className="w-full h-48 object-cover" />
        </div>
      )}
      
      <div className={orientation === 'horizontal' ? 'flex gap-4' : ''}>
        {/* Side Icon for horizontal layout */}
        {icon && iconPosition === 'left' && orientation === 'horizontal' && (
          <div className="flex-shrink:0" onClick={onIconClick}>
            {icon}
          </div>
        )}
        
        {/* Side Image for horizontal layout */}
        {image && imagePosition === 'left' && orientation === 'horizontal' && (
          <div className="flex-shrink:0" onClick={onImageClick}>
            <img src={image} alt={title || ''} className="w-32 h-32 object-cover rounded-lg" />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1">
          {/* Title & Subtitle */}
          {(title || subtitle) && (
            <div className="mb-5">
              {title && (
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-300">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-gray-400 mb-3">
              {description}
            </p>
          )}
          
          {/* Custom children content */}
          {children}
        </div>
        
        {/* Right Icon for horizontal layout */}
        {icon && iconPosition === 'right' && orientation === 'horizontal' && (
          <div className="flex-shrink:0" onClick={onIconClick}>
            {icon}
          </div>
        )}
        
        {/* Right Image for horizontal layout */}
        {image && imagePosition === 'right' && orientation === 'horizontal' && (
          <div className="flex-shrink:0" onClick={onImageClick}>
            <img src={image} alt={title || ''} className="w-32 h-32 object-cover rounded-lg" />
          </div>
        )}
      </div>
      
      {/* Actions */}
      {actions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          {actions}
        </div>
      )}
      
      {/* Footer */}
      {footer && (
        <div className="mt-4">
          {footer}
        </div>
      )}
      
      </div> {/* End of content wrapper */}
    </Component>
  );
};

export default ContentCard;
