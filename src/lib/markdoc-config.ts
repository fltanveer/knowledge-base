import { type Config } from "@markdoc/markdoc";

export const markdocConfig: Config = {
  tags: {
    ImageBlock: {
      render: "ImageBlock",
      selfClosing: true,
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, default: "" },
        caption: { type: String },
        position: { type: String, default: "center" },
      },
    },
    ImageGallery: {
      render: "ImageGallery",
      attributes: {
        columns: { type: String, default: "2" },
        gap: { type: String, default: "md" },
      },
    },
    Callout: {
      render: "Callout",
      attributes: {
        type: { type: String, default: "info" },
        title: { type: String },
      },
    },
    VideoEmbed: {
      render: "VideoEmbed",
      selfClosing: true,
      attributes: {
        url: { type: String, required: true },
        type: { type: String, default: "youtube" },
        caption: { type: String },
        aspectRatio: { type: String, default: "16/9" },
      },
    },
  },
  nodes: {},
};
