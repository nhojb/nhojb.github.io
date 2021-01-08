John Buckley Photography
==================================

Uses the [Zola SSG](https://www.getzola.org/) with [Tera](https://tera.netlify.app/) template engine.

## Zola

Quick summary of Zola:

All content is contained in the `content` directory as Markdown files or assets (images etc).
Templates are stored in the `templates` directory and are used to process the Markdown content.

There are two levels of content:

### 1. Sections

Any directory containing an _index.md file is treated as a section.
The root content directory is the "index" section.

The _index.md contains metadata only. It includes the template used to process the section index page (defaults to `templates/section.html`) and the template used to process all pages for this section (defaults to `templates/page.html`).

### 2. Pages

A section contains one or more pages.

Each page is a single Markdown file or a subdirectory and containing an `index.md` file. For example `content/about.md` would be equivalent to `content/about/index.md`.
Using a subdirectory permits bundling assets with the page.
The Markdown file contains a metadata section, followed by any content. The metadata section contains information like the title, description, date etc.

Markdown content can use Tera variables or be processed using Zola [shortcodes](https://www.getzola.org/documentation/content/shortcodes/).

### Templates

Templates turn content into generated html.

There are three basic templates:

- index.html: used for the root `content/_index.md` file.
- section.html: default template used to process each section's index page.
- page.html: default template used to process each page.

Additional templates may be specified to customise sections and section pages. The template used to process a section are specfied in the section's _index.md metadata.

Templates include standard HTML along with Tera templates. Each template file is passed certain content when processed e.g. `section` object for section templates and `page` object for page templates. Other Zola variables (e.g. `config` and functions are avaliable. Additionally all Tera filters and functions are also available.

Custom 'functions' can be created via Tera [macros](https://tera.netlify.app/docs/#macros)

### Style

Zola defaults to using Sass stylesheets contained in the `sass` directory. Currently we are using the [Bulma](https://bulma.io/) CSS framework.

### Static

Any other assets required for the website (Javascript, logos etc) can be placed in the `static` directory.
