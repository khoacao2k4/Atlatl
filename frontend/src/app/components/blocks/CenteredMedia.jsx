import { getMediaComponent } from "@/lib/strapi";
import { getTheme } from "@/lib/theme-config";

export default function CenteredMedia({
  themeTop,
  themeBottom,
  media,
}) {
  const topStyles = getTheme(themeTop);
  const bottomStyles = getTheme(themeBottom);

  const fromColor = topStyles.bg.replace('bg-', 'from-');
  const toColor = bottomStyles.bg.replace('bg-', 'to-');

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