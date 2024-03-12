export interface Env {
  BUCKET: R2Bucket,
  AUTH_KEY: string,
}

// Check requests for a pre-shared secret
const hasValidHeader = (request: Request, env: Env) => {
  return request.headers.get('X-Auth-Key') === env.AUTH_KEY;
};

function authorizeRequest(request: Request, env: Env) {
  switch (request.method) {
    case 'GET':
      return hasValidHeader(request, env);
    default:
      return false;
  }
}

export default {
	async fetch(request: Request, env: Env) {
		if (!authorizeRequest(request, env)) {
      return new Response('Forbidden', { status: 403 });
    }

		const url = new URL(request.url);
		const prefix = url.pathname.slice(1);
		const cursor = url.searchParams.get('cursor');
		const onlyKeys = url.searchParams.get('onlyKeys') === 'true';
		const listOptions: R2ListOptions = { prefix, limit: 1000 };

		if (cursor) {
			listOptions.cursor = cursor;
		}

		switch (request.method) {
			case 'GET':
				const listResponse = await env.BUCKET.list(listOptions);
				const list = {
					keys: [] as R2Object['key'][] | string[] | undefined,
					...listResponse,
				};

				if (onlyKeys) {
					list.keys = listResponse.objects.map((object) => object.key);
					delete list.objects;
				} else {
					delete list.keys;
				}

				const headers = new Headers();
				headers.set('Content-Type', 'application/json');

				return new Response(JSON.stringify(list), {
					headers,
					status: 200,
				});

			default:
				return new Response(`${request.method} is not allowed.`, {
					status: 405,
					headers: {
						Allow: 'GET',
					},
				});
		}
	},
};