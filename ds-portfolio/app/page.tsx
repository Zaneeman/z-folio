import { RotationProvider } from "@/hooks/useRotation";
import AppShell from "@/components/AppShell";
import { getFeaturedImages } from "@/lib/images";

export default function Home() {
  const featuredImages = getFeaturedImages();

  return (
    <RotationProvider>
      <AppShell featuredImages={featuredImages} />
    </RotationProvider>
  );
}
