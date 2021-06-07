# Real Time Bus Tracker

This project is comprised of two parts, a server to be as proxy for the MTA API
and a simple HTML page that shows the buses information.

## Up and Running

First, copy `.env.example` file to `.env` edit the file with the MTA API key you
can get by registering [here](https://register.developer.obanyc.com/)  and to bring up the proxy server, run:

- `npm i`
- `node index.js` or `npm start`

Edit `index.html` and set you mapbox API key, then open the `index.html` page
in the browser to check the buses information.

Select a stop and enjoy! :)

## Reason to need a proxy server

The MTA api calls do not allow CORS (Cross-Origin Resource Sharing) from the browser
that means that the call has to be done either from the same site or outside a
browser, doing the call from an server side program like this proxy server
bypass that issue.

## Roadmap or future improvements

There's a lot of room to improve! specially in:

- Get the stops from the viewport of the map the user is currently watching
- Update each of the buses using the call from the API, and update the map smoothly and not in one chunk
- Show the buses bearing with an arrow or a icon the heading
