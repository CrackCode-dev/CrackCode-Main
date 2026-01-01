const Card = ({
    children,
    //Layout & Structure 
    variant = 'default',
    orientation = 'vertical',
    padding = 'md',

    //Content props
    image,
    imagePosition,
    title,
    subtitle,
    description,
    badge,
    footer,

    //Visual Customization
    className = '',
    hoverable = false,
    clickable = false,
    bordered = true,
    shadow = 'sm',

    //Actions
    onClick,
    onImageClick,
    actions,

    
}) => {};

export default Card
