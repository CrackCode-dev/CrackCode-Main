import { Lock } from 'lucide-react';
import Badge from '../ui/Badge';
import ContentCard from '../ui/Card';

const RoadmapCard = ({

    icon,
    title,
    description,

    questionCount,
    isUnlocked = false,

    onClick,
    className = '',
    ...rest

}) => {
    return (
        <ContentCard

            variant='flat'
            padding="lg"
            bordered={true}
            hoverEffect="none"
            onClick={isUnlocked ? onClick : undefined}
            className={`
                transition-transform duration-300
                ${isUnlocked
                    ? 'hover:scale-[1.02] cursor-pointer'
                    : 'opacity-70 cursor-not-allowed'
                }
                ${className}
            `}

            // badge — top right from  ContentCard badge prop
            badge={
                <Badge type="point" size="sm">
                    {questionCount} questions
                </Badge>
            }

            {...rest}
        >
            {/* Icon + Title row */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                    {typeof icon === 'string' && icon.startsWith('/') || icon?.includes?.('assets')
                        ? <img src={icon} alt={title} className="w-full h-full object-contain" />
                        : icon
                    }
                </div>
                {title && (
                    <h3 className="text-xl font-bold text-white">
                        {title}
                    </h3>
                )}
            </div>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {description}
                </p>
            )}

            {/* Divider + Action */}
            <div className="border-t border-gray-600 pt-3">
                {isUnlocked ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                        className="text-white text-xs font-bold uppercase tracking-widest
                                   hover:text-green-400 transition-colors duration-200"
                    >
                        Start Quiz
                    </button>
                ) : (
                    <Lock className="w-4 h-4 text-gray-600" />
                )}
            </div>
        </ContentCard>
    );
};

export default RoadmapCard;