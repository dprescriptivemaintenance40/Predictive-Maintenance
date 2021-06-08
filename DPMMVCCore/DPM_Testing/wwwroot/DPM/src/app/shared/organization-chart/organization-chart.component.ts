import {
    NgModule, Component, ElementRef, Input, Output, AfterContentInit, EventEmitter, TemplateRef,
    Inject, forwardRef, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MenuItem, SharedModule } from 'primeng/api';
import { TreeNode } from 'primeng/api';
import { PrimeTemplate } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { MenuModule, Menu } from 'primeng/menu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[pOrganizationChartNode]',
    templateUrl: './organization-chart.component.html',
    animations: [
        trigger('childState', [
            state('in', style({ opacity: 1 })),
            transition('void => *', [
                style({ opacity: 0 }),
                animate(150)
            ]),
            transition('* => void', [
                animate(150, style({ opacity: 0 }))
            ])
        ])
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./organization-chart.component.css']
})
export class OrganizationChartNode implements OnInit, OnDestroy {

    @Input() node: TreeNode;

    @Input() root: boolean;

    @Input() first: boolean;

    @Input() last: boolean;

    chart: OrganizationChart;

    subscription: Subscription;
    public items: MenuItem[];
    public subItems: MenuItem[];

    public showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';

    public hideTransitionOptions: string = '.1s linear';
    @ViewChild('container') containerViewChild: ElementRef;
    @ViewChild('menu') menu: Menu;
    @ViewChild('submenu') submenu: Menu;
    public appendTo: any;
    public subappendTo: any;
    public ANDIcon: boolean;
    public ORIcon: boolean;

    constructor(@Inject(forwardRef(() => OrganizationChart)) chart, public cd: ChangeDetectorRef) {
        this.chart = chart as OrganizationChart;
        this.subscription = this.chart.selectionSource$.subscribe(() => {
            this.cd.markForCheck();
        });
    }

    ngOnInit() {
        this.items = [
            {
                label: 'AND Logic', command: () => {
                    this.AND();
                }
            },
            {
                label: 'OR Logic', command: () => {
                    this.OR();
                }
            }
        ];

        this.subItems = [
            {
                label: 'Event', command: () => {
                    this.Event();
                }
            },
            {
                label: 'Basic Event', command: () => {
                    this.BasicEvent();
                }
            }
        ];
    }

