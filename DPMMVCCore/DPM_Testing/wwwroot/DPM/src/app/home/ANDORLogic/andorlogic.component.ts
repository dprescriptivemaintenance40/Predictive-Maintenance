import { ChangeDetectorRef, Component } from "@angular/core";
import { TreeNode } from "primeng/api";
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import * as XLSX from 'xlsx';
@Component({
    templateUrl: './andorlogic.component.html'
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
            children: []
        }
    ];
    public FailureComponents: any[] = [];
    public FailureCause: any[] = [];
    constructor(private commonBLService: CommonBLService,
        private changeRef: ChangeDetectorRef) {
        this.GetFailureComponents();
        this.GetFailureCause();
    }

    onAddNode(event: any) {
        this.itemCount++;
        let obj = {
            id: this.itemCount,
            text: '',
            expanded: true,
            ANDORLogic: true,
            children: []
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
        event.node.children.push(obj);
        this.changeRef.detectChanges();
    }

    private SetEventAndBasicEvent(event: any, obj: any) {
        if (event.Event) {
            Object.assign(obj,
                {
                    label: 'Event',
                    Event: event.Event
                });
        } else if (event.BasicEvent) {
            Object.assign(obj,
                {
                    label: 'Basic Event',
                    BasicEvent: event.BasicEvent,
                    FailureComponents: this.FailureComponents,
                    FailureCauses: this.FailureCause,
                    SelectedFailureComponentsList: [],
                    SelectedFailureCausesList: [],
                });
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



}