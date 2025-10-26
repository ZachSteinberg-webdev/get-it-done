# Get It Done!

This is my production task manager, “Get It Done!”.  
It looks like a physical desk — lined paper, a coffee ring, a pen, a calculator you can actually drag and rotate — but it behaves like a multi-user web app with accounts, sessions, persistence, and guardrails. You can use it in “guest mode” instantly with no signup, and if you later register, I migrate everything (lists, items, even where you left the calculator) into your new account.

---

## High-Level Overview

**Live stack**

- Node.js / Express app
- Server-rendered EJS templates
- Vanilla JS modules for interactivity (no front-end framework dependency)
- MongoDB Atlas with Mongoose models
- Passport local auth (email + password)
- Session storage in MongoDB via `connect-mongo`
- Helmet for security headers / CSP
- `express-mongo-sanitize` to defend against NoSQL injection
- Custom guest mode that behaves like a logged-in session but writes only to local storage, not the permanent database

**Core features**

- Multiple to-do lists per user (Personal vs Professional categories)
- Unlimited items per list: due date, priority (1–5 stars), completion checkbox
- Inline edit / delete of both lists and list items
- Responsive layouts for desktop, tablet, and <400px phones (I ship separate markup for tiny screens so the UI stays finger-friendly)
- A draggable “workspace” layer (pen, coffee cup, stain ring, calculator widget) that remembers positions per user
- Account settings: change name, change email, change password
- Graceful logout with confirmation
- Flash messaging and error feedback everywhere (success, validation failure, etc.)
- Full “try it now” guest mode with zero friction

**Why this matters**

Most “to-do list” demos stop at CRUD. I treated this like a product I’d deploy:

- Anonymous onboarding that still feels real (guest mode)
- Data migration when a guest upgrades
- Session security and sanitization on all writes
- Separation between persisted data (MongoDB via models) and ephemeral exploration data (session + localStorage sync)
- UI that works across breakpoints and is still usable with just basic HTML forms

---

## Table of Contents

