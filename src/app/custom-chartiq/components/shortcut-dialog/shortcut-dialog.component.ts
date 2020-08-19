import { Component, OnInit } from '@angular/core';
import { CustomChartService } from '../../custom-chart.service';

@Component({
	selector: 'cq-angular-shortcut-dialog',
	templateUrl: './shortcut-dialog.component.html',
	styleUrls: ['./shortcut-dialog.component.scss']
})
export class ShortcutDialogComponent implements OnInit {

	drawingTools : { label: string, tool: string, shortcut: string, duplicate?: boolean }[] = [];
	selectedTool: any = { };

	constructor(private chartService: CustomChartService) { }

	ngOnInit() { 
		this.drawingTools = this.chartService.getDrawingTools()
		this.updateDuplicates();
	}

	shortcutChanged(tool, e) {
		if (e) {
			e.stopPropagation();
			e.preventDefault();
		}

		const shortcut = e.data;
		this.drawingTools
			.filter(item => item.tool === tool)
			.map(item => item.shortcut = shortcut);

		this.updateDuplicates();
	}

	infoAbout(tool) {
		this.selectedTool = this.drawingTools.find(item => item.tool === tool) || {};
	}

	updateDuplicates() {
		const { drawingTools: tools } = this;
		// find duplicates
		const duplicates: Record<string, number[]> = tools.reduce((acc, item, index) => {
			item.duplicate = false; // clear duplicates
			if (!item.shortcut) return acc;
			acc[item.shortcut] = (acc[item.shortcut] || []).concat(index);
			return acc;
		}, {});

		// mark duplicates
		Object.entries(duplicates).forEach(([shortcut, indexes]) => {
			if (indexes.length > 1) {
				indexes.forEach(index => tools[index].duplicate = true)
			}
		});
	}

	sortBy(field) {
		this.drawingTools.sort((a, b) => {
			const x1 = a[field];
			const x2 = b[field];
			if (!x1 && x2) return 1;
			if (!x2 && x1) return -1;
			return x1 > x2 ? 1 : -1;
		})
	}

	onSave() {
		const shortcuts = this.drawingTools
			.filter(item => item.shortcut)
			.reduce((acc, item) => {
				acc[item.tool] = item.shortcut;
				return acc;
			}, {});

		this.chartService.setDrawingToolShortcuts(shortcuts);
		this.onClose();
	}

	onClose() {
		this.chartService.closeDialog();
	}
}
