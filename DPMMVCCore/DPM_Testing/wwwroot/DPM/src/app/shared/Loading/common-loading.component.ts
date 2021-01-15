import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonLoadingDirective } from './common-loading.directive';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'common-loading',
    templateUrl: './common-loading.component.html',
})
export class CommonLoadingComponent implements OnInit {


    public showLoading: boolean = false;
    public loadingMessage:string = "";
    constructor(public commonLoadingDirective: CommonLoadingDirective,
        public changeRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService) {
        this.spinner.show();

    }

    ngOnInit() {
        this.commonLoadingDirective.getLoading().subscribe(val => {
            this.showLoading = val.loading;
            this.loadingMessage = val.message
            this.changeRef.detectChanges();
        })
    }


}