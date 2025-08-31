"use client";

import {Button} from "./ui/button";
import {Separator} from "./ui/separator";
import Image from "next/image";
import {useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "./ui/popover";
import {useRouter} from "next/navigation";

export default function Preview({component}: {component: string}) {
  const storybookUrl = `${process.env.STORYBOOK_URL || "process.env.STORYBOOK_URL"}/iframe.html?&id=components-${component}--default&viewMode=story`;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent));
  }, []);

  const router = useRouter();

  return (
    <div className="bg-background border-border rounded-lg border">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            onClick={
              isMobile
                ? () =>
                    router.push(
                      "exp://u.expo.dev/04b1f525-c94e-4671-b3f5-cba7ac9d70ed?runtime-version=1.0.0&channel-name=main",
                    )
                : undefined
            }
            className="m-4"
          >
            Open in Expo Go
          </Button>
        </PopoverTrigger>
        {isMobile ? null : (
          <PopoverContent>
            <div className="flex items-center justify-center">
              <Image
                src="/images/expo-qr.svg"
                alt="Expo QR"
                width={200}
                height={200}
              />
            </div>
          </PopoverContent>
        )}
      </Popover>
      <Separator />
      <iframe src={storybookUrl} width="100%" height={400}></iframe>
    </div>
  );
}
