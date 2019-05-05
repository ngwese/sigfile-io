import { RawProperties } from './sbf-values'

export interface IParameter {
    readonly name: string;
    readonly type: string;
}

export interface IParamDescription {
    readonly description: string;
}

type Range = [Number, Number]

export interface IParamRange {
    readonly range: Range;
}

export class Parameter implements IParameter {
    protected raw: RawProperties;
    constructor(raw: RawProperties) {
        this.raw = raw;
    }
    get name(): string {
        return this.raw['NAME'];
    }
    get type(): string {
        return this.raw['TYPE'];
    }
}

export class Signal extends Parameter implements IParamDescription, IParamRange {
    get description(): string {
        return this.raw['DESCRIPTION'];
    }
    get connectTag(): string {
        return this.raw['CONNECT_TAG'];
    }
    get connectClass(): string {
        return this.raw['CONNECT_CLASS'];
    }
    get range(): Range {
        return [Number(this.raw['MINIMUM']), Number(this.raw['MAXIMUM'])];
    }
}

export class EdSignal extends Parameter implements IParamDescription, IParamRange {
    get description(): string {
        return this.raw['DESCRIPTION'];
    }
    get connectClass(): string {
        return this.raw['CONNECT_TAG'];
    }
    get range(): Range {
        return [Number(this.raw['MINIMUM']), Number(this.raw['MAXIMUM'])];
    }
}

export class EdString extends Parameter implements IParamDescription {
    get description(): string {
        return this.raw['DESCRIPTION'];
    }
    get displaySize(): number {
        return Number(this.raw['DISPLAY_SIZE']);
    }
    get storageSize(): number {
        return Number(this.raw['MINIMUM']);
    }
}

class EdNumberBase extends Parameter implements IParamDescription, IParamRange {
    get description(): string {
        return this.raw['DESCRIPTION'];
    }
    get default(): number {
        return Number(this.raw['DEFAULT']);
    }
    get range(): Range {
        return [Number(this.raw['MINIMUM']), Number(this.raw['MAXIMUM'])];
    }
}

export class EdReal extends EdNumberBase {
}

export class EdIntegar extends EdNumberBase {
}

export class Control extends Parameter implements IParamDescription, IParamRange {
    get description(): string {
        return this.raw['DESCRIPTION'];
    }
    get connectTag(): string {
        return this.raw['CONNECT_TAG'];
    }
    get range(): Range {
        return [Number(this.raw['MINIMUM']), Number(this.raw['MAXIMUM'])];
    }
}

export class OperatorStart extends Parameter {
    get operatorName(): string {
        return this.raw['OPERATOR_NAME'];
    }
    get operatorClass(): string {
        return this.raw['OPERATOR_CLASS'];
    }
}

export class OperatorEnd extends Parameter {
}

export class Module {
    readonly parameters: Parameter[];
    protected readonly _name: string;
    protected readonly _category: string;

    constructor(parameters: Parameter[]) {
        this.parameters = parameters;
        let opstart: any = parameters.find(p => p.name === "opstart");
        if (opstart) {
            this._name = (opstart as OperatorStart).operatorName;
            this._category = (opstart as OperatorStart).operatorClass;
        } else {
            this._name = "";
            this._category = "";
        }
    }

    get name(): string {
        return this._name;
    }

    get category(): string {
        return this._category;
    }
}

export class Instance {
    readonly kind: Module;
    name: string;

    constructor(kind: Module) {
        this.kind = kind;
        this.name = kind.name;
    }
}