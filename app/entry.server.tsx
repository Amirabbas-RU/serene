import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import type {AppLoadContext, EntryContext} from 'react-router';
import {ServerRouter} from 'react-router';
import {createElement} from 'react';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
): Promise<Response> {
  const body = await renderToReadableStream(
    createElement(ServerRouter, {
      context: routerContext,
      url: request.url,
    }),
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent') || '')) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
  return new Response(body, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
