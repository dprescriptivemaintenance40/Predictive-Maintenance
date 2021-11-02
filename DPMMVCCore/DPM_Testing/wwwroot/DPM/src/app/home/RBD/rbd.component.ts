import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";

@Component({
    templateUrl: './rbd.component.html',
    providers: [MessageService]
})
export class RBDComponent implements OnInit {

    public rbdDetails: any = [];
    public itemCount: number = 100;
    public label: number = 1;
    public SeriesType: any = "series";
    public OutOffType: any = "";
    public SeriesList: any = [
        { name: "series", color: '#00BFFF' },
        { name: "parallel", color: '#64E986' },
        // { name: "outOff", color: '#C11B17' },
    ];
    public OutOffList: any = [
        { name: "Out Off 2", color: '#00BFFF' },
        { name: "Out Off 3", color: '#64E986' },
        { name: "Out Off 4", color: '#64E986' },
    ];
    public ShowOutOff: boolean = false;
    public testTree: any = [
        {
            id: 100,
            label: 1,
            rvalue: 0,
            addTree: true,
            disable: true,
            input: true,
            combine: false,
            root: true,
            expanded: true,
            children: [{
                id: 101,
                label: 2,
                rvalue: 0,
                addTree: true,
                deleteTree: true,
                disable: true,
                input: true,
                combine: false,
                children: []
            },
            {
                id: 102,
                label: 3,
                rvalue: 0,
                addTree: true,
                deleteTree: true,
                disable: true,
                input: true,
                combine: false,
                children: []
            }]
        },
        {
            id: 100,
            label: 1,
            rvalue: 0,
            addTree: true,
            disable: true,
            input: true,
            combine: false,
            root: true,
            expanded: true,
            children: [{
                id: 101,
                label: 2,
                rvalue: 0,
                addTree: true,
                deleteTree: true,
                disable: true,
                input: true,
                combine: false,
                children: []
            },
            {
                id: 102,
                label: 3,
                rvalue: 0,
                addTree: true,
                deleteTree: true,
                disable: true,
                input: true,
                combine: false,
                children: []
            }]
        }
    ]
    constructor(private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef) {

    }

    public ngOnInit() {
        this.rbdDetails = [{
            id: Math.floor(Math.random() * 1000),
            label: '',
            expanded: true,
            RBD: true,
            HideArrow: true,
            children: [],
            nodeType: "TopEvent",
            M: 0,
            P: 0,
            level: 1,
            KOFN: ''
        }];
    }

    public onAddNodeTest(event: any) {
        // if (event.node.P != 0 && event.node.M != 0) {
        if (event.KOFN) {
            for (let i = 0; i < event.KOFN; i++) {
                let obj = {
                    id: Math.floor(Math.random() * 100),
                    level: event.node.level + 1,
                    label: '',
                    expanded: true,
                    RBD: true,
                    HideArrow: true,
                    children: [],
                    P: 0,
                    M: 0,
                    Event: event.Event,
                    nodeType: "Event",
                    ANDIcon: false,
                    ORIcon: false,
                    KOFN: event.KOFN
                }
                event.node.ANDIcon = event.ANDIcon ? true : false;
                event.node.ORIcon = event.ORIcon ? true : false;
                if (event.node.children.length > 0) {
                    event.node.children.forEach(row => {
                        obj.level = row.level;
                    });
                }
                event.node.children.push(obj);
            }
        } else {
            let obj = {
                id: Math.floor(Math.random() * 100),
                level: event.node.level + 1,
                label: '',
                expanded: true,
                RBD: true,
                HideArrow: true,
                children: [],
                P: 0,
                M: 0,
                Event: event.Event,
                nodeType: "Event",
                ANDIcon: false,
                ORIcon: false,
            }
            if (event.up) {
                obj.ANDIcon = event.ANDIcon ? true : false;
                obj.ORIcon = event.ORIcon ? true : false;
                event.node.Event = obj.Event;
                obj.Event = false;
                obj.children.push(event.node);
                let p = 0;
                let mplus = 0;
                let mmul = 0;
                let PMPlus = 0;
                obj.children.forEach(evnt => {
                    if (obj.ANDIcon) {
                        p = p !== 0 ? parseFloat(evnt.P) * p : parseFloat(evnt.P)
                        mplus = parseFloat(evnt.M) + mplus;
                        mmul = mmul !== 0 ? parseFloat(evnt.M) * mmul : parseFloat(evnt.M)
                    } else if (obj.ORIcon) {
                        p = p !== 0 ? parseFloat(evnt.P) + p : parseFloat(evnt.P)
                        let mp = (parseFloat(evnt.P) * parseFloat(evnt.M));
                        PMPlus = PMPlus !== 0 ? mp + PMPlus : mp
                    }
                });
                if (obj.ANDIcon) {
                    obj.P = (p * mplus) / 1000000;
                    obj.M = mmul / mplus;
                } else if (obj.ORIcon) {
                    obj.P = p;
                    obj.M = PMPlus / p;
                }
                this.rbdDetails = [];
                this.rbdDetails = [obj];
            } else if (event.down) {
                event.node.ANDIcon = event.ANDIcon ? true : false;
                event.node.ORIcon = event.ORIcon ? true : false;
                if (event.node.children.length > 0) {
                    event.node.children.forEach(row => {
                        obj.level = row.level;
                    });
                }
                event.node.children.push(obj);
            }
        }
        this.changeDetectorRef.detectChanges();
        // } else {
        //     alert("Please fill P and M value")
        // }
    }

    public onDeleteNode(event) {
        this.containsInNestedObjectDF(this.rbdDetails, event.id);
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


}