1. [Tech Stack](#tech-stack)
   - [Runtime / Server](#runtime--server)
   - [Views & Client](#views--client)
   - [Database / Models](#database--models)
   - [Auth & Session](#auth--session)
   - [Styling / UX](#styling--ux)
2. [Core Features / Core Flow](#core-features--core-flow)
   - [1. Onboarding & Guest Mode](#1-onboarding--guest-mode)
   - [2. Managing Lists & Items](#2-managing-lists--items)
   - [3. Desktop Workspace / Calculator](#3-desktop-workspace--calculator)
3. [Security / Reliability / Abuse Handling](#security--reliability--abuse-handling)
   - [1. Session & Auth](#1-session--auth)
   - [2. Input Validation & Sanitization](#2-input-validation--sanitization)
   - [3. Guest Mode Safety](#3-guest-mode-safety)
   - [4. Concurrency Control for Guest Sessions](#4-concurrency-control-for-guest-sessions)
   - [5. Cookies & Sensitive Data](#5-cookies--sensitive-data)
   - [6. Helmet / CSP / Mongo Sanitize](#6-helmet--csp--mongo-sanitize)
   - [7. Error Handling & 404s](#7-error-handling--404s)
4. [Operational Notes](#operational-notes)
   - [Environment Variables / Secrets](#environment-variables--secrets)
   - [Persistence & Session Store](#persistence--session-store)
   - [Guest Data Lifecycle / Retention](#guest-data-lifecycle--retention)
   - [Responsive Layout Strategy](#responsive-layout-strategy)
5. [What Makes This Interesting](#what-makes-this-interesting)

---

## Tech Stack

### Runtime / Server

- Express handles routing, sessions, and flash messaging.
- Passport (`passport-local`) is used for username/password auth.
- `connect-mongo` stores session data in MongoDB, so users stay logged in across server restarts.
- I use my own async wrapper (`tryCatch(fn)`) and `CustomError` class so all async routes fail in a consistent, reportable way instead of crashing the process.
- Centralized error handler decides whether to render a 404 page, re-render with validation errors, or redirect the user with a flash message.

Key server middleware:

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(mongoSanitize());
    app.use(helmet(...));
    app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

### Views & Client

- All main views are server-rendered EJS templates (`views/pages/*.ejs`):
  - `/login`, `/register`
  - `/lists` (your lists)
  - `/list/:listId` (items in a specific list)
  - User settings modal, logout modal, etc.
- I progressively enhance with modular vanilla JS (in `/public/javascript`):
  - `toDoLists.js`, `toDoList.js`: open/close inline edit modals, submit forms, handle focus trapping, handle “are you sure?” confirmations.
  - `desktopItems.js`: drag the pen / coffee cup / calculator around, rotate the calculator, and persist those coordinates.
  - `guestModeRuntime.js`: marks the page as “guest mode,” disables restricted controls, and shows a “You’re in guest mode” banner with upgrade CTA.
  - `login.js` / `register.js`: client-side polish, password visibility toggles, “next step” flows, etc.
  - `global.js`: shared behaviors like ESC-to-close-modals, burger menu behavior, etc.

All core flows still work with basic HTML forms and server POST routes. JavaScript mainly upgrades UX:

- Inline edit instead of navigating away
- Pop-up modals that trap focus and announce errors
- Updating draggable item positions without a full reload

### Database / Models

MongoDB (via Mongoose) stores three main collections:

1. User

   - `userName`
   - `userEmail`
   - Password hash/salt via `passport-local-mongoose` (I never store raw passwords)
   - `desktopItems`: where the user left the calculator / pen / coffee cup / stain ring on the “desk”
     - For each object I persist:
       - `xPosition`, `yPosition`
       - For the calculator I also store `rotation` in degrees
   - `accountCreationDate`

2. ToDoList

   - `listName`
   - `listCategory` (enum: `"personal"` or `"professional"`)
   - `listOwner` (ObjectId reference to the User)
   - `creationDate`

3. ToDoListItem
   - `itemText` (task description)
   - `itemDueDate` (a date string; UI enforces `min=<today>`)
   - `itemPriority` (1–5)
   - `itemIsCompleted` (boolean)
   - `itemOwner` (ObjectId reference to the parent list)

For guests, I mirror the same shape, but I keep it in local storage for persistence instead of inserting into Mongo.

### Auth & Session

- Login uses Passport’s local strategy with email as the “username”.
- Sessions are managed with `express-session` + `connect-mongo`:
  app.use(session({
  store: MongoStore.create({ mongoUrl: process.env.MONGO_ATLAS_URL, ... }),
  name: 'u9r328293r8u34', // non-default cookie name
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
  httpOnly: true,
  expires: process.env.SESSION_EXPIRATION,
  maxAge: Number(process.env.SESSION_MAX_AGE)
  }
  }));

- I expose `req.user` to views the same way whether you’re a registered user or a guest:
  - If you're logged in normally, `req.user` comes from Passport.
  - If you’re in guest mode, I synthesize a “fake user” object from session data and attach it to `req.user` so the rest of the app (views, partials, etc.) doesn’t have to special-case every single thing.

### Styling / UX

- The visual metaphor is a messy desk:
  - A classic lined paper notepad for lists.
  - Coffee stain rings, pen, coffee cup, and a chunky 90s-style calculator with complete basic calculator functionality.
  - You can drag those props around. The app remembers where you left them.
- I ship two sets of form markup for different breakpoints:
  - Example: `toDoLists.ejs` renders one “new list” form for >400px width and a completely different, touch-optimized structure for <400px.
  - Same idea under 700px for list items.
  - The CSS just hides the version that doesn’t apply. This gives me exact control of layout, tap targets, and field grouping on tiny screens without having to dynamically restructure the DOM with JS.
- All modals trap focus and expose “Cancel” and “Save” as explicit buttons. Escape key and backdrop click both close the modal.
- Reusable partials (`views/partials/*.ejs`) let me keep nav, banners, footers, calculator markup, logout confirmation, etc. consistent across pages.

---

## Core Features / Core Flow

### 1. Onboarding & Guest Mode

You do not have to register to try the app.

Flow:

1. You land on `/login`.
2. You can log in with email/password, OR click “Enter Guest Mode.”
3. If you choose guest mode:
   - The server creates a guest session and attaches a full “user-like” object to `req.session.guest`.
   - I send down a bootstrap blob of that data inside a `<template id="guest-mode-bootstrap-data">…</template>` element (so there’s no executable inline script).
   - On the client, `guestModeRuntime.js` writes a copy to `localStorage` so refreshes feel persistent even before you make an account.
   - The UI clearly marks that you’re in guest mode. The nav bar swaps “Logout” for “Register”, and the Settings button is disabled with a tooltip that says you can’t edit profile settings until you register.

While you’re in guest mode:

- You can create lists.
- You can add items with due dates and priorities.
- You can drag desk objects around.
- You can close and reopen modals.
- You basically get the full product.

If you later decide to register:

1. You submit the registration form.
2. On successful registration, I take everything from your guest session in local storage (lists, items, desktop object coordinates) and write it to Mongo under the new User record.
3. I then mark the session so the layout emits a `data-clear-guest-storage` flag and the shared module wipes `localStorage` copies of guest data on the next load.
4. The next load you’re now a “real” user with the same lists you created as a guest.

That migration step matters. It’s very common for “demo mode” data to get thrown away; I’m keeping it and carrying it forward automatically.

### 2. Managing Lists & Items

Lists:

- Each list has:
  - A name
  - A category (`personal` or `professional`)
  - An owner
- I render all of your lists on `/lists` with edit / delete / view buttons.
- You can rename a list or change the category inline. I pre-fill the modal inputs with server-rendered values so you don’t lose context.
- List creation works both in desktop layout and in the “<400px width” layout. They’re separate forms because the mobile version collapses multiple fields into a vertical stack with bigger hit areas.

Items:

- Each item has:
  - Text (the task)
  - Due date (HTML `date` input with a `min` set to today so you can’t pick a past date from the UI)
  - Priority (1-5 stars)
  - Completion state (checkbox)
- `/list/:listId` shows all items for a single list.
- Every item gets an edit modal with:
  - Inline task text editing
  - Due date picker
  - Priority stars, pre-selected based on current value
  - A checkbox to mark “done”
  - Buttons for “Save changes” and “Cancel”
  - A “Delete item” control
- When you submit the edit form:
  - I POST to `/list/edit/:listItemId`.
  - On the server I update either:
    - The guest session’s in-memory item (if you’re a guest), OR
    - The actual Mongo `ToDoListItem` document (if you’re a registered user).
  - The response redirects back to `/list/:listId` with a flash message.

No JavaScript trickery is required to persist data. All mutations run through normal POST routes. JavaScript just makes it feel more like a native app.

### 3. Desktop Workspace / Calculator

Above the lists/items content there’s a simulated “desk”:

- A pen
- A coffee cup
- A coffee stain ring
- A calculator widget

All of these elements:

- Are absolutely positioned.
- Are draggable by mouse / touch.
- Remember their `xPosition` / `yPosition`, and the calculator also remembers its `rotation` value.
- Send a POST to `/user/desktop` whenever you drop them, so I update:
  user.desktopItems[itemId].xPosition = newX
  user.desktopItems[itemId].yPosition = newY
  user.desktopItems[itemId].rotation = newRotation (calculator only)

The calculator:

- Is a working calculator with memory buttons, %, etc.
- Has a digital 7-segment style font.
- Can be “tilted” (rotated) and I persist that angle.
- Lives entirely client-side for math, but I do persist the position/rotation server-side.

This is me demonstrating I can couple playful UI with state that survives a page reload, survives logout/login, and even survives converting from guest → permanent account.

---

## Security / Reliability / Abuse Handling

### 1. Session & Auth

- Every route that mutates data is behind an `isLoggedIn` middleware.
- `isLoggedIn` considers you “logged in” if:
  - Passport says you’re authenticated (normal user), OR
  - You’re in an active guest session.
- If neither is true, I redirect you to `/login` with a flash message like:
  You must be logged in to do that.

So there’s no unauthenticated POST route that can randomly create lists on behalf of some other user. The browser always needs either a registered session cookie or a valid guest session.

### 2. Input Validation & Sanitization

I do not trust client input. On the server I:

- Strip out Mongo operator characters using `express-mongo-sanitize`. This prevents payloads like  
   { "$gt": "" }
  from turning into NoSQL injection.
- Enforce enums and required fields in my Mongoose schemas:
  - `listCategory` must be `"personal"` or `"professional"`.
  - `itemPriority` must be `"1"`–`"5"`.
  - `itemText`, `listName`, `userName`, etc. have `required: true` and length limits.
- Normalize and bound values when I copy data into session for guests. The guest utilities (`guestMode.js`) explicitly sanitize strings, coerce numbers, and ensure only known fields get persisted. I never just `Object.assign(req.body)` into session or Mongo.
- Treat checkboxes that weren’t submitted as explicit `false` when editing an item:
  if(Object.keys(req.body).length === 0){
  req.body.toDoListItemIsCompleted = false;
  }

That prevents “undefined means true forever” bugs.

### 3. Guest Mode Safety

Guest mode is intentionally powerful — you can create, edit, and delete lists and items — but it’s scoped tightly:

- Guest data lives under `req.session.guest`, not in the main MongoDB collections.
- I store an in-memory structure like:
  {
  user: { userName, userEmail, desktopItems... },
  lists: [ ... ],
  items: [ ... ],
  counters: { nextListId, nextItemId }
  }
- On each guest mutation:
  - I validate and sanitize.
  - I check that the list/item actually exists in the guest session before mutating.
  - If you try to update or delete something that doesn’t exist, I flash an error like  
     Sorry! That list item doesn't exist.
    and redirect you somewhere safe.

When a guest signs up and becomes a permanent user:

- I insert their sanitized lists / items / desktop positions into MongoDB under the new User.
- I then mark the session with `clearGuestStorage = true`. The layout template (`boilerplate.ejs`) now emits a `data-clear-guest-storage` attribute instead of an inline script, and `global.js` sees that flag and wipes `localStorage` / `sessionStorage` keys related to guest mode.
- After migration, guest data is no longer referenced by the server.

This is deliberate privacy hygiene. I don't quietly keep orphaned “guest” task data forever.

### 4. Concurrency Control for Guest Sessions

A subtle problem with guest mode is race conditions. A guest can double-click “Save,” or open two tabs and edit the same list at once. If I just mutated `req.session.guest` in parallel, writes could stomp each other.

To avoid that:

- I keep a per-session queue (`guestSessionQueues`) in memory.
- All guest writes go through `runGuestSessionMutation(session, fn)`:
  - The request is enqueued.
  - I run the mutation function in sequence.
  - I save the updated session before resolving the next mutation.
- While a mutation is running, other guest writes for that same session wait.

Even for anonymous users I treat state updates like critical sections so I don't silently lose data.

### 5. Cookies & Sensitive Data

- Session cookie:
  - Custom name (`u9r328293r8u34` instead of the default `connect.sid`).
  - `httpOnly: true`, so JS in the browser can’t read it.
  - `maxAge` and `expires` come from environment variables so I can tune how long a session survives inactivity.
- Session data in Mongo is encrypted at rest using a `crypto.secret` passed to `connect-mongo`.
- I never expose secrets (session secret, store crypto secret, etc.) to the client.
- Passwords are hashed+salted by `passport-local-mongoose`. I never manually store plain text passwords.

### 6. Helmet / CSP / Mongo Sanitize

I use Helmet with:

- A Content Security Policy that only allows scripts from `'self'`.
- `referrerPolicy: "same-origin"` so I’m not leaking cross-site navigation data.

I also run:

- `express-mongo-sanitize()` on every request to strip `$` / `.` from query bodies, as a first layer of defense against NoSQL injection attempts.

### 7. Error Handling & 404s

I centralize all error handling in `utilities/errorHandling.js`:

    const tryCatch = (fn)=>{
        return (req,res,next)=>{
            fn(req,res,next).catch(next);
        };
    };

Every async route is wrapped in `tryCatch`, so unexpected throw/reject flows straight into my custom `errorHandler`.

`errorHandler`:

- Logs metadata (status, message, named route).
- Differentiates between:
  - 404-ish errors (bad IDs, nonexistent lists/items),
  - validation / auth failures (like invalid registration),
  - everything else (500).
- Renders a friendly 404 page for unknown routes.
- Falls back to redirect + flash message on recoverable failures, so the user gets context like  
   Guest mode users can't do that. Please create an account to unlock this feature.

---

## Operational Notes

### Environment Variables / Secrets

I manage behavior using environment variables. Examples:

- `MONGO_ATLAS_URL`  
  MongoDB Atlas connection string for app data and session storage.

- `LOCAL_DATABASE`  
  Local Mongo URL for development.

- `COOKIE_PARSER_SECRET`  
  Secret for `cookie-parser` so I can sign and verify cookies.

- `SESSION_SECRET`  
  Secret for `express-session`; used to sign the session ID cookie.

- `SESSION_EXPIRATION` / `SESSION_MAX_AGE`  
  How long sessions should live. I surface these in the cookie config (`expires` / `maxAge`) so inactive sessions age out.

- `MONGO_STORE_SECRET`  
  Secret passed to the `connect-mongo` store’s `crypto.secret`, so session payloads written to Mongo are encrypted.

Nothing in these env vars is shipped to the browser. They only live server-side.

### Persistence & Session Store

- App data (users, lists, list items) lives in MongoDB Atlas.
- Auth sessions also live in Mongo via `connect-mongo`, so restarts won't log everyone out.
- I set `touchAfter` to reduce how often the session store writes. That lets sessions exist for a predictable duration without hammering the database on every request.

  const store = MongoStore.create({
  mongoUrl: process.env.MONGO_ATLAS_URL,
  touchAfter: 24*60*60, // only update session once per day unless data changed
  crypto: { secret: process.env.MONGO_STORE_SECRET }
  });

### Guest Data Lifecycle / Retention

Guest data intentionally does NOT hit the permanent user collections until you ask for it to:

- While you’re a guest:
  - Lists/items live in `req.session`.
  - A mirror copy goes into `localStorage` so refreshes feel persistent.
- When you come back later in guest mode:
  - I bootstrap from either the live session OR (if the server session expired) your localStorage snapshot, and then re-sync that into a new session.
- When you register:
  - I write that data into real Mongo documents under your new user ID.
  - I tell the browser to wipe `localStorage` and `sessionStorage` keys (`guestModeData`, `guestModeAlertDismissed`) so I’m not silently holding onto stale copies.
- After migration:
  - The session flips from “guest” to an authenticated user session.
  - The guest structures are dropped.

So you get a smooth “play with it first” experience without me storing anonymous personal task data forever.

### Responsive Layout Strategy

Instead of trying to force one DOM structure to work at every size with a giant pile of CSS overrides, I render separate markup blocks for key breakpoints:

- One “new list” form for desktop/tablet.
- A separate “new list” form for <400px.
- One “new item” form for >700px.
- A simpler “new item” form for phones.

CSS media queries hide whichever version doesn’t apply.

That gives me:

- Bigger tap areas and simplified groupings on phones.
- More horizontal layout and inline controls on desktop.
- Cleaner accessibility, because each version can have its own tab order, labels, `aria` hints, etc., instead of trying to dynamically rearrange a single form at runtime.

It also means screenshots of the app on mobile don’t look like a squished desktop form with 10pt text — they look designed.

---

## What Makes This Interesting

- I built a real guest mode.  
  You can create lists, reorder your pseudo-desk, and generally behave like a full account with no signup. Behind the scenes, I treat that guest session like a first-class user: it has a “user profile,” its own lists, its own to-do items, and even its own saved calculator rotation.

- Migration from guest → registered user is seamless.  
  When you finally register, I don’t discard your work. I promote your guest session data into real MongoDB documents, associate them with your new account, and then clean up guest storage on both the server and the browser. It feels like “your same stuff just became permanent,” because it actually did.

- I take concurrency and data integrity seriously, even for anonymous sessions.  
  Every guest mutation (create list, edit item, reposition calculator, etc.) runs through a per-session queue so two rapid clicks don’t stomp each other. This is the same mental model I’d use in a production system with optimistic/concurrent edits.

- The UI is playful but also stateful.  
  The draggable desk items aren’t just decoration. Their state is persisted per user, and that state survives full reloads, new sessions, and account upgrades.

- I’m thinking about security and user trust.  
  I sanitize all input on the server before it ever touches Mongo.  
  I sign and protect sessions with httpOnly cookies and encrypted session storage.  
  I run Helmet with CSP and a reduced referrer policy.  
  I never store raw passwords.  
  I don’t inject analytics or 3rd-party tracking.

- It’s an actual deployed-style service, not just a static demo.  
  The app has:
  - Auth
  - Session management
  - Flash messaging
  - Settings / password change
  - A 404 page
  - Error handling middleware
  - Production-friendly session storage in Mongo
  - Environment-based secrets
  - A UX that adapts for mobile instead of just shrinking

In other words: this isn’t “yet another CRUD todo list.” It’s a small, opinionated, production-minded web app that tries to respect the user’s time, data, and expectations from the first click.
