import * as P from 'parsimmon'

import { RawProperties } from './sbf-values'
import { IParameter, Parameter, Control, Signal, Operator, EdString, EdSignal, EdIntegar, EdReal, OperatorStart, OperatorEnd } from './sbf'

/*
function propertyParser<T>(name: string, valueParser: P.Parser<T>): P.Parser<[string, T]> {
    return P.seq(P.string(name), valueParser, P.newline).map(l => [name, l[1]])
}

export const typeParser: P.Parser<[string, string]> = propertyParser('', P.letters)
export const nameParser: P.Parser<[string, string]> = propertyParser('NAME:', P.letters)
*/

function marshalProperties(values: [string, string][]): RawProperties {
    let props: RawProperties = {};
    values.forEach(v => {
        props[v[0]] = v[1]
    })
    return props;
}

interface ClassTable {
    [key: string]: typeof Parameter;
}

const typeToClass: ClassTable = { 
    'CASE' : Parameter,
    'CONTROL' : Control,
    'ED_CONTROL' : Parameter,
    'ED_INTEGER' : EdIntegar,
    'ED_REAL' : EdReal,
    'ED_SIGNAL' : EdSignal,
    'ED_STRING' : EdString,
    'ED_USEROBJ' : Parameter,
    'MULTIPLE' : Parameter,
    'MULTIPLEEND' : Parameter,
    'OPERATOR' : OperatorStart,
    'OPERATOREND' : OperatorEnd,
    'SIGNAL' : Signal,
    'SWITCH' : Parameter,
    'SWITCHEND' : Parameter,
    'USEROBJ' : Parameter
}

function buildParameter(props: RawProperties): IParameter {
    return new typeToClass[props['TYPE']](props);
}

export const propertyName: P.Parser<string> = P.regexp(/\s*([A-Z_]+)/, 1);
export const propertyValue: P.Parser<string> = P.regexp(/[^\n\r]*/);
export const propertyLine: P.Parser<[string, string]> = P.seq(
    propertyName, P.string(':'), propertyValue
).map(l => [l[0], l[2]]);

export const SBFLang = P.createLanguage({
    Property: _ => propertyLine,
    Block: r => P.optWhitespace
        .then(P.string('{'))
        .then(P.newline)
        .then(r.Property.sepBy(P.newline).map(p => buildParameter(marshalProperties(p))))
        .skip(P.optWhitespace)
        .skip(P.string('}')),
    Operator: r => P.string('{')
        .then(P.newline)
        .then(r.Block.sepBy(P.newline).map(p => new Operator(p)))
        .skip(P.optWhitespace)
        .skip(P.string('}')),
    Database: r => r.Operator.sepBy(P.newline)
        .skip(P.optWhitespace)
        .skip(P.end)
})
