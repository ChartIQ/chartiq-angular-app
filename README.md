# ChartIQ Angular application

- [Overview](#overview)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Customization](#customization)
- [Enabling plug-ins](#enabling-plug\-ins)
- [Questions and support](#questions-and-support)
- [Contributing to this project](#contributing-to-this-project)


## Overview

The ChartIQ Angular application is the equivalent of ChartIQ's *technical-analysis-chart.html* advanced template in an Angular environment. See the [ChartIQ demo](https://demo.chartiq.com) for an example implementation of the template.

The application is built using the Angular 8.0 framework with [Angular CLI](https://cli.angular.io) support. A custom service, `ChartService`, connects the `AdvancedChartComponent` template UI markup with the ChartIQ library API and UI context.

## Requirements

- A copy of the ChartIQ library, version 7.5.0 or later.

    If you do not have a copy of the library, please contact your ChartIQ account manager or send an email to [support@chartiq.com](mailto:support@chartiq.com).

## Getting started

To implement this project, do the following:

1. Clone the repository
2. Extract the contents of your zipped ChartIQ library package
3. Copy the tarball (.tgz file) from the extracted library package into the root of this project
4. Run the following commands from the root of the project:
    - `npm install ./chartiq-x.x.x.tgz` to install the charting library
    - `npm install` to install the rest of the dependencies
    - `npm start` to start up the development server
5. Open your browser to [http://localhost:4200](http://localhost:4200) to see the working application

## Customization

The `AdvancedChartComponent` template is a collection of ChartIQ's UI components. You can customize the chart user interface by modifying the template, including adding your own custom Angular components.

You can configure a variety of chart features by modifying the configuration object provided to `ChartService` for the [AdvancedChartComponent](./src/app/chartiq/components/advanced-chart/advanced-chart.component.ts) initialization. The default configuration is part of the ChartIQ library. See *./node_modules/chartiq/examples/templates/js/sample-config.js* for all the configuration details.

And, of course, you can modify the CSS in *advanced-chart.component.scss*. See the [CSS Overview](https://documentation.chartiq.com/tutorial-CSS%20Overview.html) tutorial for information on customizing the chart look and feel.

## Enabling plug-ins

Plug-ins are enabled by uncommenting the relevant imports in the component resources and stylesheet files.

For example, to enable the Trade From Chart (TFC) plug-in, uncomment the following lines in the [resources.ts](./src/app/chartiq/components/advanced-chart/resources.ts) file:

```ts
import 'chartiq/plugins/tfc/tfc-loader';
import 'chartiq/plugins/tfc/tfc-demo';
```

 and the following line in the [advanced-chart.component.scss](./src/app/chartiq/components/advanced-chart/advanced-chart.component.scss) file:

```css
@import '~chartiq/plugins/tfc/tfc.css';
```

Most plug-ins require enabling both the resource and the associated stylesheet.

## Questions and support

- Contact our development support team at [support@chartiq.com](mailto:support@chartiq.com).
- See our SDK documentation at https://documentation.chartiq.com.

## Contributing to this project

Contribute to this project. Fork it and send us a pull request. We'd love to see what you can do with our charting tools!
