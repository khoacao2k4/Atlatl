export const themeStyles = {
  LIGHT: {
    bg: 'bg-white',
    title: 'text-dark-blue',
    text: 'text-darker-bold-blue',
    textMuted: 'text-black',
    button: 'bg-bold-blue text-white',
    buttonHover: 'hover:bg-darker-bold-blue',
  },
  DARK: {
    bg: 'bg-dark-blue',
    text: 'text-white',
    textMuted: 'text-black',
    title: 'text-white',
    button: 'bg-bold-blue text-white',
    buttonHover: 'hover:bg-light-blue hover:text-dark-blue',
  },
  BLUE: {
    bg: 'bg-darker-bold-blue',
    text: 'text-white',
    textMuted: 'text-gray-300',
    title: 'text-white',
    button: 'bg-bold-blue text-white',
    buttonHover: 'hover:bg-light-blue hover:text-dark-blue',
  },
  NEUTRAL: {
    bg: 'bg-darker-light-blue',
    text: 'text-dark-blue',
    textMuted: 'text-darker-bold-blue',
    title: 'text-dark-blue',
    button: 'bg-bold-blue text-white',
    buttonHover: 'hover:bg-dark-blue',
  },
  BRAND: {
    bg: 'bg-white',
    text: 'text-dark-blue',
    textMuted: 'text-darker-bold-blue',
    title: 'text-dark-blue',
    button: 'bg-bold-blue text-white',
    buttonHover: 'hover:bg-darker-bold-blue',
    backgroundImages: [
      {
        src: '/images/vector_60.svg',
        className: 'absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-full h-[80%] md:h-[100%]'
      },
      {
        src: '/images/vector_61.svg',
        className: 'absolute bottom-0 left-[30%] w-[150px] md:w-[25vw] lg:w-[300px]'
      }
    ]
  },
};

export const buttonStyles = {
  FILLED: 'bg-bold-blue text-white hover:bg-white hover:text-bold-blue',
  OUTLINED: 'border-2 border-bold-blue text-bold-blue hover:bg-bold-blue hover:text-white'
};

export const buttonShapes = {
  ROUNDED: 'rounded-full',
  RECTANGULAR: 'rounded-lg'
};

export const getTheme = (theme) => themeStyles[theme] || themeStyles.LIGHT;

export const getButtonClasses = (button) => {
  const style = button?.style || 'FILLED';
  const shape = button?.shape || 'ROUNDED';
  
  const styleClass = buttonStyles[style];
  const shapeClass = buttonShapes[shape];
  
  return `${styleClass} ${shapeClass} py-3 px-8 shadow-md hover:shadow-[0_0px_15px_-3px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 hover:cursor-pointer font-bold font-songer`;
};

export const BackgroundImages = ({ images }) => {
  if (!images || images.length === 0) return null;
  
  return (
    <>
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt=""
          className={image.className}
        />
      ))}
    </>
  );
};