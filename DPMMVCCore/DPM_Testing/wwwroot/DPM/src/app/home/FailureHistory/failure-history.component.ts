import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import * as XLSX from 'xlsx';

@Component({
    templateUrl: './failure-history.component.html'
})
export class FailureHistoryComponent {

    public AssetsSelect: any = '';;
    public fileName: string = '';
    public FailureHistoryList: any = [];
    public failureHistoryFile: any;
    public arrayBuffer: any;
    constructor(private http: HttpClient) {
        this.Submit();
    }

    fileTestChange(event) {
        this.failureHistoryFile = event.target.files[0];
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.fileName = fileList[0].name;
        }
    }

    Submit() {
        this.http.get('dist/DPM/assets/FailureHistory.xlsx', { responseType: 'blob' })
            .subscribe((res: any) => {
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
                    this.FailureHistoryList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                }
            });
    }
}