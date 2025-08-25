import {BookOpen, Github, MoveRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => (
  <div className="w-full">
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
        <div className="flex flex-col gap-4">
          <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
            Build your React Native component library
          </h1>
          <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
            Built with nativewind and react-aria, these components are accesible
            and performant with the same design as shadcn/ui. Additionally,
            these components have more variants than shadcn/ui making them a
            great choice for large scale applications.
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Button size="lg" className="gap-4" variant="outline" asChild>
            <Link href="https://github.com/moveinready-casa/shadcn-native">
              View on GitHub <Github className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" className="gap-4" variant="outline" asChild>
            <Link href="https://www.storybook.shadcn-native.moveinready.casa">
              Preview Components <BookOpen className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" className="gap-4" asChild>
            <Link href="/docs">
              Get Started <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
