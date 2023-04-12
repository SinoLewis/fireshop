# Fireshop

The Fireshop online shop platform frontend built with Svelte, Tailwind, Hugo, Firebase, & Flamethrower.

## Live Site

You can view the [demo site](https://fire-shop.netlify.app)

## Dev Assistance

All static content is managed with Hugo in the `content` dir. You can easily extend your ideas directly by forking this repo.

## Getting started local

First, install [Hugo Extended](https://gohugo.io/getting-started/installing/) ver `0.101.0` or greater.
Then Fork the repository and start you development.

```
git clone https://github.com/<your_username>/<repository_name>.git
git checkout -b <your_dev_branch_name>
npm install
npm start
```

Check it on on `http://localhost:6969/`.

## Getting started with docker

First make sure you have [docker](https://docker.com) installed in your system

Then build the docker repo image by:

```
docker build . -t fireshop
```

This will build the image required to run the repo inside a docker container

```
docker run -p 6969 fireshop
```

Check it on on `http://localhost:6969/`.

<!-- [![Build Status](/static/img/delivery.png)](https://travis-ci.org/username/repo) -->

## Developing Components

Create a Svelte file in the `app/components` directory. It must have a custom element tag.

```svelte
<svelte:options tag="cart-info" />

<script>
    export let info: string;
</script>

<h1>Good cookup sesh! {info}</h1>
```

Export the component from `app/main.ts` as per [svelte docs](https://webcomponents.dev/docs/svelte):

```ts
export * from "./components/hi-mom.svelte";
```

Now use it in anywhere in your HTML or Markdown.

```html
<hi-mom greeting="i made a web component"></hi-mom>
```

**Note 1:** Web components styles are encapsulated through the [Shadow DOM](https://web.dev/shadowdom-v1/). Global styles will not work as part of Shadow DOM concept of styling.
**Note 2:** You can use Tailwind, with `@apply` in the component or the css used by [tailwindcss docs](https://v2.tailwindcss.com/docs).

## Commands

- `npm start`: Main dev server. Runs everything you need.
- `npm run svelte:serve`: Runs components in isolation. Serves `app/index.html` as a playground for components.
- `npm run hugo:serve`: Only runs static site.
- `npm run dev`: Concurrently rebuilds changes in svelte & runs hugo server.
- `npm run build`: Build for production
