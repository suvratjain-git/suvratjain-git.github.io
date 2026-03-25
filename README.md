# My Portfolio

Static portfolio website for `www.suvratjain.com`.

## Structure

- `index.html`, `aboutme.html`, `experience.html`, `projects.html`, `resume.html`: main site pages
- `assets/`: shared CSS, Sass, JavaScript, fonts, and PHP helper code
- `assets/data/experience.json`: generated experience timeline data
- `assets/vendor/lightbox/`: vendored Lightbox assets used by the projects gallery
- `content/experience/`: markdown source files for the experience timeline
- `images/`: shared site images
- `Projects/`: project-specific images and supporting documents
- `resume/`: downloadable resume files
- `scripts/build-experience.mjs`: builds timeline data from markdown

## Local Preview

Because this is a static site, you can open the HTML files directly in a browser or run a simple local server:

```sh
npm install
npm run build
npm run serve
```

## Experience Timeline Content

The experience page now renders from markdown content files in `content/experience/`.

To add a new timeline entry:

```sh
cp content/experience/birket-engineer.md content/experience/my-new-role.md
```

Update the frontmatter and markdown body, then rebuild:

```sh
npm run build:experience
```

Required frontmatter fields:

- `title`
- `role`
- `date`
- `year`
- `summary`
- `sort`

Optional frontmatter fields:

- `image`
- `active`

## Notes

- The site is built on top of the HTML5 UP "Massively" template.
- Lightbox is tracked as an npm dependency, but the browser loads a vendored copy from `assets/vendor/lightbox/` so deployment does not depend on publishing `node_modules/`.
