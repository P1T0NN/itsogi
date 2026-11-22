# Design Guidelines

These are reusable UX defaults for projects copied from this template. Choose the interaction that fits the user's task and the responsiveness of the actual data source; projects can refine these defaults for their users.

## Filtering: automatic updates or Apply filters

Choose based on how users combine criteria and how quickly results return. An admin or developer page does not automatically require either strategy.

| Situation                                                            | Preferred strategy                                                      |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Simple filters users usually change one at a time, with fast results | Update automatically after a selection.                                 |
| Several criteria users usually configure together                    | Apply filters after the user finishes choosing.                         |
| Slow or costly queries, such as searches across large event logs     | Prefer Apply filters to avoid repeated waits and intermediate requests. |
| Text search with automatic results                                   | Debounce typing before requesting results.                              |

For automatic filtering, show loading feedback and ensure displayed results correspond to the latest selection. Debouncing reduces typing requests but does not combine separate dropdown changes into one request.

For Apply filters:

- Keep edited values separate from the filters used for the displayed results. Editing alone should not refresh the results.
- Support both the Apply filters button and Enter from the search field.
- Make unapplied changes apparent, for example with an “Unapplied changes” indicator. Make applied filters identifiable.
- Keep the current results visible while the user edits; show loading feedback when they apply changes.
- Make Clear filters reset both the inputs and applied filters immediately, then refresh the results.

With either strategy, return to the first page when applied filters change and provide clear empty and error states. Keep the interaction consistent within a filter group; if controls apply at different times, make that behavior explicit.

Reference: [Carbon Design System filtering guidance](https://www.carbondesignsystem.com/building-blocks/core/patterns/filtering).