    public AND() {
        this.ANDIcon = true;
        this.ORIcon = false;
        this.submenu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.subappendTo == null });
        //this.chart.AddNode.emit({ node: this.node, ANDIcon: true });
    }

    public OR() {
        this.ORIcon = true;
        this.ANDIcon = false;
        this.submenu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.subappendTo == null });
        //this.chart.AddNode.emit({ node: this.node, ORIcon: true });
    }

    public Event() {
        if (this.ANDIcon) {
            this.chart.AddNode.emit({ node: this.node, ANDIcon: true, Event: true });
        } else if (this.ORIcon) {
            this.chart.AddNode.emit({ node: this.node, ORIcon: true, Event: true });
        } else {
            this.chart.AddNode.emit({ node: this.node, BasicEvent: true });
        }
    }

    public BasicEvent() {
        if (this.ANDIcon) {
            this.chart.AddNode.emit({ node: this.node, ANDIcon: true, BasicEvent: true });
        } else if (this.ORIcon) {
            this.chart.AddNode.emit({ node: this.node, ORIcon: true, BasicEvent: true });
        } else {
            this.chart.AddNode.emit({ node: this.node, BasicEvent: true });
        }
    }

    public onAddNode(node) {
        if (node.children.length > 0) {
            this.submenu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.subappendTo == null });
        } else {
            if (!!node.ANDIcon) {
                delete node.ANDIcon;
            } else if (!!node.ORIcon) {
                delete node.ORIcon;
            }
            this.menu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.appendTo == null });
        }
    }
    public onDeleteNode(node) {
        this.chart.DeleteNode.emit(node);
    }
    get leaf(): boolean {
        return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
    }

    get colspan() {
        return (this.node.children && this.node.children.length) ? this.node.children.length * 2 : null;
    }

    onNodeClick(event: Event, node: TreeNode) {
        this.chart.onNodeClick(event, node)
    }

    toggleNode(event: Event, node: TreeNode) {
        node.expanded = !node.expanded;
        if (node.expanded)
            this.chart.onNodeExpand.emit({ originalEvent: event, node: this.node });
        else
            this.chart.onNodeCollapse.emit({ originalEvent: event, node: this.node });

        event.preventDefault();
    }

    isSelected() {
        return this.chart.isSelected(this.node);
    }

    public onFailureComponents(event) {
        this.node.SelectedFailureComponentsList.push(event);
    }

    public onFailureCauses(event) {
        this.node.SelectedFailureCausesList.push(event);
    }

    public onDeleteFailureComponents(index) {
        this.node.SelectedFailureComponentsList.splice(index, 1);
    }

    public onDeleteFailureCauses(index) {
        this.node.SelectedFailureCausesList.splice(index, 1);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

@Component({
    selector: 'p-organizationChart',
    template: `
    <div [ngStyle]="style" [class]="styleClass" [ngClass]="{'p-organizationchart p-component': true, 'p-organizationchart-preservespace': preserveSpace}">
        <table class="p-organizationchart-table" pOrganizationChartNode [node]="root" *ngIf="root"></table>
    </div>
`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationChart implements AfterContentInit {

    @Input() value: TreeNode[];

    @Input() style: any;

    @Input() styleClass: string;

    @Input() selectionMode: string;

    @Input() preserveSpace: boolean = true;

    @Input() get selection(): any {
        return this._selection;
    }

    set selection(val: any) {
        this._selection = val;

        if (this.initialized)
            this.selectionSource.next();
    }

    @Output() selectionChange: EventEmitter<any> = new EventEmitter();

    @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();

    @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();

    @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();

    @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();

    @Output() AddNode: EventEmitter<any> = new EventEmitter();

    @Output() DeleteNode: EventEmitter<any> = new EventEmitter();

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public templateMap: any;

    private selectionSource = new Subject<any>();

    _selection: any;

    initialized: boolean;

    selectionSource$ = this.selectionSource.asObservable();

    constructor(public el: ElementRef, public cd: ChangeDetectorRef) {
    }

    get root(): TreeNode {
        return this.value && this.value.length ? this.value[0] : null;
    }

    ngAfterContentInit() {
        if (this.templates.length) {
            this.templateMap = {};
        }

        this.templates.forEach((item) => {
            this.templateMap[item.getType()] = item.template;
        });

        this.initialized = true;
    }

    getTemplateForNode(node: TreeNode): TemplateRef<any> {
        if (this.templateMap)
            return node.type ? this.templateMap[node.type] : this.templateMap['default'];
        else
            return null;
    }

    onNodeClick(event: Event, node: TreeNode) {
        let eventTarget = (<Element>event.target);

        if (eventTarget.className && (eventTarget.className.indexOf('p-node-toggler') !== -1 || eventTarget.className.indexOf('p-node-toggler-icon') !== -1)) {
            return;
        }
        else if (this.selectionMode) {
            if (node.selectable === false) {
                return;
            }

            let index = this.findIndexInSelection(node);
            let selected = (index >= 0);

            if (this.selectionMode === 'single') {
                if (selected) {
                    this.selection = null;
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                }
                else {
                    this.selection = node;
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }
            else if (this.selectionMode === 'multiple') {
                if (selected) {
                    this.selection = this.selection.filter((val, i) => i != index);
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                }
                else {
                    this.selection = [...this.selection || [], node];
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }

            this.selectionChange.emit(this.selection);
            this.selectionSource.next();
        }
    }

    findIndexInSelection(node: TreeNode) {
        let index: number = -1;

        if (this.selectionMode && this.selection) {
            if (this.selectionMode === 'single') {
                index = (this.selection == node) ? 0 : - 1;
            }
            else if (this.selectionMode === 'multiple') {
                for (let i = 0; i < this.selection.length; i++) {
                    if (this.selection[i] == node) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }

    isSelected(node: TreeNode) {
        return this.findIndexInSelection(node) != -1;
    }
}

@NgModule({
    imports: [CommonModule, MenuModule, AutoCompleteModule, FormsModule],
    exports: [OrganizationChart, SharedModule, MenuModule, AutoCompleteModule, FormsModule],
    declarations: [OrganizationChart, OrganizationChartNode]
})
export class OrganizationChartModule { }