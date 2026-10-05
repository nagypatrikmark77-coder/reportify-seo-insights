<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep report demo fixtures and deterministic period comparisons in a browser-safe data module; no live service calls until credentials are connected.
- Use the index route for the report workspace and separate components for report sections; shared report state drives the editor and client preview together.
- Use global semantic design tokens and existing UI controls to maintain the SEOKLIKK brand across report types.
- Print export uses the same report content with print styles; never label browser print as a generated downloadable PDF.
