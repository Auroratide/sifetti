# Sifetti

**[Sifetti](https://sifetti.netlify.app)** is a simple note-taking app with one core philosophy: organization is simpler when you _don't_ use folders!

Instead, you **tag** notes, allowing you to accomplish a wide variety of views by filtering for certain tags. If you had ever found yourself wishing you could put the same document into two different folders, Sifetti basically allows you to do just that.

## Example

For example, let's say you are writing a fictional novel, and so far you have notes on four concepts:

* **Frodo Baggins**, a hobbit with an epic destiny
* **The Shire**, peaceful homeland of the hobbits
* **Sauron**, an evil warlord
* **Mordor**, a volcanic wasteland from which Sauron rules

Two of these are characters, and two of these are locations. Naturally, then, it feels like Frodo and Sauron should go in the `characters` folder, and The Shire and Mordor should go in the `locations` folder.

But if you want to look at all your files related to The Shire, which might include Frodo since that's where he lives, what do you do?

Sifetti's philosophy is to use tags instead.

* **Frodo Baggins** - `character`, `the shire`
* **The Shire** - `location`, `the shire`
* **Sauron** - `character`, `mordor`
* **Mordor** - `location`, `mordor`

Sifetti allows you to filter by tags, so you can look at all your characters at once, all your locaations at once, or all notes related to Mordor at once. You can even make more specific queries, such as all characters related to Mordor (which in this case is just Sauron).

## The Value

Folder-based organization is perhaps the most prevelant way digital documents are organized. And yet, there are many domains for which that really isn't the natural way to organize things.

* If you have a library of photos, do you create folders based on location, time period, or who's in the image?
* When coding, there's been a long-standing debate about whether folders are organized by feature or by architectural layer. What if you could do both at the same time?
* Maybe you are learning several different things. Tags can help visualize some of the connections between topics that otherwise felt entirely distinct.

Now of course, tagging is not a new concept. Many technologies use tags or labels already (such as Trello, Github, but Google Drive), but they are usually tied to a more specific domain as well (what if I don't need Trello's columns, for instance?).

Sifetti offers tagging as the first-order method of organizing notes and designed to be general enough to fit a variety of needs.

## Codebase

Sifetti is built on [SvelteKit](https://kit.svelte.dev/). For authentication and data storage, it uses [Supabase](https://supabase.com/).

### Design System

Sifetti uses a component-based design system; that is, the interface is made consistent by the use of standardized design Svelte components with a limited surface area of strongly-typed props.

For example, the `Button` component allows the developer to define color, size, and spacing as props of the component as opposed to raw CSS. As these props are strongly typed with Typescript, buttons throughout the site can be made consistent.

Design components are in [/src/lib/design](/src/lib/design).

**Strengths of this approach:**

* The options for a component are discoverable and well document in code
* Changing the design component propogates to its usage throughout the site
* Behaviour and aesthetics are packaged together, easing the use of the design system

**Weaknesses of this approach:**

* It is sometimes unclear whether a design component is appropriate or a custom div using the CSS variables should be used
* Tends to create a deep hierarchy of non-semantic divs as design components are nested
* Behavioural and aesthetics are packaged together, meaning less modularity

### API

Routes behind `/api` compose a Backend for Frontend (BFF) REST API. Although Supabase can be used directly in client code, it was deliberately chosen for Supabase (and any other services) to be accessed behind the BFF layer for a few reasons:

* Create the protential for rendering more server-side
* Create the opportunity for a true API that could be used in custom software
* Have more fine-grained control around the security of authorization
  * Supabase uses LocalStorage for storing tokens, which is not always as secure as using pure HTTP cookies, for example

**Where is GraphQL?**

GraphQL is not needed on every project. At the moment the scale of Sifetti is small enough to not warrant the need for introducing such a significant chunk of architecture when vanilla HTTP and REST can be used.

### Providers

**Providers** are an abstraction around the things Supabase is used for (auth and storage), providing an action-focused interface agnostic of the underlying technology. Besides providing a way to swap or consolidate vendors, providers also facilitate **[covalent testing](#covalent-testing)** and pave a potential future for running Sifetti purely locally on a filesystem.

### Covalent Testing

Covalent Testing is a strategy for testing with dependencies that minimizes the downsides of using pure stubs without sacrificing some of the benefits. More specifically:

* Stubs are often used in testing to simulate dependencies without needing to connect to said dependencies directly.
  * This speeds up tests substantially, as connecting to true databases or services generally incurs some latency.
  * This makes tests more reliable, as the success of the tests no longer depend on the success of a service that is out of control of the developer (aka, it makes the test more unit-like)
  * They allow developers to simulate failure conditions without actually inducing said conditions on the true dependencies
* Stubs do have a few tradeoffs, though.
  * It is possible to stub a service in such a way that the stub no longer accurately reflects the reality of how that service behaves.
  * A change to the interface of the stubbed service often propogates to all of the stubs.
  * While these tradeoffs can be partially mitigated by testing the stubs themselves, that's not a common practice.

See: [Mocks aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)

The core principle behind covalent testing is to create a **fast, in-memory test double** of the underlying service which behaves as much as needed like the dependency without actually being the dependency. Rather than use the dependency in tests, the test double is used instead; assuming the double and the real dependency behave exactly the same, then using the double in tests is literally as good as using the real dependency, except better because the double is faster and offers more control to the developer.

So the key question is this: how do you ensure the double and real deal actually behave the same? The answer is to write a single suite of tests that runs against _both_ versions. Since the suite of tests is the same for both, and tests ensure the behaviour is as intended, then this allows the double and real dependency to be substitutionally equivalent. That the tests is _shared_ represents the _covalency_ of the strategy.

For an example of this in action, see [/test/lib/notes/provider](/test/lib/notes/provider).

### Development

A `.env` file is required for anything requiring integration with Supabase (mainly integrated tests).

* `npm install` - install dependencies
* `npm run dev` - run the app locally
* `IN_MEMORY_LATENCY=400 npm run dev` - simulate network latency
* `npm run test:all` - run all tests
* `npm t some/filepath` - run the tests under a specific filepath

## Vision

Architecture and design decisions are driven primarily by the vision for the product. Eventually, I could imagine Sifetti becoming more than just the personal notetaking app that it is:

* Perhaps a team can collaborate live with the same set of notes on the cloud
* Perhaps a board could actually be used as a wiki of sorts for a piece of culture
* Perhaps Sifetti could serve as an abstraction over a folder in a filesystem on someone's computer
