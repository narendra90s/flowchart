
export enum ApiArgumentType {
    STRING = 1,
    NUMBER = 2,
    STATE = 3,

}

export class Operator {
    // TODO: update the list.
    // TODO: should be range property to tell what all type of operand are supported.
    static operatorList: any = [{
        name: '=', value: 'IS_EQUAL', range: 0x3
    }, {
        name: '!=', value: 'IS_NOT_EQUAL', range: 0x3
    }, {
        name: 'contains the string', value: 'CONTAIN_STRING', range: 0x1
    }, {
        name: 'contains the string(exact case)', value: 'CONTAIN_STRING_CASE', range: 0x1
    }, {
        name: '<', value: 'LESS_THAN', range: 0x2
    }, {
        name: '<=', value: 'LESS_THAN_EQUAL', range: 0x2
    }, {
        name: '>', value: 'GREATER_THAN', range: 0x2
    }, {
        name: '>=', value: 'GREATER_THAN_EQUAL', range: 0x2
    }];

    getOperatorList(operandType: number): any {
        return [];
    }
}


export class ApiArgument {
    label: string;
    name: string;
    type: number;
    required = true;
}

export class ActionApi {
    label: string;
    id: string;
    api: string;
    arguments: ApiArgument[];
    category: string;
}

export class ActionApiList {
    static apiList: { [key: string]: ActionApi[] } = {
        SPA: [
            {
                category: 'SPA',
                label: 'Page Transition Start',
                id: 'cav_nv_ajax_pg_start',
                api: 'cav_nv_ajax_pg_start',
                arguments: [{
                    label: 'Url',
                    name: 'url',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Page Name',
                    name: 'pageName',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            }, {
                category: 'SPA',
                label: 'Page Transition End',
                id: 'cav_nv_ajax_pg_end',
                api: 'cav_nv_ajax_pg_end',
                arguments: [{
                    label: 'Url',
                    name: 'url',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Page Name',
                    name: 'pageName',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            }, {
                category: 'SPA',
                label: 'Transaction Start',
                id: 'cav_nv_ajax_start',
                api: 'cav_nv_ajax_start',
                arguments: [{
                    label: 'Txn Name',
                    name: 'txn_name',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Data',
                    name: 'data',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            }, {
                category: 'SPA',
                label: 'Transaction Report',
                id: 'cav_nv_ajax_report',
                api: 'cav_nv_ajax_report',
                arguments: [{
                    label: 'Txn Name',
                    name: 'txn_name',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Data',
                    name: 'data',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            }, {
                category: 'SPA',
                label: 'Transaction End',
                id: 'cav_nv_ajax_end',
                api: 'cav_nv_ajax_end',
                arguments: [{
                    label: 'Txn Name',
                    name: 'txn_name',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Data',
                    name: 'data',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            }
        ],
        Cookie: [
            {
                category: 'Cookie',
                label: 'Set Cookie',
                id: 'setCookie',
                api: 'CAVNV.utils.setCookie',
                arguments: [{
                    label: 'Cookie Name',
                    name: 'cookieName',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Cookie Value',
                    name: 'cookieValue',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            }, {
                category: 'Cookie',
                label: 'Remove Cookie',
                id: 'removeCookie',
                api: 'CAVNV.utils.removeCookie',
                arguments: [{
                    label: 'Cookie Name',
                    name: 'cookieName',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            }
        ],
        State: [
            {
                category: 'Start',
                label: 'Goto State',
                id: 'gotoState',
                api: 'CAVNV.sb.gotoState',
                arguments: [{
                    label: 'State Name',
                    name: 'stateName',
                    type: ApiArgumentType.STATE,
                    required: true
                }]

            }
        ],
        Session_Data: [
            {
                category: 'Session_Data',
                label: 'Set Session Data',
                id: 'setSessionData',
                api: 'CAVNV.utils.setSessionData',
                arguments: [{
                    label: 'Key',
                    name: 'key',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Data',
                    name: 'data',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            },
        ],
        LoginId: [
            {
                category: 'LoginId',
                label: 'Set LoginId',
                id: 'setLoginId',
                api: 'CAVNV.utils.setLoginId',
                arguments: [{
                    label: 'LoginId',
                    name: 'loginid',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            },
        ],
        SessionId: [
            {
                category: 'SessionId',
                label: 'Set SessionId',
                id: 'setSessionId',
                api: 'CAVNV.utils.setSessionId',
                arguments: [{
                    label: 'SessionId',
                    name: 'SessionId',
                    type: ApiArgumentType.NUMBER,
                    required: true
                }]
            },
        ],
        LogEvent: [
            {
                category: 'LogEvent',
                label: 'Log Event',
                id: 'eventName',
                api: 'CAVNV.utils.eventName',
                arguments: [{
                    label: 'Event Name',
                    name: 'eventName',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Data',
                    name: 'data',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            },
        ],
        UserSegment: [
            {
                category: 'UserSegment',
                label: 'Set User Segment',
                id: 'userSegment',
                api: 'CAVNV.userSegment',
                arguments: [{
                    label: 'User Segment',
                    name: 'name',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            },
        ],
        CustomMetric: [
            {
                category: 'CustomMetric',
                label: 'Custom Metric',
                id: 'customMetric',
                api: 'CAVNV.customMetric',
                arguments: [{
                    label: 'Name',
                    name: 'customMatricName',
                    type: ApiArgumentType.STRING,
                    required: true
                }, {
                    label: 'Valus',
                    name: 'value',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            },
        ],
        OrderTotal: [
            {
                category: 'OrderTotal',
                label: 'Order Total',
                id: 'orderTotal',
                api: 'CAVNV.orderTotal',
                arguments: [{
                    label: 'Order Total',
                    name: 'oederTotal',
                    type: ApiArgumentType.STRING,
                    required: true
                }]
            },
        ],
        Session_State: [
            {
                category: 'Session_State',
                label: 'Set Session State',
                id: 'setSessionState',
                api: 'CAVNV.sb.setSessionState',
                arguments: [{
                    label: 'Session State',
                    name: 'sessionState',
                    type: ApiArgumentType.STATE,
                    required: true
                }]
            },
        ],
    };

    static apiMap: Map<string, ActionApi> = null;
    static getApiData(api: string): ActionApi {
        // Check if map is prepared. If not then create that first.
        if (this.apiMap === null) {
            this.loadApiMap();
        }
        return this.apiMap.get(api);
    }

    static loadApiMap() {
        this.apiMap = new Map();
        // tslint:disable-next-line: forin
        for (const key in this.apiList) {
            this.apiList[key].forEach(api => {
                this.apiMap.set(api.id, api);
            });
        }
    }
}