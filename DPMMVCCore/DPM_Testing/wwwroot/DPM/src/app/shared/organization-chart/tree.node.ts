
export interface TreeNode<T = any> {
    id?: number;
    level?: number;
    label?: string;
    data?: T;
    icon?: string;
    expandedIcon?: any;
    collapsedIcon?: any;
    children?: TreeNode<T>[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode<T>;
    partialSelected?: boolean;
    styleClass?: string;
    draggable?: boolean;
    droppable?: boolean;
    selectable?: boolean;
    key?: string;
    ANDORLogic?: boolean;
    ANDIcon?: boolean;
    ORIcon?: boolean;
    text?: string;
    FailureComponents?: any[];
    FailureCauses?: any[];
    SelectedFailureComponents?: any;
    SelectedFailureCauses?: any;
    SelectedFailureComponentsList?: any[];
    SelectedFailureCausesList?: any[];
    years?: number;
    hours?: number;
    Event?: boolean;
    BasicEvent?: boolean;
    nodeType?: string;
    Availability?: number;
}