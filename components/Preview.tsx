"use client";

export default function Preview({component}: {component: string}) {
  const storybookUrl = `${process.env.STORYBOOK_URL || "process.env.STORYBOOK_URL"}/iframe.html?globals=backgrounds.value%3Alight&id=${component}--default&viewMode=story`;
  return <iframe src={storybookUrl} width="100%" height={400}></iframe>;
}
