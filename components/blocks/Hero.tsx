"use client";

import {BookOpen, Github, MoveRight} from "lucide-react";
import {Button} from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {Separator} from "../ui/separator";
import {useEffect, useState} from "react";

export const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent));
  });

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div className="flex flex-col gap-4">
            <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
              Build your React Native component library
            </h1>
            <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
              An unofficial port of shadcn/ui for React Native built with
              Nativewind. Additionally, these components have more variants than
              shadcn/ui making them a great choice for large scale applications.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" className="gap-4" variant="outline" asChild>
              <Link href="https://github.com/moveinready-casa/shadcn-native">
                View on GitHub <Github className="h-4 w-4" />
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger>
                <Button size="lg" className="gap-4" asChild>
                  <span>
                    Preview Components <BookOpen className="h-4 w-4" />
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Preview Components</DialogTitle>
                </DialogHeader>
                <Button size="lg" className="gap-4" asChild>
                  <Link href={process.env.STORYBOOK_URL || "/"}>
                    Open in Storybook
                  </Link>
                </Button>
                <Separator />
                {isMobile ? (
                  <>
                    <Button size="lg" className="gap-4" asChild>
                      <Link href="exp://u.expo.dev/04b1f525-c94e-4671-b3f5-cba7ac9d70ed?runtime-version=1.0.0&channel-name=main">
                        Open in Expo Go
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-md text-muted-foreground">
                      View on your device
                    </span>
                    <Image
                      src="/images/expo-qr.svg"
                      alt="Hero"
                      width={1000}
                      height={1000}
                    />
                  </>
                )}
              </DialogContent>
            </Dialog>
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
};
