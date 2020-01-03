import { ActionApi } from 'src/app/interface/action-api';

export enum StateType {
    Start = 1,
    End,
    NORMAL
}

// It is just to remove node position and height/width.
export class JtkNodeParam {
    h: number;
    w: number;
    top: number;
    left: number;
}

export class State {
    name: string;
    id: string;
    type: number;
    jData: JtkNodeParam;

    constructor(name: string, type: number) {
        this.name = name;
        this.type = type;
    }
}

export class Trigger {
    state: string;
    stateId: string;
    name: string;
    jData: JtkNodeParam;
    // Unique id for each trigger. It can be same as triggerName
    id: string;
    type: string;
    domSelector: string;
    urlSelector: string;
}

export class ConditionData {
    lhs: string;
    rhs: string;
    operator: string;
}

export class ConditionNode {
    data: ConditionData
    id: string;
    text: string;
}

export class ActionApiData {
    // It will be actual api eg. CAVNV.utils.setCookie.
    // TODO: it is better to provide uniq id to each api and use it here. 
    api: string;
    arguments: Map<string, string>
}

export class ActionApiCallingNodes {
    id: string;
    text: string;
    data: ActionApiData;
}

export class ActionEdge {
    source: string;
    target: string;
    data: Map<string, string>;
}

export class ActionData {
    // Condition node.  
    cNodes: ConditionNode[];
    // Action api node.
    aNOdes: ActionApiCallingNodes[];
    edges: ActionEdge[];
}

export class Action {
    id: string;
    name: string;
    data: ActionData;
    jData: JtkNodeParam;

    constructor(name: string) {
        this.name = name;
    }
}

export class DataPoint {
    id: string;
    name: string;
    type: string;
    selector: string;
    pattern: string;
    patternIndex: number;
}

export class LocalVariable {
    name: string;
    type: number;
}

/**This class is for storing callback's */
export class CallBackData {
    name: string;
    description: string;
    onTrigger: any;
    value: any;
    pages: number;
    channel: number;
    jsondata: any;
    group: any;
    constructor(name, onTrigger, description, value, pages, channel, jsondata) {
        this.name = name;
        this.group = description;
        this.onTrigger = onTrigger;
        this.value = value;
        this.pages = pages;
        this.channel = channel;
        this.jsondata = jsondata;
    }
}

export class Callback {
    states: State[] = [];
    triggers: Trigger[] = [];
    actions: Action[] = [];
    actionMap: Map<string, Map<string, string>> = new Map();
    dataPoints: DataPoint[] = [];
    localVariables: LocalVariable[] = [];

    constructor() {
        // Add start and end state.
        const startState = new State('start', StateType.Start);
        const endState = new State('end', StateType.End);

        startState.id = 'start';
        this.states.push(startState);
        endState.id = 'end';
        this.states.push(endState);
    }
}