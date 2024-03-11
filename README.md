# r2ls

A simple API to return a list of keys on a Cloudflare R2 bucket.

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`. Alternatively, delete the `bun.lockb` file and use `npm install` if you prefer.
3. Setup the bindings in `wrangler.toml` with your Cloudflare account ID and the name of your workers project. Use the `wrangler.example.toml` file as a template.
4. Run `wrangler login` to login to your Cloudflare account in wrangler
5. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Development

Run `wrangler remote` to start a remote instance of the API which will allow you to access the bucket.
