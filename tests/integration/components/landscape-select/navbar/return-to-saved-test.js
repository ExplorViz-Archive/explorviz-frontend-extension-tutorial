import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | landscape-select/navbar/return-to-saved', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{landscape-select/navbar/return-to-saved}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#landscape-select/navbar/return-to-saved}}
        template block text
      {{/landscape-select/navbar/return-to-saved}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
