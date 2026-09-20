import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";
import React from "react";
import { ImageBlock } from "@/components/markdoc/image-block";
import { ImageGallery } from "@/components/markdoc/image-gallery";
import { Callout } from "@/components/markdoc/callout";
import { VideoEmbed } from "@/components/markdoc/video-embed";

const components: Record<string, React.ComponentType<any>> = {
  ImageBlock,
  ImageGallery,
  Callout,
  VideoEmbed,
};

export function renderMarkdoc(node: RenderableTreeNode) {
  return Markdoc.renderers.react(node, React, { components });
}
