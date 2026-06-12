# Storybook CSF factory `.extend()` enrichment repro

Minimal reproduction for a bug in Storybook 10.4.1 where stories created
with `.extend()` are not recognised as CSF factory stories by `enrichCsfStory`.

## Steps to reproduce

```bash
yarn install
yarn build-storybook
# Open storybook-static/index.html, navigate to MyButton → Secondary → Docs
```

Or with the dev server:

```bash
yarn storybook
# Open http://localhost:6006/?path=/docs/mybutton--secondary
```

## Expected

Both the `Primary` and `Secondary` stories display their JSDoc descriptions
and "Show code" source in the docs panel.

## Actual

`Primary` (created with `meta.story()`) shows its description and source
correctly. `Secondary` (created with `Primary.extend()`) shows neither.

## Root cause

`enrichCsfStory` in `dist/_node-chunks/chunk-RYS45SZ5.js` determines whether
a story is a CSF factory story using this check:

```js
isCsfFactory =
  t5.isCallExpression(storyExport) &&
  t5.isMemberExpression(storyExport.callee) &&
  t5.isIdentifier(storyExport.callee.object) &&
  storyExport.callee.object.name === "meta"
```

This matches `meta.story(…)` calls but not `.extend()` calls, because for
`Primary.extend(…)` the callee object is `Primary`, not `meta`.

When `isCsfFactory` is `false`, the enrichment writes docs parameters to
`Secondary.parameters` instead of `Secondary.input.parameters`. At runtime,
Storybook reads from `story.input.parameters.docs`, so the enriched data is
never found.

This is visible in the compiled output (`storybook-static/assets/my-button.stories-*.js`):

```js
// Primary — correct: written to .input.parameters
t.input.parameters = { ...t.input.parameters, docs: { source: {…}, description: {…} } }

// Secondary — wrong: written to .parameters, not .input.parameters
o.parameters = { ...o.parameters, docs: { source: {…}, description: {…} } }
```

## Suggested fix

Extend the `isCsfFactory` check to also match `.extend()` calls:

```js
isCsfFactory =
  t5.isCallExpression(storyExport) &&
  t5.isMemberExpression(storyExport.callee) &&
  (
    (t5.isIdentifier(storyExport.callee.object) && storyExport.callee.object.name === "meta") ||
    (t5.isIdentifier(storyExport.callee.property) && storyExport.callee.property.name === "extend")
  )
```
