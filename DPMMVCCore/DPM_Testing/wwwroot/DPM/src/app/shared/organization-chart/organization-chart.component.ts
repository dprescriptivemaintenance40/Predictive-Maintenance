import {
    NgModule, Component, ElementRef, Input, Output, AfterContentInit, EventEmitter, TemplateRef,
    Inject, forwardRef, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MenuItem, SharedModule } from 'primeng/api';
import { PrimeTemplate } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { MenuModule, Menu } from 'primeng/menu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CommonBLService } from '../BLDL/common.bl.service';
import * as XLSX from 'xlsx';
import { TreeNode } from './tree.node';

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
    public basicItems: MenuItem[];
    public showTransitionOptions: string = '.12s cubic-bezier(0, 0, 0.2, 1)';

    public hideTransitionOptions: string = '.1s linear';
    @ViewChild('container') containerViewChild: ElementRef;
    @ViewChild('menu') menu: Menu;
    @ViewChild('submenu') submenu: Menu;
    @ViewChild('basicmenu') basicmenu: Menu;
    public appendTo: any;
    public subappendTo: any;
    public basicappendTo: any;
    public ANDIcon: boolean;
    public ORIcon: boolean;
    public FailureComponents: any[] = [];
    public FailureCause: any[] = [];
    public FailureModeNamesList: any[] = []

    constructor(@Inject(forwardRef(() => OrganizationChart)) chart,
        public cd: ChangeDetectorRef,
        private commonBLService: CommonBLService) {
        if (this.FailureComponents.length === 0) {
            this.GetFailureComponents();
        }
        if (this.FailureCause.length === 0) {
            this.GetFailureCause();
        }
        if (this.FailureModeNamesList.length === 0) {
            this.GetFailureModeNames();
        }
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

        this.basicItems = [
            {
                label: 'Failure', command: () => {
                    this.Failure();
                }
            },
            {
                label: 'Scheduled Downtime', command: () => {
                    this.ScheduledDowntime();
                }
            }
        ];
    }

    public AND() {
        this.ANDIcon = true;
        this.ORIcon = false;
        this.submenu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.subappendTo == null });
    }

    public OR() {
        this.ORIcon = true;
        this.ANDIcon = false;
        this.submenu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.subappendTo == null });
        this.cd.detectChanges();
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
        this.basicmenu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.basicappendTo == null });
    }

    public Failure() {
        if (this.ANDIcon) {
            this.chart.AddNode.emit({ node: this.node, ANDIcon: true, BasicEvent: true, Failure: true });
        } else if (this.ORIcon) {
            this.chart.AddNode.emit({ node: this.node, ORIcon: true, BasicEvent: true, Failure: true });
        } else {
            this.chart.AddNode.emit({ node: this.node, BasicEvent: true, Failure: true });
        }
    }

    public ScheduledDowntime() {
        if (this.ANDIcon) {
            this.chart.AddNode.emit({ node: this.node, ANDIcon: true, BasicEvent: true, ScheduledDowntime: true });
        } else if (this.ORIcon) {
            this.chart.AddNode.emit({ node: this.node, ORIcon: true, BasicEvent: true, ScheduledDowntime: true });
        } else {
            this.chart.AddNode.emit({ node: this.node, BasicEvent: true, ScheduledDowntime: true });
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
    public async onDeleteNode(node) {
        this.containsInNestedObjectDF(this.chart.value, node.id);
        await this.familyTree(this.chart.value, node.id - 1);
        this.cd.detectChanges();
    }

    private containsInNestedObjectDF(obj, val) {
        if (obj === val) {
            return true;
        }

        const keys = obj instanceof Object ? Object.keys(obj) : [];

        for (const key of keys) {

            const objval = obj[key];

            const isMatch = this.containsInNestedObjectDF(objval, val);

            if (isMatch) {
                if (Array.isArray(obj) && obj.length > 0) {
                    const deleteNode = obj.findIndex(a => a.id === val);
                    obj.splice(deleteNode, 1);
                    break;
                }
                return true;
            }
        }

        return false;
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

    private GetFailureComponents() {
        this.commonBLService.GetFailureComponents()
            .subscribe((res: any) => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.FailureComponents = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                }

            });
    }


    private GetFailureCause() {
        this.commonBLService.GetFailureCause()
            .subscribe((res: any) => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.FailureCause = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                }
            });
    }

    public GetLibrary() {
        this.commonBLService.GetMSSLibrary()
            .subscribe(async res => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = async (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    let Library = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    console.log(Library);
                    let FailureComponentsList = this.node.SelectedFailureComponentsList;
                    let FailureCausesList = this.node.SelectedFailureCausesList;
                    let failureModes = [];
                    FailureComponentsList.forEach(comp => {
                        let CompList: any = comp;
                        let sortedFailureComponents = [];
                        for (var sort in CompList) {
                            sortedFailureComponents.push([sort, CompList[sort]]);
                        }
                        sortedFailureComponents.sort((a, b) => {
                            return a[1] - b[1];
                        });
                        const len = sortedFailureComponents.length;
                        failureModes.push(sortedFailureComponents[len - 1]);
                    });
                    FailureCausesList.forEach(cau => {
                        let CauList: any = cau;
                        let sortedFailureCauses = [];
                        for (var sort in CauList) {
                            sortedFailureCauses.push([sort, CauList[sort]]);
                        }
                        sortedFailureCauses.sort((a, b) => {
                            return a[1] - b[1];
                        });
                        const len = sortedFailureCauses.length;
                        failureModes.push(sortedFailureCauses[len - 1]);
                    });

                    failureModes.sort((a, b) => {
                        return a[1] - b[1];
                    });
                    const len = failureModes.length;
                    let ShortName = failureModes[len - 1];
                    let Mode = this.FailureModeNamesList.find(a => a.ShortName === ShortName[0]).FullName;
                    let failureMode = Library.find(a => a['Failure mode'] === Mode);
                    this.node.years = parseFloat(((1 / failureMode['Failure rate Upper']) * (1000000 / 8760)).toFixed(2));
                    this.node.hours = failureMode['Repair (manhours) Mean'];
                    await this.familyTree(this.chart.value, this.node.id);
                    this.cd.detectChanges();
                    this.chart.FailureMode.emit(failureMode);
                }
            });
    }

    public async onScheduledDowntime(node: TreeNode) {
        await this.familyTree(this.chart.value, node.id);
        this.cd.detectChanges();
    }

    private GetFailureModeNames() {
        this.commonBLService.GetFailureModeNames()
            .subscribe((res: any) => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.FailureModeNamesList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                }
            });
    }

    private async familyTree(arr1, id) {
        var temp = [];
        let findLevel;
        var forFn = async (arr, id) => {
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (item.id === id) {
                    findLevel = arr[i].level - 1;
                    return await this.findLevel(arr1, findLevel);
                } else {
                    if (item.children) {
                        forFn(item.children, id);
                    }
                }
            }
        }
        forFn(arr1, id);
        return await temp;
    }

    private async findLevel(arr1, level) {
        var temp = [];
        var forFn = async (arr, level) => {
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                let len = 1;
                len += i;
                if (item.level === level) {
                    // calculation                    
                    var years = 0;
                    var hours = 0;
                    let lamb = 0;
                    let tau = 0;
                    let tauPOW = 0;
                    if (item.nodeType === 'TopEvent') {
                        arr[i].years = 0;
                        arr[i].hours = 0;
                        arr[i].Availability = 0;
                        years = 0;
                        hours = 0;
                        lamb = 1;
                        tau = 0;
                        tauPOW = 0;
                        item.children.forEach(basic => {
                            if (item.ANDIcon) {
                                lamb *= parseFloat(basic.years);
                                tau += parseFloat(basic.hours);
                                tauPOW += Math.pow(basic.hours, 2);
                            } else if (item.ORIcon) {
                                lamb += parseFloat(basic.years);
                                tau += (parseFloat(basic.years) * parseFloat(basic.hours))
                            }
                        });
                        if (item.ANDIcon) {
                            years = parseFloat((lamb * (tau / 8766)).toFixed(3));
                            hours = parseFloat((tauPOW / (2 * tau)).toFixed(3));
                        } else if (item.ORIcon) {
                            years = lamb;
                            hours = parseFloat(((tau) / (years)).toFixed(3));
                        }
                        arr[i].years = years;
                        arr[i].hours = hours;
                        arr[i].Availability = parseFloat(((1 / (1 + (arr[i].hours / 8766) * arr[i].years)) * 100).toFixed(3));
                        return arr1;
                    } else if (item.nodeType === 'Event') {
                        arr[i].years = 0;
                        arr[i].hours = 0;
                        arr[i].Availability = 0;
                        years = 0;
                        hours = 0;
                        lamb = 0;
                        tau = 0;
                        item.children.forEach(basic => {
                            if (item.ANDIcon) {
                                lamb *= parseFloat(basic.years);
                                tau += parseFloat(basic.hours);
                                tauPOW += Math.pow(basic.hours, 2);
                            } else if (item.ORIcon) {
                                lamb += parseFloat(basic.years);
                                tau += (parseFloat(basic.years) * parseFloat(basic.hours))
                            }
                        });
                        if (item.ANDIcon) {
                            years = parseFloat((lamb * (tau / 8766)).toFixed(3));
                            hours = parseFloat((tauPOW / (2 * tau)).toFixed(3));
                        } else if (item.ORIcon) {
                            years = lamb;
                            hours = parseFloat(((tau) / (years)).toFixed(3));
                        }
                        arr[i].years = years;
                        arr[i].hours = hours;
                        arr[i].Availability = parseFloat(((1 / (1 + (arr[i].hours / 8766) * arr[i].years)) * 100).toFixed(3));
                        if (arr.length === len) {
                            let findLevel = item.level - 1;
                            await this.findLevel(arr1, findLevel);
                        }
                    }
                } else {
                    if (item.children) {
                        forFn(item.children, level);
                    }
                }
            }
        }
        forFn(arr1, level);
        return await temp;
    }

    public AllowNumber(event) {
        const pattern = /[0-9.]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
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

    @Output() Library: EventEmitter<any> = new EventEmitter();

    @Output() FailureMode: EventEmitter<any> = new EventEmitter();

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