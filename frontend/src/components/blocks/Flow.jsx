import { getMediaComponent } from "@/lib/strapi";
import { getTheme, BackgroundImages } from "@/lib/theme-config";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import React from "react";

// FlowConnector Component
function FlowConnector({ direction, theme }) {
  const strokeColors = {
    LIGHT: "#1B365D",
    DARK: "#FFFFFF",
    NEUTRAL: "#1B365D",
    BRAND: "#1B365D",
    BLUE: "#FFFFFF"
  };

  const strokeColor = strokeColors[theme] || strokeColors.LIGHT;

  return (
    <div className="hidden md:flex w-full h-16 md:h-24 justify-center items-center my-0 z-0 relative">
      <div className="w-1/2 h-full relative">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {direction === 'rtl' ? (
            <path
              d="M 100 0 V 50 H 0 V 100"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <path
              d="M 0 0 V 50 H 100 V 100"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

// FlowImageSection Component
function FlowImageSection({ media, theme }) {
  const bgClass = theme === 'DARK' ? 'bg-transparent' : 'bg-white';

  return (
    <div className={`w-full lg:w-1/2 flex justify-center z-10 ${bgClass}`}>
      <div className="flex items-center justify-center">
        {getMediaComponent(
          media,
          "FlowBlock",
          true,
          "rounded-[20px] w-[150px] md:w-[175px] lg:w-[200px] lg:max-w-md object-cover"
        )}
      </div>
    </div>
  );
}

// FlowTextSection Component
function FlowTextSection({ number, title, description, styles }) {
  return (
    <div className="w-full lg:w-1/2 px-0 md:px-4 justify-center flex flex-col gap-4 md:gap-6 items-center md:items-start z-10 bg-white">
      <div className="flex flex-col space-y-4">
        {/* Number and Title */}
        <div className={`flex flex-row font-bold font-songer items-baseline justify-center md:justify-start gap-3 ${styles.title}`}>
          <h1 className="text-5xl md:text-7xl leading-none">{number}</h1>
          <h6 className="text-2xl md:text-3xl leading-none">{title}</h6>
        </div>
        
        {/* Description / Paragraph */}
        <div className={`font-tenorite font-normal w-full text-center md:text-left text-base md:text-lg text-gray-700 ${styles.paragraph}`}>
          <BlocksRenderer content={description} />
        </div>
      </div>
    </div>
  );
}

// FlowBlock Component
function FlowBlock({ number, title, description, media, reverse = false, theme, styles }) {
  const className = `flex flex-col-reverse ${reverse ? "md:flex-row-reverse" : "md:flex-row"} mx-auto gap-9`;
  
  return (
    <div className={className}>
      <FlowTextSection 
        number={number} 
        title={title} 
        description={description}
        styles={styles}
      />
      <FlowImageSection media={media} theme={theme} />
    </div>
  );
}

// Main Flow Component
export default function Flow({ block, reverseOrder = false, theme }) {
  const styles = getTheme(theme);

  return (
    <div className={`md:pb-16 relative ${styles.bg}`}>
      <BackgroundImages images={styles.backgroundImages} />
      
      <div className="flex flex-col w-full max-w-[1250px] mx-auto px-6 md:px-16 lg:px-20 xl:px-24 gap-12 items-center justify-center relative z-10">
        {block && block.map((step, idx) => {
          const shouldReverse = reverseOrder ? (idx % 2 === 0) : (idx % 2 !== 0);
          const connectorDirection = reverseOrder 
            ? ((idx % 2 === 0) ? "ltr" : "rtl")
            : ((idx % 2 === 0) ? "rtl" : "ltr");

          return (
            <React.Fragment key={`flow-block-${idx}`}>
              <FlowBlock
                number={step.Number || `${(idx + 1).toString().padStart(2, '0')}`}
                title={step.title}
                description={step.description}
                media={step.media}
                reverse={shouldReverse}
                theme={theme}
                styles={styles}
              />
              {idx < block.length - 1 && (
                <FlowConnector 
                  key={`connector-${idx}`} 
                  direction={connectorDirection}
                  theme={theme}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
