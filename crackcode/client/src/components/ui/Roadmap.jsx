export const RoadmapNode = ({ progress, isLast }) => {
  const isCompleted = progress === 100;

  return (
    <div className="flex flex-col items-center w-10 h-full">
      {/* Node Circle - Fixed at the top */}
      <div className="relative w-10 h-10 shrink-0">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="#0a0a0a" stroke="#374151" strokeWidth="3" />
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="75.4"
            style={{ 
              strokeDashoffset: 75.4 - (progress / 100) * 75.4,
              transition: 'stroke-dashoffset 0.5s ease-in-out' 
            }}
          />
        </svg>
        {progress > 0 && (
          <div 
            className={`absolute inset-0 m-auto w-3 h-3 rounded-full shadow-[0_0_10px_#22c55e] transition-all duration-500
              ${isCompleted ? 'bg-green-500' : 'bg-green-500/50 animate-pulse'}`} 
          />
        )}
      </div>

      {/* Connecting Line - Fills the remaining vertical space */}
      {!isLast && (
        <div className="w-0.5 flex-1 bg-gray-800 relative my-1">
          <div 
            className="absolute top-0 left-0 w-full bg-green-500 transition-all duration-700 ease-in-out"
            style={{ height: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Main Roadmap wrapper if you want to use it as a standalone component
const Roadmap = ({ chapters, onChapterClick }) => {
  return (
    <div className="flex flex-col">
      {chapters.map((chapter, index) => {
        const progress = chapter.total > 0 ? (chapter.completed / chapter.total) * 100 : 0;
        return (
          <div key={chapter.id} className="flex gap-8 md:gap-12">
            <RoadmapNode 
              progress={progress} 
              isLast={index === chapters.length - 1} 
            />
            <div className="flex-1 pb-10">
               {/* This can be rendered via children or a prop */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Roadmap;