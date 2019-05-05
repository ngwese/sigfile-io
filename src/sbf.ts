
class Parameter {
    type: string
    name: string
    description: string

    constructor(type: string, name: string, description: string) {
        this.type = type
        this.name = name
        this.description = description
    }
}

/*
class SignalParameter extends Parameter {
    constructor(type: string, name: string, )
}*/

class Operator {
    name: string
    category: string
    parameters: Parameter[]

    constructor(name: string, category: string, parameters: Parameter[]) {
        this.name = name
        this.category = category
        this.parameters = parameters
    }
}