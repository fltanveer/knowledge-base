import { config, fields, collection } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";

const imagePositions = [
  { label: "Center", value: "center" },
  { label: "Full Width", value: "full-width" },
  { label: "Left (text wraps right)", value: "left" },
  { label: "Right (text wraps left)", value: "right" },
] as const;

export default config({
  // Content lives in GitHub. Saving in Keystatic commits straight to the repo,
  // Vercel redeploys on that push, and src/lib/reader.ts reads the committed
  // files off disk during the build - so Markdoc documents and the images
  // uploaded alongside them go live in the same deploy.
  // Set NEXT_PUBLIC_KEYSTATIC_STORAGE=local to edit the working copy instead
  // (offline work, or before the GitHub App has been created).
  storage:
    process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "local"
      ? { kind: "local" }
      : {
          kind: "github",
          repo: {
            owner: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_OWNER || "fltanveer",
            name: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO || "knowledge-base",
          },
        },
  collections: {
    sections: collection({
      label: "Sections",
      slugField: "title",
      path: "content/sections/*/",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        icon: fields.text({ label: "Icon (emoji or icon name)", defaultValue: "📄" }),
        sortOrder: fields.integer({ label: "Sort Order", defaultValue: 0 }),
        content: fields.markdoc({
          label: "Section Overview",
          options: {
            heading: [2, 3, 4] as const,
            image: { directory: "public/images/sections", publicPath: "/images/sections/" },
          },
        }),
      },
    }),
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "content/articles/*/",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        section: fields.relationship({
          label: "Section",
          collection: "sections",
        }),
        description: fields.text({ label: "Description", multiline: true }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        publishedAt: fields.date({ label: "Published Date" }),
        updatedAt: fields.date({ label: "Last Updated" }),
        featured: fields.checkbox({ label: "Featured Article", defaultValue: false }),
        content: fields.markdoc({
          label: "Content",
          options: {
            heading: [2, 3, 4, 5] as const,
            divider: true,
            link: true,
            image: { directory: "public/images/articles", publicPath: "/images/articles/" },
            table: true,
            codeBlock: true,
          },
          components: {
            ImageBlock: block({
              label: "Styled Image",
              schema: {
                src: fields.image({
                  label: "Image",
                  directory: "public/images/articles",
                  publicPath: "/images/articles/",
                }),
                alt: fields.text({ label: "Alt Text" }),
                caption: fields.text({ label: "Caption" }),
                position: fields.select({
                  label: "Position",
                  options: imagePositions,
                  defaultValue: "center",
                }),
              },
            }),
            ImageGallery: wrapper({
              label: "Image Gallery",
              description: "Side-by-side images",
              schema: {
                columns: fields.select({
                  label: "Columns",
                  options: [
                    { label: "2 Columns", value: "2" },
                    { label: "3 Columns", value: "3" },
                    { label: "4 Columns", value: "4" },
                  ],
                  defaultValue: "2",
                }),
                gap: fields.select({
                  label: "Gap Size",
                  options: [
                    { label: "Small", value: "sm" },
                    { label: "Medium", value: "md" },
                    { label: "Large", value: "lg" },
                  ],
                  defaultValue: "md",
                }),
              },
            }),
            Callout: wrapper({
              label: "Callout / Quote",
              description: "Highlighted block for tips, warnings, quotes",
              schema: {
                type: fields.select({
                  label: "Type",
                  options: [
                    { label: "Info", value: "info" },
                    { label: "Tip", value: "tip" },
                    { label: "Warning", value: "warning" },
                    { label: "Danger", value: "danger" },
                    { label: "Quote", value: "quote" },
                  ],
                  defaultValue: "info",
                }),
                title: fields.text({ label: "Title (optional)" }),
              },
            }),
            VideoEmbed: block({
              label: "Video Embed",
              description: "Embed YouTube, Vimeo, or self-hosted video",
              schema: {
                url: fields.url({ label: "Video URL" }),
                type: fields.select({
                  label: "Type",
                  options: [
                    { label: "YouTube", value: "youtube" },
                    { label: "Vimeo", value: "vimeo" },
                    { label: "Self-hosted", value: "video" },
                  ],
                  defaultValue: "youtube",
                }),
                caption: fields.text({ label: "Caption" }),
                aspectRatio: fields.select({
                  label: "Aspect Ratio",
                  options: [
                    { label: "16:9", value: "16/9" },
                    { label: "4:3", value: "4/3" },
                    { label: "1:1", value: "1/1" },
                  ],
                  defaultValue: "16/9",
                }),
              },
            }),
          },
        }),
      },
    }),
  },
});
