import {NgModule,Component,ElementRef,Input,Output,AfterContentInit,EventEmitter,TemplateRef,
    Inject,forwardRef,ContentChildren,QueryList,ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {MenuItem, MessageService, PrimeNGConfig, SharedModule} from 'primeng/api';
import {TreeNode} from 'primeng/api';
import {PrimeTemplate} from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';

@Component({
selector: '[pOrganizationChartNode]',
templateUrl: './rbd-org-chart.component.html' ,
providers: [MessageService],
animations: [
    trigger('childState', [
        state('in', style({opacity: 1})),
       transition('void => *', [
         style({opacity: 0}),
         animate(150)
       ]),
       transition('* => void', [
         animate(150, style({opacity:0}))
       ])
    ])
],
encapsulation: ViewEncapsulation.None,
changeDetection: ChangeDetectionStrategy.OnPush,
styleUrls: ['./rbd-org-chart.component.css'],
host: {
    'class': 'p-element'
}
})
export class OrganizationChartNode implements OnDestroy{

@Input() node: any=[];

@Input() root: boolean;

@Input() first: boolean;

@Input() last: boolean;

public MainTree : any = [];

chart: OrganizationChart;

subscription: Subscription;
public TopBottom : MenuItem[];
public TopBottomEnable : boolean = false;
constructor(@Inject(forwardRef(() => OrganizationChart)) chart, public cd: ChangeDetectorRef,
private messageService: MessageService,) {
    this.chart = chart as OrganizationChart;
    this.subscription = this.chart.selectionSource$.subscribe(() =>{
        this.cd.markForCheck();
    })
}

ngOnInit(){
}

public AllowNumber(event) {
    const pattern = /[0-9.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
}

public AddTopBottom(node){
    this.TopBottomEnable = true;
}

public CloseTopBottomNode(){
    this.TopBottomEnable = false;
}

private AddTopNode(node){
    let obj ={
        label: '',
        intialNode : false,
        gate:true,
        final:false,
        L:0.0,
        M:0.0,
        gateType:'',
        expanded: true,
        children: [
        ]
    }
    obj.children.push(node);
    this.node = [];
    this.node = obj;
    this.cd.detectChanges();
}
private AddTopFinalNode(node){
    let obj ={
        label: '',
        intialNode : false,
        gate:true,
        L:0.0,
        M:0.0,
        mtbf:0,
        availability:0,
        final:true,
        gateType:'',
        expanded: true,
        children: [
        ]
    }
    obj.children.push(node);
    this.node = [];
    this.node = obj;
    this.cd.detectChanges();
}
private AddBottomNode(node, type){
    if(type === "No"){
        if(node.gateType == ''){
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Please select gate first" });
        }else{
    
            let obj ={
                label: '',
                intialNode : false,
                gate:false,
                final:false,
                L:0.0,
                M:0.0,
                gateType:'',
                expanded: true,
                children: [
                ]
            }
             node.children.push(obj);
             this.TopBottomEnable = false;
        }  
    }else if(type === 'Yes'){
        let obj ={
            label: '',
            intialNode : false,
            final:false,
            gate:true,
            L:0.0,
            M:0.0,
            gateType:'',
            expanded: true,
            children: [
            ]
        }
         node.children.push(obj);
    }
    
   this.TopBottomEnable = false;
//    if(this.MainTree[0].children.length >1){
       
//    }
}

get leaf(): boolean {
    return this.node.leaf == false ? false : !(this.node.children&&this.node.children.length);
}

get colspan() {
    return (this.node.children && this.node.children.length) ? this.node.children.length * 2: null;
}

onNodeClick(event: Event, node: TreeNode) {
    this.chart.onNodeClick(event, node)
}

toggleNode(event: Event, node: TreeNode) {
    node.expanded = !node.expanded;
    if (node.expanded)
        this.chart.onNodeExpand.emit({originalEvent: event, node: this.node});
    else
        this.chart.onNodeCollapse.emit({originalEvent: event, node: this.node});

    event.preventDefault();
}

isSelected() {
    return this.chart.isSelected(this.node);
}

ngOnDestroy() {
    this.subscription.unsubscribe();
}
}

@Component({
selector: 'rbd-organizationChart',
template: `
    <div [ngStyle]="style" [class]="styleClass" [ngClass]="{'p-organizationchart p-component': true, 'p-organizationchart-preservespace': preserveSpace}">
        <table class="p-organizationchart-table" pOrganizationChartNode [node]="root" *ngIf="root"></table>
    </div>
`,
changeDetection: ChangeDetectionStrategy.OnPush,
host: {
'class': 'p-element'
}
})
export class OrganizationChart implements AfterContentInit {

@Input() value: TreeNode[];

@Input() style: any;

@Input() styleClass: string;

@Input() selectionMode: string;

@Input() preserveSpace: boolean = true;

@Input()  get selection(): any {
    return this._selection;
}

set selection(val:any) {
    this._selection = val;

    if (this.initialized)
        this.selectionSource.next();
}

@Output() selectionChange: EventEmitter<any> = new EventEmitter();

@Output() onNodeSelect: EventEmitter<any> = new EventEmitter();

@Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();

@Output() onNodeExpand: EventEmitter<any> = new EventEmitter();

@Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();

@ContentChildren(PrimeTemplate) templates: QueryList<any>;

public templateMap: any;

private selectionSource = new Subject<any>();

_selection: any;

initialized: boolean;

selectionSource$ = this.selectionSource.asObservable();

constructor(public el: ElementRef, public cd:ChangeDetectorRef) {}

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
    let eventTarget = (<Element> event.target);

    if (eventTarget.className && (eventTarget.className.indexOf('p-node-toggler') !== -1 || eventTarget.className.indexOf('p-node-toggler-icon') !== -1)) {
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
                this.onNodeUnselect.emit({originalEvent: event, node: node});
            }
            else {
                this.selection = node;
                this.onNodeSelect.emit({originalEvent: event, node: node});
            }
        }
        else if (this.selectionMode === 'multiple') {
            if (selected) {
                this.selection = this.selection.filter((val,i) => i!=index);
                this.onNodeUnselect.emit({originalEvent: event, node: node});
            }
            else {
                this.selection = [...this.selection||[],node];
                this.onNodeSelect.emit({originalEvent: event, node: node});
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
            for(let i = 0; i  < this.selection.length; i++) {
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
declarations: [OrganizationChart,OrganizationChartNode]
})
export class RBDChartModule { }