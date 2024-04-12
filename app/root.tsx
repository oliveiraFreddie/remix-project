import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import {
  Form,
  Links,
  Outlet,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
  useRouteError,
  isRouteErrorResponse
} from "@remix-run/react";

import appStylesHref from "./app.css?url";
import { getContacts } from "./data.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// Função que busca os dados na API
export async function loader() {
  const contacts = await getContacts();
  return json(contacts);
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body className="root-error">
        <h1>
          Oops, It's game over.
        </h1>
        <p>
        {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </p>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const contacts = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Link to="contacts/create" className="buttonLink">Create</Link>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div id="detail">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
