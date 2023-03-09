# ChartIQ Angular Application

## Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Customization](#customization)
- [Enabling plug-ins](#enabling-plug\-ins)
- [Customizing Webpack](#customizing-webpack)
- [Questions and support](#questions-and-support)
- [Contributing to this project](#contributing-to-this-project)


## Overview

The ChartIQ Angular application is a toolkit of components that enable you to build charting applications in the Angular framework. The components include everything from a basic chart to a complex, active trader desktop:

- `AdvancedChartComponent` &mdash; Creates a full-featured chart with a fully developed user interface
- `MultiChartComponent` &mdash; Displays two advanced charts on screen simultaneously
- `ActiveTraderComponent` &mdash; Sets up an information-rich desktop for traders who trade frequently
- `TermStructureComponent` &mdash; Creates a term structure chart for working with non&ndash;time series data
- `CustomChartComponent` &mdash; Integrates native Angular components with ChartIQ W3C-standard web components
- `HelloWorldComponent` &mdash; Creates a basic chart with no user interface as a starting point for your Angular app

The ChartIQ Angular application was built using the Angular 13 framework with [Angular CLI](https://cli.angular.io) support.

**Note:**

- This application has been designed to simplify the transfer of modules such as `src/app/active-trader-workstation` to other applications. We don't expect that developers will use the application as is with all modules included. So, to make transferring modules easier, we more or less duplicated resource and service files in each module.

- For an example of creating a chart user interface entirely with native Angular components, see the [chartiq-angular-seed](https://github.com/ChartIQ/chartiq-angular-seed) project.

## Requirements

A copy of the ChartIQ library; works best with version 8.9.0 or later.

If you do not have a copy of the library, please contact your account manager or send an email to <info@cosaic.io>.

To get a free trial version of the library, go to the ChartIQ <a href="https://cosaic.io/chartiq-sdk-library-download/" target="_blank">download site</a>.

## Getting started

To implement this project:

1. Clone the repository
2. Extract the contents of your zipped ChartIQ library package
3. Copy the tarball (.tgz file) from the extracted library package into the root of this project
4. Run the following commands from the root of the project:
    - `npm install ./chartiq-x.x.x.tgz` to install the charting library
    - `npm install` to install the rest of the dependencies
    - `npm start` to start up the development server
5. Open your browser to [http://localhost:4200](http://localhost:4200) to load the application

**Note:** When you are upgrading or changing your license, we recommend that you completely remove the old library before reinstalling the new one, for example:

```sh
npm uninstall chartiq
npm install ./chartiq-x.x.x.tgz
```

## Customization

### HTML templates

The HTML templates of `AdvancedChartComponent`, `CustomChartComponent`, `ActiveTraderComponent`, and `TermStructureComponent` are collections of ChartIQ's user interface web components. You can customize the chart user interface by adding, removing, or modifying UI components. You can also add your own custom Angular components.

### Configuration

You can configure a variety of chart features by modifying the configuration object provided to the component definition files of `AdvancedChartComponent`, `CustomChartComponent`, `ActiveTraderComponent`, and `TermStructureComponent`. Look for the call to `getConfig` in the resources files.

A default configuration is part of the ChartIQ library. See the [Chart Configuration](tutorial-Chart%20Configuration.html) tutorial for all the configuration details.

You can also modify the CSS in the style sheet files associated with `AdvancedChartComponent`, `CustomChartComponent`, `ActiveTraderComponent`, and `TermStructureComponent`. See the [CSS Overview](https://documentation.chartiq.com/tutorial-CSS%20Overview.html) tutorial for information on customizing the chart look and feel.

### Component customization

ChartIQ web components can be customized by extending the web component classes. Customization code should run at the time the chart and user interface are created; that is, in the `createChartAndUI` method. We recommend keeping all customization code in a single file or folder to simplify library version upgrades.

Here's an example of customizing the `cq-chart-title` component:

```js
// Access the web component classes.
import { CIQ } from 'chartiq/js/componentUI';

// Access the class definition of the web component.
const ChartTitle = CIQ.UI.components('cq-chart-title')[0].classDefinition;

// Extend the web component class.
class CustomChartTitle extends ChartTitle {
    update() {
        // Execute the original method.
        super.update();
        // Update the chart title.
        const { symbol, symbolDisplay } = this.context.stx.chart;
        // If symbolDisplay is available, use it in the document title.
        if (symbolDisplay) {
            document.title = document.title.replace(symbol, symbolDisplay);
        }
    }
}

// Update the web component definition.
CIQ.UI.addComponentDefinition('cq-chart-title', CustomChartTitle);
```

### Component integration

`CustomChartComponent` integrates native Angular components with ChartIQ's W3C-standard web components.

The `cq-angular-recent-symbols` component provides an example of wrapping and enhancing a web component with an Angular component. `cq-angular-recent-symbols` adds a RECENT tab to the lookup controls created by ChartIQ's `cq-lookup` and `cq-comparison-lookup` web components. The RECENT tab displays a list of recently used financial instrument symbols maintained by the `cq-angular-recent-symbols` component.

The `cq-angular-shortcut-dialog` component is an example of an Angular component accessed by a web component. User interaction with a dropdown menu created by a ChartIQ `cq-menu` web component opens the dialog box created by the `cq-angular-shortcut-dialog` component. The dialog box enables users to set shortcut keys on the chart's drawing tools.

## Enabling plug-ins

The ChartIQ library comes with a variety of plug-ins that add enhanced functionality to charts. The ChartIQ Angular application comes with the plug-ins built in but not enabled.

**Note:** Plug-ins are optional extras that must be purchased. To determine the plug-ins included in your library, see the *./node_modules/chartiq/plugins* folder.

The application includes the ChartIQ plug-ins as component resources that are enabled by uncommenting the relevant imports in the component resources file.

For example, to enable the Trade from Chart (TFC) plug-in for `AdvancedChartComponent`, uncomment the following lines in the [resources.ts](./src/app/chartiq/components/resources.ts) file in the *./src/app/chartiq/components/* folder:

```ts
// import 'chartiq/plugins/tfc/tfc-loader';
// import 'chartiq/plugins/tfc/tfc-demo';
```

To enable the Market Depth chart and L2 Heat Map for `AdvancedChartComponent`, uncomment the following lines in [resources.ts](./src/app/chartiq/components/resources.ts):

```js
// import 'chartiq/plugins/activetrader/cryptoiq';

// import 'chartiq/examples/feeds/L2_simulator'; /* for use with cryptoiq */
```

and the following line in [chart.service.ts](./src/app/chartiq/chart.service.ts):

```js
// CIQ['simulateL2']({ stx: this.stx, onInterval: 1000, onTrade: true });
```

## Customizing Webpack

This project uses custom webpack builder to make sure that the all library features work and for the ease of customization (for information on Webpack customization follow the instructions in [@angular-builders/custom-webapck](https://www.npmjs.com/package/@angular-builders/custom-webpack)). The configuration can be found in _custom-webpack.config.js_ file. By default, it includes a loader to make sure all assets imported by the library are handled correctly.

The ChartIQ library makes use of `import.meta` API. If you are using Webpack 4 in your project (Angular versions below 12) then you will need to use a plugin like the [Import Meta loader](https://www.npmjs.com/package/@open-wc/webpack-import-meta-loader). For specific instructions see the ChartIQ 8.4 Update log [here](https://documentation.chartiq.com/tutorial-Upgradelog_8.3.0-8.4.0.html).

## Questions and support

- Contact our development support team at [support@chartiq.com](mailto:support@chartiq.com).
- See our SDK documentation at https://documentation.chartiq.com.

## Contributing to this project

Fork it and send us a pull request. We'd love to see what you can do with our charting tools in Angular!
