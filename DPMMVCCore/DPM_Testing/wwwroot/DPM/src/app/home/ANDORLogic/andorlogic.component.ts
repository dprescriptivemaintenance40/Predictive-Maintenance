import { ChangeDetectorRef, Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import * as XLSX from 'xlsx';
import { TreeNode } from '../../shared/organization-chart/tree.node';
@Component({
    templateUrl: './andorlogic.component.html',
    providers: [MessageService]
})
export class AndorlogicComponent {

    public itemCount?: number = 100;
    public ANDORLOGICTREE: TreeNode[] = [
        {
            id: this.itemCount,
            label: 'Top Event',
            text: '',
            years: 0,
            hours: 0,
            expanded: true,
            ANDORLogic: true,
            children: [],
            nodeType: "TopEvent"
        }
    ];
    public FailureComponents: any[] = [];
    public FailureCause: any[] = [];
    public FailureModeNamesList: any[] = []
    constructor(private commonBLService: CommonBLService,
        private changeRef: ChangeDetectorRef,
        private messageService: MessageService) {
    }

    onAddNode(event: any) {
        this.itemCount++;
        let obj = {
            id: this.itemCount,
            text: '',
            expanded: true,
            ANDORLogic: true,
            years: 0,
            hours: 0,
        }
        if (!event.node.ANDIcon && event.ANDIcon) {
            event.node.ANDIcon = event.ANDIcon;
            obj = this.SetEventAndBasicEvent(event, obj);
        } else if (!event.node.ORIcon && event.ORIcon) {
            event.node.ORIcon = event.ORIcon;
            obj = this.SetEventAndBasicEvent(event, obj);
        } else {
            obj = this.SetEventAndBasicEvent(event, obj);
        }
        if (event.BasicEvent && event.node.children.length > 2) {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'You are allowed to add only 2 basic events.' });
        } else {
            event.node.children.push(obj);
        }
        this.changeRef.detectChanges();
    }

    private SetEventAndBasicEvent(event: any, obj: any) {
        if (event.Event) {
            Object.assign(obj,
                {
                    label: 'Event',
                    Event: event.Event,
                    children: [],
                    nodeType: "Event"
                });
        } else if (event.BasicEvent) {
            if (event.Failure) {
                Object.assign(obj,
                    {
                        label: 'Failure',
                        BasicEvent: event.BasicEvent,
                        SelectedFailureComponentsList: [],
                        SelectedFailureCausesList: [],
                        SelectedFailureComponents: "",
                        SelectedFailureCauses: "",
                        Failure: event.Failure,
                        nodeType: "BasicEvent"
                    });
            }

            if (event.ScheduledDowntime) {
                Object.assign(obj,
                    {
                        label: 'Scheduled Downtime',
                        BasicEvent: event.BasicEvent,
                        ScheduledDowntime: event.ScheduledDowntime,
                        nodeType: "BasicEvent"
                    });
            }
        }
        return obj;
    }
    onDeleteNode(event) {
        this.containsInNestedObjectDF(this.ANDORLOGICTREE, event.id);
    }

    containsInNestedObjectDF(obj, val) {
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
                    console.log(this.FailureComponents);
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
                    console.log(this.FailureCause);
                }
            });
    }

    public GetFailureRateAndRepair(event) {
        this.commonBLService.GetMSSLibrary()
            .subscribe(res => {
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
                    let Library = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    console.log(Library);
                    let FailureComponentsList = event.SelectedFailureComponentsList;
                    let FailureCausesList = event.SelectedFailureCausesList;
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
                    event.node.years = failureMode['Failure rate Upper'];
                    event.node.hours = failureMode['Repair (manhours) Mean'];
                    this.changeRef.detectChanges();
                }
            });
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

}