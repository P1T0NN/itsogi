# Native components

These components use browser-managed HTML behavior, with existing theme tokens and Button styles. Their open/close interactions require no JavaScript event handlers and work on server-rendered pages before hydration or with JavaScript disabled in supported browsers.

```svelte
<script lang="ts">
	import NativeDialog from '@/components/ui/native-components/native-dialog/native-dialog.svelte';
	import NativeAccordion from '@/components/ui/native-components/native-accordion/native-accordion.svelte';
</script>

<NativeDialog
	triggerLabel="View details"
	title="Observation details"
	description="Details recorded for this observation."
>
	<p class="text-sm">Place your dialog content here, including inputs or forms.</p>
</NativeDialog>

<NativeAccordion title="What gets recorded?" name="observability-help">
	<p>Recorded errors and slow spans appear in the observations table.</p>
</NativeAccordion>
<NativeAccordion title="Where are observations stored?" name="observability-help">
	<p>Your configured exporter chooses the storage destination.</p>
</NativeAccordion>
```

## Dialog

`title` and body content are required. `triggerLabel` is optional: omit it when another button targets the dialog with matching `command` and `commandfor` attributes; otherwise the component renders a Button opener. `description` and `closeLabel` are optional; supply translated labels when needed. The component creates a stable unique ID using Svelte's `$props.id()`, or accepts an explicit `id`. Its Button uses `command="show-modal"` and `commandfor` to open a native `<dialog>`; the close button uses `command="close"`. The browser handles modal focus containment, background inertness, Escape and focus restoration. The title supplies the accessible name.

Native dialog attributes and events are forwarded; `class` customizes its panel. `triggerVariant` (default `outline`) and `triggerClass` style the opener using the existing Button component, for example a link-styled observation name in a table cell. The `open` attribute is deliberately excluded: setting it directly opens a non-modal dialog. To target the dialog from another button, give it an explicit ID and use the same native command attributes on that button. Command buttons should use `type="button"` to avoid submitting an enclosing form.

CSS locks document scrolling while one of these dialogs matches `:modal`, restoring normal scrolling when the last modal closes or is removed. A stable scrollbar gutter prevents horizontal page shifts; the dialog keeps its own scrolling and contains overscroll. This uses `:has()` and requires no JavaScript scroll-lock handlers.

`closedby="any"` requests dismissal when clicking outside as well as Escape; change it to `closerequest` or `none` for stricter dismissal. Support for `closedby` varies separately from support for commands. Browsers without it retain their default modal dismissal behavior and the explicit close button. Forms inside the dialog submit normally; use a separate `<form method="dialog">` when a form should only close the dialog. Avoid nesting this component's dialog inside another form if its body contains a form.

Set `forcedClose` to require an explicit close action:

```svelte
<NativeDialog triggerLabel="View details" title="Details" forcedClose>
	<p>Use the X or Close button to dismiss this dialog.</p>
</NativeDialog>
```

It overrides `closedby` with `none`, disabling backdrop and Escape/platform dismissal in browsers supporting that attribute, and adds a visible footer Close button using `closeLabel`. The dialog body scrolls independently, keeping the header X and footer Close available for long content. Both buttons use native `command="close"`; no handlers are added. Explicit close commands, dialog forms or caller scripts can still close it. `forcedClose` defaults to false.

The Invoker Commands API became Baseline Newly available in December 2025. Older browsers need a JavaScript fallback or polyfill to open this dialog; none is included. Svelte still compiles the component as usual—the browser owns the interaction.

## Accordion

Each component renders one native `<details>` item with a `<summary>` trigger. Its required `title` supplies the summary text. Native details attributes, including `open` and `name`, and events are forwarded. Use `open` for an initially expanded item. Omit `name` to allow independent items, or use the same name for an exclusive group with one item open at a time. Group names apply throughout the document, so use a distinct name for each separate accordion group. The browser owns expanded state and keyboard activation; no manual `aria-expanded` or toggle handlers are needed.

## References

- [MDN: Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [MDN: details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)

## Select

```svelte
<script lang="ts">
	import NativeSelect from '@/components/ui/native-components/native-select/native-select.svelte';
	let severity = $state('all');
</script>

<NativeSelect name="severity" aria-label="Signal type" bind:value={severity}>
	<option value="all">All signals</option>
	<option value="error">Errors</option>
	<option value="slow">Slow spans</option>
</NativeSelect>
```

This is a single-value native select with string values and standard option/optgroup content. Supply an associated label or aria-label. Native attributes such as name, required, disabled and form, and events are forwarded. `value` supports Svelte binding; omitting it leaves native initial selection behavior. Multiple/listbox selection is outside this component's contract.

CSS progressively enhances the select and its `::picker(select)` using `appearance: base-select`. Supporting browsers receive themed picker, option, focus, selected-option and checkmark styles. Other browsers keep the standard native picker. The markup deliberately stays valid for traditional selects, preserving SSR and browser fallback. The browser owns selection, keyboard behavior, validation and form submission; Svelte's optional value binding and application filtering still use JavaScript after hydration. The observations severity filter now uses this component.

[MDN: Customizable select elements](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select)

## Popover

```svelte
<script lang="ts">
	import NativePopover from '@/components/ui/native-components/native-popover/native-popover.svelte';
</script>

<NativePopover triggerLabel="About signals">
	<p>Errors and slow spans are recorded as observations.</p>
</NativePopover>
```

The required `triggerLabel` and body snippet create a native auto popover. A stable generated ID links the Button's popovertarget to the panel. Clicking the trigger toggles it; outside interaction and Escape dismiss it. There are no custom toggle handlers or open-state stores. The labelled section uses the trigger text as its accessible name by default; `label` can override that name.

CSS anchor positioning places the panel below its invoker with viewport-flipping fallbacks where supported. Browsers without position-area use a centered, viewport-bounded panel. This popover does not lock page scrolling. `triggerVariant`, `triggerClass`, panel `class`, an explicit `id` and other native HTML attributes are supported. Popover API support is required; no JavaScript polyfill is included.

[MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using), [MDN: CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using)
