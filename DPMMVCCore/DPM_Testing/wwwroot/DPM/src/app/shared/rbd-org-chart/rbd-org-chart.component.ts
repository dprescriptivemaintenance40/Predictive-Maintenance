import {
    NgModule, Component, ElementRef, Input, Output, AfterContentInit, EventEmitter, TemplateRef,
    Inject, forwardRef, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService, PrimeNGConfig, SharedModule } from 'primeng/api';
import { TreeNode } from 'primeng/api';
import { PrimeTemplate } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';
import { CommonBLService } from '../BLDL/common.bl.service';
import * as XLSX from 'xlsx'
import { PrescriptiveContantAPI } from 'src/app/home/prescriptive/Shared/prescriptive.constant';

@Component({
    selector: '[pOrganizationChartNode]',
    templateUrl: './rbd-org-chart.component.html',
    providers: [MessageService],
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
    styleUrls: ['./rbd-org-chart.component.css'],
    host: {
        'class': 'p-element'
    }
})
export class OrganizationChartNode implements OnDestroy {

    @Input() node: any = [];

    @Input() root: boolean;

    @Input() first: boolean;

    @Input() last: boolean;

    public MainTree: any = [];

    private topid: number = 100;
    public chart: OrganizationChart;

    subscription: Subscription;
    public TopBottom: MenuItem[];
    public TopBottomEnable: boolean = false;
    private RBDAssetsList: any = [];
    public DistribustionSelected: boolean = false;
    public distributionList: any = [
        { id: 1, name: 'Exponential' },
        { id: 2, name: 'Weibull - 2P' },
        { id: 3, name: 'Weibull - 3P' },
        { id: 4, name: 'Gamma' },
        { id: 5, name: 'Normal' },
        { id: 6, name: 'LogNormal' },
        { id: 7, name: 'Poisson' },
    ]
    constructor(@Inject(forwardRef(() => OrganizationChart)) chart,
        public cd: ChangeDetectorRef,
        private prescriptiveContantAPI: PrescriptiveContantAPI,
        private commonBLService: CommonBLService,
        private messageService: MessageService,) {
        this.chart = chart as OrganizationChart;
        this.subscription = this.chart.selectionSource$.subscribe(() => {
            this.cd.markForCheck();
        });
        this.RBDAssetsList = this.chart.RBDAssetsList;
    }

    ngOnInit() {
    }
    public distributionPopupClose() {
        this.DistribustionSelected = false;
    }
    public SelectDistribution(node) {
        if (node.distribution !== 0) {
            let distributionType = this.distributionList.find(r => r.id == node.distribution);
            if (distributionType !== undefined) {
                if (distributionType.name === 'Exponential') {
                    node.reliability = Math.exp(-parseFloat(node.L) / 1000000 * 1).toFixed(4);
                }
            }
            this.DistribustionSelected = true;
        }
    }

    public async calculateReliability(node) {
        if (node.gate == false) {
            let distributionType = this.distributionList.find(r => r.id == node.distribution);
            if (distributionType !== undefined) {
                if (distributionType.name === 'Exponential') {
                    node.reliability = Math.exp(-parseFloat(node.L) / parseFloat(node.lamdaPerHour) * 1).toFixed(4);
                } else if (distributionType.name === 'Weibull - 2P') {
                    if (node.alpha !== 0 && node.beta !== 0 && node.t !== 0) {
                        let reliability = await this.getWeibullReliability(parseFloat(node.alpha), parseFloat(node.beta), parseFloat(node.t));
                        node.reliability = (reliability.reliability).toFixed(4);
                    }
                }
            }
        } else if (node.gate == true) {
            // if gate is true means the RBD node is of type gate
            // node is having AND, OR, KN gate selection
            if (node.gateType === "AND") {
                // if gate type is AND the reliabilty of  gate node will be  Q1 * Q2 where Q1 is the ( 1 - reliability of first child  ) and Q2  is the ( 1 - reliability) of second child
                // 1-((1-R1)*(1-R2)) formula for calculation
                let Q: number = 1;
                node.children.forEach(element => {
                    Q = Q * (1 - parseFloat(element.reliability));
                });
                node.reliability = (1 - Q).toFixed(4)
            } else if (node.gateType === "OR") {
                // if gate type is OR the reliabilty of  gate node will be  R1 + R2 where R1 is the reliability
                // of first child and R2 is the reliability of second child
                let reliability: number = 0;
                node.children.forEach(element => {
                    reliability = reliability + parseFloat(element.reliability);
                });
                node.reliability = reliability.toFixed(4)
            } else if (node.gateType === "KN") {
                // if gate type is KN means It is parallel means calculation of AND gate 
                // But calculation of number of child node is equal to number of K in node
                // the reliabilty of  gate node will be  Q1 * Q2 where Q1 is the ( 1 - reliability of first child  ) and Q2  is the ( 1 - reliability) of second child
                // 1-((1-R1)*(1-R2)) formula for calculation
                let Q: number = 1;
                for (let index = 0; index < parseInt(node.K); index++) {
                    Q = Q * (1 - parseFloat(node.children[index].reliability));
                }
                node.reliability = (1 - Q).toFixed(4)
            }
        }
        return await true;
    }

