# DataList

Pass an array or a promise of an array, `getKey`, and a `children(item)` snippet.
The component handles loading, empty results and generic errors. An optional
`loading` snippet replaces the default spinner.
Pass `pending` to reuse that snippet during a refresh.

For indexable public content, await the primary query in the page using
`$derived(await query)` and pass the resolved array so SSR includes the items.
