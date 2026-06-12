import preview from '#.storybook/preview'
import { MyButton } from './my-button'

const meta = preview.meta({
  title: 'MyButton',
  component: MyButton,
})

/**
 * This description appears in the docs panel because `meta.story()` calls
 * are correctly recognised as CSF factory stories by `enrichCsfStory`.
 */
export const Primary = meta.story({
  args: { variant: 'primary', children: 'Primary' },
})

/**
 * This description does NOT appear in the docs panel. `enrichCsfStory`
 * checks `storyExport.callee.object.name === "meta"` to detect CSF factory
 * stories, but `.extend()` calls have `callee.object.name === "Primary"`,
 * so `isCsfFactory` is `false`. The enrichment then writes to
 * `Secondary.parameters` instead of `Secondary.input.parameters`, which
 * Storybook never reads.
 */
export const Secondary = Primary.extend({
  args: { variant: 'secondary', children: 'Secondary' },
})