    public RBDAssetValueForHTML(id, type) {
        var Data = this.chart.RBDAssetsList.find(r => r.CAId == parseFloat(id));
        if (type == 'Location') {
            return Data.Location
        }
        if (type == 'OriginalCriticality') {
            return Data.OriginalCriticality
        }
        if (type == 'AssetCost') {
            return Data.AssetCost
        }
        if (type == 'RepairCost') {
            return Data.RepairCost
        }

    }

    public AllowNumber(event) {
        const pattern = /[0-9.]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    public AddTopBottom(node) {
        this.TopBottomEnable = true;
    }

    public CloseTopBottomNode(node) {
        this.TopBottomEnable = false;
        node.K = 0;
        node.N = 0;
    }

    public AddKNLogic(node) {
        let data: any = [];
        data.node = node;
        data.type = "AddKNLogic";
        this.chart.addNode.emit(data);
        this.TopBottomEnable = false;
    }
    private AddTopNode(node) {
        let data: any = [];
        data.node = node;
        data.type = "AddTopNode";
        this.chart.addNode.emit(data);
        this.cd.detectChanges();
        this.TopBottomEnable = false;
    }
    private AddTopFinalNode(node) {
        let data: any = [];
        data.node = node;
        data.type = "AddTopFinalNode";
        this.chart.addNode.emit(data);
        this.TopBottomEnable = false;
    }
    private AddBottomNode(node, YN) {
        let data: any = [];
        data.node = node;
        data.YN = YN;
        data.type = "AddBottomNode";
        this.chart.addNode.emit(data);
        this.TopBottomEnable = false;
    }

    public async calculateLM(node, calWholeTree: boolean) {
        let selectedId: number = node.id;
        if ((node.K == 0 || node.K == undefined) && (node.N == 0 || node.N == undefined)) {
            if (node.children.length > 1) {
                if (node.gateType === "AND") {
                    let plusM: number = 0;
                    let multiplyM: number = 1;
                    let plusL: number = 0;
                    let multiplyL: number = 1;
                    let systemUnavailability: number = 1;
                    let AssetCost: number = 0;
                    let RepairCost: number = 0;
                    node.children.forEach(async (element) => {
                        multiplyM = multiplyM * parseFloat(element.M);
                        let A: number = 0;
                        let R: number = 0;
                        if (element.gate == true) {
                            let Data = this.chart.RBDAssetsList.find(r => r.CAId == parseFloat(element.label));
                            A = element.AssetCost;
                            AssetCost = AssetCost + A;
                            R = element.RepairCost;
                            RepairCost = RepairCost + R;
                        } else {
                            let Data = this.chart.RBDAssetsList.find(r => r.CAId == parseFloat(element.label));
                            A = Data.AssetCost;
                            AssetCost = AssetCost + A;
                            R = Data.RepairCost;
                            RepairCost = RepairCost + R;
                        }
                        plusM = plusM + parseFloat(element.M);
                        multiplyL = multiplyL * parseFloat(element.L);
                        systemUnavailability = systemUnavailability * parseFloat(element.unAvailabilty);
                    });
                    node.AssetCost = AssetCost;
                    node.RepairCost = RepairCost;
                    node.M = (multiplyM / plusM).toFixed(3);
                    node.L = ((multiplyL * plusM) / 1000000).toFixed(3);
                    node.gateUnAvailability = systemUnavailability.toFixed(5);
                    let unavalibility = await this.calculateAvailability(node);
                    node.unAvailabilty = unavalibility.toFixed(5);;
                } else if (node.gateType === "OR") {
                    let multiplyLM: number = 0;
                    let plusLM: number = 0;
                    let plusL: number = 0;
                    let systemUnavailability: number = 0;
                    let AssetCost1: Array<number> = [];
                    let RepairCost1: Array<number> = [];
                    node.children.forEach(async (element) => {
                        multiplyLM = parseFloat(element.L) * parseFloat(element.M);
                        plusLM = plusLM + multiplyLM;
                        plusL = plusL + parseFloat(element.L)
                        systemUnavailability = systemUnavailability + parseFloat(element.unAvailabilty);
                        let A: number = 0;
                        let R: number = 0;
                        if (element.gate == true) {
                            A = element.AssetCost;
                            AssetCost1.push(A);
                            R = element.RepairCost;
                            RepairCost1.push(R);
                        } else {
                            let Data = this.chart.RBDAssetsList.find(r => r.CAId == parseFloat(element.label));
                            A = Data.AssetCost;
                            AssetCost1.push(A);
                            R = Data.RepairCost;
                            RepairCost1.push(R);
                        }
                    });
                    node.AssetCost = Math.max(...AssetCost1);
                    node.RepairCost = Math.max(...RepairCost1);
                    node.M = (plusLM / plusL).toFixed(3);
                    node.L = (plusL).toFixed(3);
                    node.gateUnAvailability = systemUnavailability.toFixed(5);
                    let unAvalibility = await this.calculateAvailability(node);
                    node.unAvailabilty = unAvalibility.toFixed(5);
                }
                if (parseFloat(node.mtbf) == 0 || parseFloat(node.availability) > 0) {
                    node.mtbf = (1000000 / 8760 / parseFloat(node.L)).toFixed(3);
                    // this.node.availability = (parseFloat(this.node.mtbf)/(parseFloat(this.node.mtbf) + (parseFloat(this.node.M)/8760))).toFixed(3);
                    node.nonAvailability = (1 - node.availability).toFixed(3);
                    node.mtbf = `${node.mtbf} Yrs`
                    node.M = `${node.M} H`
                    node.availability = 1 - parseFloat(node.unAvailabilty);
                }
                await this.calculateReliability(node);
            }
        } else {
            //KN Logic
            let plusM: number = 0;
            let multiplyM: number = 1;
            let multiplyL: number = 1;
            for (let index = 0; index < parseInt(node.K); index++) {
                multiplyM = multiplyM * parseFloat(node.children[index].M);
                plusM = plusM + parseFloat(node.children[index].M);
                multiplyL = multiplyL * parseFloat(node.children[index].L);

            }
            node.M = (multiplyM / plusM).toFixed(3);
            node.L = ((multiplyL * plusM) / 1000000).toFixed(3);
            if (node.children.length > 1) {
                let Data: any = await this.KNEquations(node);
                if (Data != false) {
                    node.unAvailabilty = parseFloat(Data.value).toFixed(5);
                    node.gateUnAvailability = parseFloat(Data.value).toFixed(5);

                    if (Data.type == 1 || Data.type == 3 || Data.type == 6) {
                        let AssetCost1: Array<number> = [], RepairCost1: Array<number> = [];
                        node.children.forEach(element => {
                            let Data = this.chart.RBDAssetsList.find(r => r.CAId == parseFloat(element.label));
                            let A: number = 0, R: number = 0;
                            A = parseFloat(Data.AssetCost);
                            AssetCost1.push(A);
                            R = parseFloat(Data.RepairCost);
                            RepairCost1.push(R);
                        });
                        node.AssetCost = Math.max(...AssetCost1);
                        node.RepairCost = Math.max(...RepairCost1);
                    } else {
                        let AssetCost: number = 0, RepairCost: number = 0;
                        for (let index = 0; index < parseInt(node.K); index++) {
                            let Data = this.chart.RBDAssetsList.find(r => r.CAId == parseFloat(node.children[index].label));
                            let A: number = 0, R: number = 0;
                            A = parseFloat(Data.AssetCost);
                            AssetCost = AssetCost + A;
                            R = parseFloat(Data.RepairCost);
                            RepairCost = RepairCost + R;
                        }
                        node.AssetCost = AssetCost;
                        node.RepairCost = RepairCost;
                    }
                }
            }
            await this.calculateReliability(node);
        }

        if (calWholeTree === true) {
            for (let index = 0; index < 40; index++) {
                var data = await this.TraverseNestedJsonRBDCalculation(this.chart.value);
            }
            this.calculateLM(this.chart.value[0], false);
        }

        return false;
    }

    private async TraverseNestedJsonRBDToFindLeaf(tree, id: number) {
        for (let index = 0; index < tree.length; index++) {
            if (tree[index].id == id) {
                return await true;
            }
            if (tree.length !== 0 && tree[index].children.length > 0) {
                let Data: any = tree[index].children;
                for (let index1 = 0; index1 < Data.length; index1++) {
                    if (Data[index1].id == id) {
                        return await true;
                    }
                    if (Data[index1].children.length > 0) {
                        let Data2 = Data[index1].children
                        for (let index3 = 0; index3 < Data2.length; index3++) {
                            var d: any = []
                            d.push(Data2[index3])
                            this.TraverseNestedJsonRBDToFindLeaf(d, id)
                        }
                    }
                }
            }
        }
        return await false;
    }

    private async TraverseNestedJsonRBDCalculation(tree) {
        for (let index = 0; index < tree.length; index++) {
            if (tree[index].children.length >= 1) {
                var cal1 = await this.calculateLM(tree[index], false);
            }
            if (tree.length !== 0 && tree[index].children.length > 0) {
                let Data: any = tree[index].children;
                for (let index1 = 0; index1 < Data.length; index1++) {
                    if (Data[index1].children.length >= 1) {
                        var cal2 = await this.calculateLM(Data[index1], false);
                    }
                    if (Data[index1].children.length > 0) {
                        let Data2 = Data[index1].children
                        for (let index3 = 0; index3 < Data2.length; index3++) {
                            var d: any = []
                            d.push(Data2[index3])
                            this.TraverseNestedJsonRBDCalculation(d)
                        }
                    }
                }
            }
        }
        return await false;
    }


    private async getWeibullReliability(Alpha: number, Beta: number, t: number) {
        let CyclesDays = (t * 365);
        let PDF = (Beta / Alpha) * Math.pow((CyclesDays / Alpha), (Beta - 1)) * Math.exp(-(Math.pow((CyclesDays / Alpha), Beta)));
        let weibull = (1 - (Math.exp(-Math.pow((CyclesDays / Alpha), Beta))));
        let Reliability = 1 - weibull;
        return await { days: CyclesDays, pdf: PDF, reliability: Reliability, weibull: weibull };
    }

    public onDeleteNode(node) {
        this.chart.deleteNode.emit(node);
    }

    public async calculateAvailability(node) {
        if (node.L == '') {
            node.L = 0;
        } else if (node.M == '') {
            node.M = 0;
        }
        let L: number = parseFloat(node.L);
        let M: number = parseFloat(node.M);
        let power: number = Math.pow(10, -6);
        let unAvailabilty: number = L * power * M; // Formula for unavalibility
        node.unAvailabilty = unAvailabilty.toFixed(5);
        await this.calculateReliability(node); // if user selects Exponential distribution then L (lamda) value is  required for Reliability calculation
        return await unAvailabilty;
    }

    public Webal(event, node) {
        var file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
            var arrayBuffer: any = fileReader.result;
            var data = new Uint8Array(arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
            var daysList: any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            var Data: any = []
            daysList.forEach(element => {
                Data.push(element.Days)
            });
            var url: string = this.prescriptiveContantAPI.FCAWebal
            this.commonBLService.postWithHeaders(url, Data)
                .subscribe(
                    (res: any) => {
                        node.alpha = res.alpha;
                        node.beta = res.beta;
                        this.cd.detectChanges();
                        this.calculateReliability(node);
                    }, err => { console.log(err.error) }
                )
        }
    }

    private async KNEquations(node) {
        //here a = unavailability
        let a1: number = 1, a2: number = 1, a3: number = 1, a4: number = 1;
        let childCount: number = node.children.length;
        if (childCount == 2) {
            a1 = parseFloat(node.children[0].unAvailabilty);
            a2 = parseFloat(node.children[1].unAvailabilty);
        } else if (childCount == 3) {
            a1 = parseFloat(node.children[0].unAvailabilty);
            a2 = parseFloat(node.children[1].unAvailabilty);
            a3 = parseFloat(node.children[2].unAvailabilty);
        } else if (childCount == 4) {
            a1 = parseFloat(node.children[0].unAvailabilty);
            a2 = parseFloat(node.children[1].unAvailabilty);
            a3 = parseFloat(node.children[2].unAvailabilty);
            a4 = parseFloat(node.children[3].unAvailabilty);
        }
        // 1.  1 out of 2	1-(1-R)2
        // 2.  2 out of 2	R2
        // 3.  1 out of 3	1-(1-R)3
        // 4.  2 out of 3	R3 + 3 R2 (1-R)
        // 5.  3 out of 3	R3
        // 6.  1 out of 4	1-(1-R)4
        // 7.  2 out of 4	R4 + 4 R3 (1-R) + 6 R2 (1-R)2
        // 8.  3 out of 4	R4 + 4 R3 (1-R)
        // 9.  4 out of 4	R4
        let type: number;
        if (parseInt(node.K) == 1 && parseInt(node.N) == 2) {
            type = 1;
        } else if (parseInt(node.K) == 2 && parseInt(node.N) == 2) {
            type = 2;
        } else if (parseInt(node.K) == 1 && parseInt(node.N) == 3) {
            type = 3;
        } else if (parseInt(node.K) == 2 && parseInt(node.N) == 3) {
            type = 4;
        } else if (parseInt(node.K) == 3 && parseInt(node.N) == 3) {
            type = 5;
        } else if (parseInt(node.K) == 1 && parseInt(node.N) == 4) {
            type = 6;
        } else if (parseInt(node.K) == 2 && parseInt(node.N) == 4) {
            type = 7;
        } else if (parseInt(node.K) == 3 && parseInt(node.N) == 4) {
            type = 8;
        } else if (parseInt(node.K) == 4 && parseInt(node.N) == 4) {
            type = 9;
        }

        switch (type) {
            case 1:
                return await { value: (1 - ((1 - a1) * (1 - a2))), type: type };
            case 2:
                return await { value: (a1 * a2), type: type };
            case 3:
                return await { value: (1 - ((1 - a1) * (1 - a2) * (1 - a3))), type: type };
            case 4:
                return await { value: ((a1 * a2 * a3) + 3 * (a1 * a2) * (1 - a1)), type: type };
            case 5:
                return await { value: (a1 * a2 * a3), type: type };
            case 6:
                return await { value: (1 - ((1 - a1) * (1 - a2) * (1 - a3) * (1 - a4))), type: type };
            case 7:
                return await { value: ((a1 * a2 * a3 * a4) + (4 * (a1 * a2 * a3) * (1 - a1)) + (6 * (a1 * a2) * (1 - a1) * (1 - a2))), type: type };
            case 8:
                return await { value: ((a1 * a2 * a3 * a4) + (4 * (a1 * a2 * a3) * (1 - a1))), type: type };
            case 9:
                return await { value: (a1 * a2 * a3 * a4), type: type };
            default:
                return await false;
        }
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

    @Input() value: any[];
    public MainTree: any = [];

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

    @Output() public deleteNode = new EventEmitter<any>();

    @Output() public addNode = new EventEmitter<any>();

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public RBDAssetsList: any = [];
    public templateMap: any;

    private selectionSource = new Subject<any>();

    _selection: any;

    initialized: boolean;

    selectionSource$ = this.selectionSource.asObservable();

    constructor(public el: ElementRef, public cd: ChangeDetectorRef, private commonBLServie: CommonBLService) {
        this.getAssetsListforRBD();
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

    public getAssetsListforRBD() {
        this.RBDAssetsList = [];
        this.commonBLServie.getWithoutParameters('/CriticalityAssesmentAPI/GetAllCARecords')
            .subscribe(
                res => { this.RBDAssetsList = res; }, err => { console.log(err.error) }
            )
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
export class RBDChartModule { }