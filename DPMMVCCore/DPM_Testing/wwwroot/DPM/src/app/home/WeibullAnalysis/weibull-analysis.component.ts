
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from "@angular/core";
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Chart } from 'chart.js'
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../prescriptive/Shared/prescriptive.constant';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './weibull-analysis.component.html',
    animations: [trigger('fade', [
        state('void', style({ opacity: 0 })),
        transition(':enter,:leave', [
            animate(250)
        ])
    ])]
})
export class WeibullAnalysis {
    public fileName: string = "";
    public Loading: boolean = false;
    public daysFile: any;
    public MeanTimeFailureColumn: any = [];
    public MeanTimeFailureData: any = [];
    public totalRecordMTF: any = [];
    public WeibullColumn: any = [];
    public WeibullData: any = [];
    public totalRecordWeibull: any = [];
    public QuickCalculation: any = [];
    public showLineCharts: boolean = false;
    public WeibullFile: any = [];
    public daysList: any = [];
    public arrayBuffer: any;
    public WeibullModel: any;
    public AssetsSelect: any = '';
    public Chart1: any;
    public LineChart1: any = [];
    public LabelLineChart1: any = [];
    public Chart2: any;
    public LineChart2: any = [];
    public Chart3: any;
    public LineChart3: any = [];
    public Chart4: any;
    public LineChart4: any = [];
    public lineChartLabels: any = [1,
        5,
        10,
        15,
        25,
        50,
        75,
        100,
        125,
        150,
        175,
        200,
        225,
        250,
        275,
        300,
        325,
        350,
        375,
        400,
        425,
        450,
        475,
        500,
        525,
        550,
        575,
        600,
        625,
        650,
        675,
        700,
        725,
        750,
        775,
        800,
        825,
        850,
        875,
        900,
        925,
        950,
        975,
        1000,
        1200,
        1800]

    constructor(public title: Title,
        public http: HttpClient,
        public changeDetectorRef: ChangeDetectorRef,
        private prescriptiveBLService: CommonBLService,
        private prescriptiveContantAPI: PrescriptiveContantAPI,
        private messageService: MessageService) {
        this.title.setTitle("Weibull Analysis | Dynamic Preventative Maintenance");
    }

    exportCSV(type) {
        if (type == 'days') {
            if (this.totalRecordMTF.length > 0) {
                var content = '';
                content +=
                    '<tr>'
                this.MeanTimeFailureColumn.forEach(header => {
                    content += '<th>' + header + '</th>'
                });
                content += '</tr>';
                this.totalRecordMTF.forEach(data => {
                    content += '<tr>'
                    this.MeanTimeFailureColumn.forEach(col => {
                        content += '<td>' + data[col] + '</td>'
                    });
                    content += '</tr>'
                });

                var s = document.createElement("table");
                s.innerHTML = content;

                const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(s);
                const wb: XLSX.WorkBook = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(wb, ws, 'Mean_time_failure');
                XLSX.writeFile(wb, 'Mean_time_failure' + moment().format('DD-MMM-YYYY') + '.csv');

            } else {
                alert("you haven't selected the Days file.")
            }
        } else {
            if (this.totalRecordWeibull.length > 0) {
                var content = '';
                content +=
                    '<tr>'
                this.WeibullColumn.forEach(header => {
                    content += '<th>' + header + '</th>'
                });
                content += '</tr>';
                this.totalRecordWeibull.forEach(data => {
                    content += '<tr>'
                    this.WeibullColumn.forEach(col => {
                        content += '<td>' + data[col] + '</td>'
                    });
                    content += '</tr>'
                });

                var s = document.createElement("table");
                s.innerHTML = content;

                const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(s);
                const wb: XLSX.WorkBook = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(wb, ws, 'Weibull_Analysis');
                XLSX.writeFile(wb, 'Weibull_Analysis' + moment().format('DD-MMM-YYYY') + '.csv');

            } else {
                alert("you haven't selected the Days file.")
            }
        }
    }

