import { ArrowRight } from 'lucide-react';
import ContentCard from "../ui/Card";

const LangCard = ({
    icon,
    title,
    description,
    courseCount,

    headerGradient = 'linear-gradient(to right, #1F3A5F, #FCD34D)',

    titleColor = 'text-white',

    footerText,
    footerColor = 'text-green-400',

    showArrow = true,
    arrowColor = 'text-green-400',

    onClick,

    hoverEffect = 'none',
    className = '',
    ...rest

}) => {
    const footerContent = footerText ? footerText : courseCount !== undefined ? `${courseCount} ${courseCount === 1 ? 'Course' : 'Courses'}` : null;

    return (
    <ContentCard
    variant="flat"
    padding="md"
    bordered={false}
    hoverEffect={hoverEffect}
    onClick={onClick}
    className={`transition-transform duration-300 hover:scale-103 ${className}`}

    headerContent={
        <div className="flex items-center gap-3 px-5 py-4">
            <div className='drop-shadow-lg'>
                {icon}
            </div>
          
            {title && (
                <h3 className={`text-xl md:text-2xl font-bold ${titleColor}`}>
                {title}
                </h3>
          )}
        </div>
      }
      headerClassName="rounded-t-lg"
      headerStyle={{ background: headerGradient }}
      
      description={description}
      
      footer={
        footerContent && (
          <span className={`font-medium text-sm ${footerColor}`}>
            {footerContent}
          </span>
        )
      }
      
      actions={
        showArrow && (
          <ArrowRight className={`w-5 h-5 ${arrowColor} transition-transform duration-300 group-hover:translate-x-2`} />
        )
      }
      
      {...rest}
    />

    );

};

export default LangCard;

