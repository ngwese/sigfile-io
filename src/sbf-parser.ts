import * as P from 'parsimmon'

/*
function propertyParser<T>(name: string, valueParser: P.Parser<T>): P.Parser<[string, T]> {
    return P.seq(P.string(name), valueParser, P.newline).map(l => [name, l[1]])
}

export const typeParser: P.Parser<[string, string]> = propertyParser('TYPE:', P.letters)
export const nameParser: P.Parser<[string, string]> = propertyParser('NAME:', P.letters)
*/

export const propertyName: P.Parser<string> = P.regexp(/\s*([A-Z_]+)/, 1)
export const propertyValue: P.Parser<string> = P.regexp(/[^\n\r]*/)
export const propertyLine: P.Parser<[string, string]> = P.seq(
    propertyName, P.string(':'), propertyValue
).map(l => [l[0], l[2]])

export const SBFLang = P.createLanguage({
    Property: _ => propertyLine,
    Block: r => P.optWhitespace
        .then(P.string('{'))
        .then(P.newline)
        .then(r.Property.sepBy(P.newline))
        .skip(P.optWhitespace)
        .skip(P.string('}')),
    Operator: r => P.string('{')
        .then(P.newline)
        .then(r.Block.sepBy(P.newline))
        .skip(P.optWhitespace)
        .skip(P.string('}')),
    Database: r => r.Operator.sepBy(P.newline)
        .skip(P.optWhitespace)
        .skip(P.end)
})
