# blog-quartz

This repository manages the source code and deployment workflow for the Halo2world blog.

## Three-Layer Architecture

The blog is split into 3 repositories with clear responsibilities:

1. Content repository
   - Repository: `haloworld-C/obsidianBase`
   - Mounted here as the `content/` git submodule
   - Stores the Markdown notes, assets, and blog source content
   - This layer is the content authority and should not be edited directly in this repository

2. Build/source repository
   - Repository: `haloworld-C/blog-quartz`
   - Contains the Quartz configuration, components, styles, scripts, and GitHub Actions workflow
   - Pulls content from the `content/` submodule
   - Builds the static site from content plus Quartz code

3. Publish repository
   - Repository: `haloworld-C/haloworld-C.github.io`
   - Receives the built static output from GitHub Actions
   - Serves the final site at `https://haloworld-c.github.io/`

## Publish Flow

The deployment path is:

`haloworld-C/obsidianBase` -> `haloworld-C/blog-quartz` -> `haloworld-C/haloworld-C.github.io`

In practice:

1. Blog content is maintained in `obsidianBase`
2. `blog-quartz` updates the `content/` submodule
3. Quartz builds the static files into `public/`
4. GitHub Actions pushes the generated site to `haloworld-C.github.io`
5. GitHub Pages publishes the final website

## Local Workflow

Typical local workflow for this repository:

1. Pull the latest `content/` submodule changes
2. Update Quartz source code or deployment configuration in this repository
3. Run build and validation
4. Push changes to `main`
5. Let GitHub Actions publish the generated output to `haloworld-C.github.io`

## Notes

- `content/` is a submodule and is treated as the upstream content source
- Static output in `public/` is build output, not the final deployment target
- The final online site is published from `haloworld-C/haloworld-C.github.io`, not from this repository directly
