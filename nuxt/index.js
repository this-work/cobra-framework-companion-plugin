/**
 * Cobra-Framework companion plugin with nuxt 2.13+ integration
 *
 * Version 1.0.0
 * Author Tobias Wöstmann
 *
 */

export default function() {

    const { nuxt } = this;

    /**
     * Make sure the nuxt components option is enabled
     */
    if (!nuxt.options.components) {
        throw new Error('please set `components: true` inside `nuxt.config` and ensure using `nuxt >= 2.13.0`');
    }

    /**
     * Require the cobra-framework as parent
     */
    this.requireModule('@this/cobra-framework/nuxt');

    /**
     * List all component dirs
     */
    const componentDirs = [
        'src/theme/icons',
        'src/partials/components',
        'src/partials/frame',
        'src/partials/layout',
        'src/partials/modules'
    ];


    /**
     * Add all partials/components to the parent nuxt instance
     * All folders are separately to prevent a automatic prefix
     */
    this.nuxt.hook('components:dirs', dirs => {
        for (const componentDir of componentDirs) {
            dirs.push({
                path: join(__dirname, '../' + componentDir),
                level: 5,
                extensions: ['vue']
            });
        }
    });

}
