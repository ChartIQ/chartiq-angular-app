import { Component, OnInit } from '@angular/core';
import { CustomChartService } from '../../custom-chart.service';

interface IDrawingTool {
	label?: string;
	tool?: string;
	shortcut?: string;
	detail?: string;
	duplicate?: boolean;
}

@Component({
	selector: 'cq-angular-shortcut-dialog',
	templateUrl: './shortcut-dialog.component.html',
	styleUrls: ['./shortcut-dialog.component.scss']
})
export class ShortcutDialogComponent implements OnInit {

	drawingTools : IDrawingTool[] = [];
	selectedTool: IDrawingTool = {};

	constructor(private chartService: CustomChartService) { }

	ngOnInit() {
		this.drawingTools = this.chartService.getDrawingTools()
		this.updateDuplicates();
	}

	shortcutChanged(tool: string, e: Event & { data?: string }) {
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

	infoAbout(tool: string) {
		this.selectedTool = this.drawingTools.find(item => item.tool === tool) || {};
	}

	updateDuplicates() {
		const { drawingTools: tools } = this;
		// find duplicates
		const duplicates = tools.reduce<Record<string, number[]>>((acc, item, index) => {
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

	sortBy(field: keyof IDrawingTool) {
		this.drawingTools.sort((a, b) => {
			const x1 = a[field];
			const x2 = b[field];
			if (!x1 && x2) return 1;
			if (!x2 && x1) return -1;
			if (x1 === undefined || x2 === undefined) return -1;
			return x1 > x2 ? 1 : -1;
		})
	}

	onSave() {
		const shortcuts = this.drawingTools
			.reduce<Record<string, string>>((acc, item) => {
				if (!item.tool || !item.shortcut) {
					return acc;
				}
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
