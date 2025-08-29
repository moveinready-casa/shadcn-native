import {Check} from "lucide-react";
import Link from "next/link";

export const Features = () => (
  <div className="w-full p-8 py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col items-start gap-4 py-20 lg:py-40">
        <div className="flex flex-col gap-2">
          <h2 className="font-regular text-3xl tracking-tighter md:text-5xl lg:max-w-xl">
            Features
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed tracking-tight lg:max-w-xl">
            Build something great!
          </p>
        </div>
        <div className="flex w-full flex-col gap-10 pt-12">
          <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex w-full flex-row items-start gap-6">
              <Check className="text-primary mt-2 h-4 w-4" />
              <div className="flex flex-col gap-1">
                <p>Cross-platform</p>
                <p className="text-muted-foreground text-sm">
                  Our components support iOS, Android and Web with Windows and
                  macOS support on the way.
                </p>
              </div>
            </div>
            <div className="flex flex-row items-start gap-6">
              <Check className="text-primary mt-2 h-4 w-4" />
              <div className="flex flex-col gap-1">
                <p>Accessible</p>
                <p className="text-muted-foreground text-sm">
                  Our components are accessible on Native and the web. To
                  achieve web accesibility we use
                  <Link href="https://react-spectrum.adobe.com/react-aria/index.html">
                    react-aria
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-row items-start gap-6">
              <Check className="text-primary mt-2 h-4 w-4" />
              <div className="flex flex-col gap-1">
                <p>Shadcn++</p>
                <p className="text-muted-foreground text-sm">
                  Our components include extra variants so you can adjust error,
                  loading, borderRadius, and style without writing any extra
                  tailwind.
                </p>
              </div>
            </div>
            <div className="flex w-full flex-row items-start gap-6">
              <Check className="text-primary mt-2 h-4 w-4" />
              <div className="flex flex-col gap-1">
                <p>Storybook</p>
                <p className="text-muted-foreground text-sm">
                  We have included a{" "}
                  <Link href={process.env.STORYBOOK_URL || "/"}>storybook</Link>{" "}
                  to let you play with all the variants.
                </p>
              </div>
            </div>
            <div className="flex flex-row items-start gap-6">
              <Check className="text-primary mt-2 h-4 w-4" />
              <div className="flex flex-col gap-1">
                <p>Tested</p>
                <p className="text-muted-foreground text-sm">
                  We write unit tests for all the components to ensure they are
                  working as expected.
                </p>
              </div>
            </div>
            <div className="flex flex-row items-start gap-6">
              <Check className="text-primary mt-2 h-4 w-4" />
              <div className="flex flex-col gap-1">
                <p>Customizable</p>
                <p className="text-muted-foreground text-sm">
                  You own the code and the implementation. You can customize
                  anything you want.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
