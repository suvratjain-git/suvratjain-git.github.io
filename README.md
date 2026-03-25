# My Portfolio

Static portfolio website for `www.suvratjain.com`.

## Structure

- `index.html`, `aboutme.html`, `experience.html`, `projects.html`, `resume.html`: main site pages
- `assets/`: shared CSS, Sass, JavaScript, fonts, and PHP helper code
- `assets/vendor/lightbox/`: vendored Lightbox assets used by the projects gallery
- `images/`: shared site images
- `Projects/`: project-specific images and supporting documents
- `resume/`: downloadable resume files

## Local Preview

Because this is a static site, you can open the HTML files directly in a browser or run a simple local server:

```sh
npm install
npm run serve
```

## Notes

- The site is built on top of the HTML5 UP "Massively" template.
- Lightbox is tracked as an npm dependency, but the browser loads a vendored copy from `assets/vendor/lightbox/` so deployment does not depend on publishing `node_modules/`.
