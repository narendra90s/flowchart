
export enum ApiArgumentType {
    STRING = 1,
    NUMBER = 2
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
    static apiList: {[key: string]: ActionApi[]} = {
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
        ]
    };

    static apiMap: Map<string, ActionApi> = null;
    static getApiData(api: string): ActionApi {
        // Check if map is prepared. If not then create that first.
        if (this.apiMap  === null) {
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