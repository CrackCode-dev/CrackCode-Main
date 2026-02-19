import Badge from "../ui/Badge";
import ContentCard from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";

const ChapterCard = ({
    image,
    title,
    description,

    completed,
    total,
    status = 'To Begin',

    difficulty = 'easy',

    onClick, 
    className = '',
    ...rest
}) => {
    const difficultyText = {
        easy: "BEGINNER",
        medium: "INTERMEDIATE",
        hard: "ADVANCED"
    };

    return (
        <ContentCard
            variant="flat"
            padding="md"
            bordered={true}
            hoverEffect="none"
            onClick={onClick}
            className={`cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${className}`}
      
        // Difficulty badge
        badge={
            <Badge type="difficulty" difficulty={difficulty} size="sm">
            {difficultyText[difficulty]}
            </Badge>
        }
        
        {...rest}
        >
        <div className="flex gap-4">
            {/* Chapter Image */}
            {image && (
            <div className="shrink-0">
                <img 
                src={image} 
                alt={title} 
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                />
            </div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
            {/* Title */}
            {title && (
                <h3 className="text-lg font-bold text-white mb-1">
                {title}
                </h3>
            )}
            
            {/* Description */}
            {description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {description}
                </p>
            )}
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1">
                <ProgressBar
                    completed={completed}
                    total={total}
                    size="sm"
                    showLabel={false}
                />
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                {status}
                </span>
            </div>
            </div>
        </div>
    </ContentCard>
  );
};

export default ChapterCard;



