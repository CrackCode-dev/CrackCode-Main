import { memo, useCallback, useMemo } from "react";
import Footer from "../../components/common/Footer";
import HQBtn from "../../components/common/HQBtn";
import ContentCard from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Lock, ArrowRight } from "lucide-react";
import { careers, getDifficultyLabel } from "./careers";


function CareermapMain() {

  const careersList = useMemo(() => careers, []);

  //Handle card click
  //useCallback prevents function recreation on every render
  const handleCareerSelect = useCallback((career) => {
    if (career.locked) {
      //Prevent navigation if the career is locked
      console.log(`${career.title} is locked. Complete prerequisites first.`);
      return;
    }
    //Handles unlocked career selection
    console.log("Career selected:", career.id);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col pt-[850px]  ">
      {/*HQ Button */}
      <div className="absolute top-6 left-6 z-30">
    <HQBtn />
  </div>

      {/* Header Section */}
      <header className="text-center px-8 py-12  mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Choose the best career path that suits you!
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          We stand beside you through out your entire journey
        </p>
      </header>

      {/* Career Cards Grid */}
      <div className="flex-1 px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {/*Loop through career data*/}
          {careersList.map((career) => (
            <div key={career.id} className="h-full">
              <ContentCard
                variant="flat"
                padding="none"
                hoverEffect={!career.locked ? "lift" : "none"}
                clickable={!career.locked}
                onClick={() => handleCareerSelect(career)}
                className={`relative overflow-hidden min-h-full flex flex-col transition-all duration-300 rounded-xl ${!career.locked ? "hover:border-gray-700 cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                {/* Top Gradient Section */}
                <div
                  className={`relative h-36 bg-gradient-to-br ${career.gradient} flex items-start justify-between p-5`}
                >

                  {/* Image Icon */}
                  <div className="flex flex-col">
                    <div className="w-12 h-12 mb-2">
                      <img
                        src={career.icon}
                        alt={`${career.title} icon`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Career Title */}
                    <h3 className="text-white text-2xl font-bold leading-tight">
                      {career.title}
                    </h3>

                    {/* Level */}
                    <span className="absolute bottom-1 right-3 text-black font-extrabold">
                      {career.level}
                    </span>
                  </div>
                </div>

                  {/* Content Section */}
                  <div className="bg-[#121212] p-6 flex flex-col relative h-[320px] ">

                      {/* Languages */}
                      <div className="mb-4">
                        <p className="text-sm whitespace-pre-wrap">
                          <span className="text-white font-bold">Languages: </span>
                          <span className="text-white font-bold">{career.languages}</span>
                        </p>
                      </div>

                      {/* Quiz Focus List*/}
                      <div className="mb-6 flex-1 overflow-y-auto">
                        <p className="text-sm text-white font-bold mb-2">Quiz Focus:</p>
                        <ul className="list-disc text-sm text-white pl-5 space-y-1.5">
                          {career.focus.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Divider - Fixed at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-[#121212]">
                        <div className="border-t border-gray-700 pt-5">
                          {/* Difficulty Badge with Arrow */}
                          <div className="flex items-center justify-between">
                            <Badge
                              type="difficulty"
                              difficulty={career.difficulty}
                              size="lg"
                              className={`inline-flex rounded-xl items-center gap-2 ${career.locked ? "opacity-50" : ""
                                }`}
                            >
                              {getDifficultyLabel(career.difficulty)}
                            </Badge>
                            <ArrowRight
                              size={18}
                              className="text-[#08C908] hover:text-white group-hover:translate-x-1 transition-all duration-300"
                            />

                          </div>
                        </div>
                      </div>


                    </div>

                    {/* Locked Overlay */}
                    {career.locked && (
                      <div className="absolute inset-0 bg-black/70  z-20 rounded-lg ">
                        <div className="absolute top-3 right-3 ">
                          <Lock className=" w-7 h-7 text-gray-300 block" strokeWidth={1.5} />

                        </div>
                      </div>
                    )}

                  </ContentCard>
                </div>
              ))}
            </div>
          </div>

      <Footer />
    </div>
  );


}
//Memo prevents unnecessary re-renders
export default memo(CareermapMain);
