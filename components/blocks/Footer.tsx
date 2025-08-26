import Link from "next/link";

export const Footer = () => {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Product",
      description:
        "shadcn-native is a library of components that are built with nativewind and react-aria.",
      items: [
        {
          title: "Documentation",
          href: "/docs",
        },
        {
          title: "Storybook",
          href: "https://www.storybook.shadcn-native.moveinready.casa",
        },
        {
          title: "GitHub",
          href: "https://github.com/moveinready-casa/shadcn-native",
        },
      ],
    },
    {
      title: "Company",
      description:
        "We are building the future of mid-term rentals with some great dev-tools along the way.",
      items: [
        {
          title: "About us",
          href: "https://moveinready.casa",
        },
      ],
    },
  ];

  return (
    <div className="bg-foreground text-background w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
                shadcn-native
              </h2>
              <p className="text-background/75 max-w-lg text-left text-lg leading-relaxed tracking-tight">
                Built by{" "}
                <Link href="https://moveinready.casa">moveinready.casa</Link>{" "}
                and the community
              </p>
            </div>
          </div>
          <div className="grid items-start gap-10 lg:grid-cols-3">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-start gap-1 text-base"
              >
                <div className="flex flex-col gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-xl">{item.title}</p>
                  )}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center justify-between"
                      >
                        <span className="text-background/75">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