    fileTestChange(event) {
        this.WeibullFile = event.target.files[0];
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.daysFile = fileList[0];
            this.fileName = this.daysFile.name;
        }
    }
    Submit() {
        if (this.daysFile != undefined) {
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(this.WeibullFile);
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                var data = new Uint8Array(this.arrayBuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join("");
                var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                this.daysList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                var Data: any = []
                this.daysList.forEach(element => {
                    Data.push(element.Days)
                });
                var url: string = this.prescriptiveContantAPI.FCAWebalWithDetails
                this.LineChart1 = [];
                this.LineChart2 = [];
                this.LineChart3 = [];
                this.LineChart4 = [];

                this.prescriptiveBLService.postWithHeaders(url, Data)
                    .subscribe((res: any) => {
                        this.WeibullModel = res;
                        // var objLine1LN = new Object();
                        // objLine1LN["label"] = "LN(Days)";
                        // objLine1LN["data"] = [];
                        // objLine1LN["borderColor"] = '#42A5F5';
                        // objLine1LN["fill"] = false;
                        // objLine1LN["tension"] = .4;
                        var objLine1LNLN = new Object();
                        objLine1LNLN["label"] = "LN(LN(1/R(T)))";
                        objLine1LNLN["data"] = [];
                        objLine1LNLN["borderColor"] = '#FFA726';
                        // objLine1LNLN["fill"] = false;
                        // objLine1LNLN["tension"] = .4;
                        var objLine2Hazard = new Object();
                        objLine2Hazard["label"] = "HazardRate";
                        objLine2Hazard["data"] = [];
                        objLine2Hazard["borderColor"] = '#42A5F5';
                        objLine2Hazard["fill"] = false;
                        objLine2Hazard["tension"] = .4;
                        var objLine3CDF = new Object();
                        objLine3CDF["label"] = "CDF";
                        objLine3CDF["data"] = [];
                        objLine3CDF["borderColor"] = '#00bb7e';
                        objLine3CDF["fill"] = false;
                        objLine3CDF["tension"] = .4;
                        var objLine3Reliability = new Object();
                        objLine3Reliability["label"] = "Reliability";
                        objLine3Reliability["data"] = [];
                        objLine3Reliability["borderColor"] = '#42A5F5';
                        objLine3Reliability["fill"] = false;
                        objLine3Reliability["tension"] = .4;
                        var objLine4PDF = new Object();
                        objLine4PDF["label"] = "PDF";
                        objLine4PDF["data"] = [];
                        objLine4PDF["borderColor"] = '#FFA726';
                        objLine4PDF["fill"] = false;
                        objLine4PDF["tension"] = .4;
                        objLine4PDF["backgroundColor"] = 'rgba(255,167,38,0.2)';
                        var data = [{
                            x: 5,
                            y: 4
                        }, {
                            x: 2,
                            y: 14
                        },
                        {
                            x: 4,
                            y: 12
                        },
                        {
                            x: 2,
                            y: 10
                        },
                        {
                            x: 3,
                            y: 4
                        },
                        {
                            x: 3,
                            y: 5
                        },
                        {
                            x: 3,
                            y: 8
                        },
                        {
                            x: 6,
                            y: 12

                        }];
                        this.WeibullModel.weibullHazardRateModels.forEach((row, index) => {
                            if (row.CyclesDays < 1000) {
                                // this.LabelLineChart1.push(row.WeibullLogx.toFixed(0));
                                objLine1LNLN["data"].push({ x: row.WeibullLogx, y: row.WeibullLogxOfLogx });
                                //objLine1LNLN["data"] = data;
                            }
                            if (row.CyclesDays <= 1000) {
                                objLine2Hazard["data"].push(row.HazardRate);
                                objLine4PDF["data"].push(row.PDF);
                            }
                            if (row.CyclesDays <= 800) {
                                objLine3CDF["data"].push(row.CDF);
                                objLine3Reliability["data"].push(row.Reliability);
                            }
                        });
                        // this.LineChart1.push(objLine1LN);
                        this.LineChart1.push(objLine1LNLN);
                        this.LineChart2.push(objLine2Hazard);
                        this.LineChart3.push(objLine3CDF);
                        this.LineChart3.push(objLine3Reliability);
                        this.LineChart4.push(objLine4PDF);
                    }, err => {
                        console.log(err.error);
                    });
            }
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: "you haven't selected the Days file." });
        }
    }

    MTFSelectedRecords(event) {
        this.MeanTimeFailureData = event;
        this.changeDetectorRef.detectChanges();
    }
    WeibullSelectedRecords(event) {
        this.WeibullData = event;
        this.changeDetectorRef.detectChanges();
    }


    ShowCharts() {
        if (!!this.daysFile) {
            this.showLineCharts = true;
            if (!!this.Chart1) {
                this.Chart1.destroy();
                this.Chart2.destroy();
                this.Chart3.destroy();
                this.Chart4.destroy();
            }
            this.changeDetectorRef.detectChanges();

            this.Chart1 = new Chart('chart1', {
                type: 'scatter',
                data: {
                    //labels: this.LabelLineChart1,
                    datasets: this.LineChart1,
                },
                options: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 80,
                            fontColor: 'black',
                            usePointStyle: true
                        }
                    },
                    scales: {
                        y: {
                            suggestedMin: 0,
                            suggestedMax: 8
                        },
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                fontColor: 'black',
                                fontSize: 30,
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            });

            this.Chart2 = new Chart('chart2', {
                type: 'line',
                data: {
                    labels: this.lineChartLabels,
                    datasets: this.LineChart2,
                },
                options: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 80,
                            fontColor: 'black',
                            usePointStyle: true
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                fontColor: 'black',
                                fontSize: 30,
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            });
            this.Chart3 = new Chart('chart3', {
                type: 'line',
                data: {
                    labels: this.lineChartLabels,
                    datasets: this.LineChart3,
                },
                options: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 80,
                            fontColor: 'black',
                            usePointStyle: true
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                fontColor: 'black',
                                fontSize: 30,
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            });

            this.Chart4 = new Chart('chart4', {
                type: 'line',
                data: {
                    labels: this.lineChartLabels,
                    datasets: this.LineChart4,
                },
                options: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: 80,
                            fontColor: 'black',
                            usePointStyle: true
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            scaleLabel: {
                                display: true,
                                fontColor: 'black',
                                fontSize: 30,
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            });
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: "you haven't selected the Days file." });
        }
    }
}