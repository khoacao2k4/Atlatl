import { getMediaComponent } from "@/lib/strapi";
import { getTheme } from "@/lib/theme-config";

export default function CenteredMedia({
  themeTop,
  themeBottom,
  media,
}) {
  const topStyles = getTheme(themeTop);
  const bottomStyles = getTheme(themeBottom);

  const gradientMap = {
    'bg-white': 'from-white',
    'bg-dark-blue': 'from-dark-blue',
    'bg-darker-light-blue': 'from-darker-light-blue',
    'bg-bold-blue': 'from-bold-blue',
  };

  const toGradientMap = {
    'bg-white': 'to-white',
    'bg-dark-blue': 'to-dark-blue',
    'bg-darker-light-blue': 'to-darker-light-blue',
    'bg-bold-blue': 'to-bold-blue',
  };

  const fromColor = gradientMap[topStyles.bg] || 'from-white';
  const toColor = toGradientMap[bottomStyles.bg] || 'to-white';

  return (
    <div className={`w-full bg-gradient-to-b ${fromColor} from-50% ${toColor} to-50% px-4 md:px-16 lg:px-40 pb-8 md:pb-16 lg:pb-24 -mb-1`}>
      {getMediaComponent(
        media,
        "CenteredMedia",
        false,
        "w-full h-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl object-cover aspect-video"
      )}
    </div>
  );
}