// import * as P from 'parsimmon'
import * as fs from 'fs'
import { SBFLang } from '../src/sbf-parser'

// Parser tests
describe('parser tests', () => {
    // TODO
})

// Language tests
describe('language tests', () => {
    const paramBlock: string = `{
        TYPE:MULTIPLE
        NAME:sina_iterator
        ACTION_SPECIFIER:@numsigs
        MULTIPLE_COUNT:n
        }`

    it('will parse a block', () => {
        console.log(SBFLang.Block.parse(paramBlock))
    })

    const operatorBlock: string = `{
        {
         TYPE:OPERATOR
         NAME:opstart
         OPERATOR_NAME:c_power
         OPERATOR_CLASS:CONTROLMATH
         }
        {
         TYPE:ED_STRING
         NAME:opstart_name
         DESCRIPTION:operator name
         DISPLAY_SIZE:19
         STORAGE_SIZE:26
         }
        {
         TYPE:OPERATOREND
         NAME:opend
         }
     }`

     it('will parse an operator', () => {
         console.log(SBFLang.Operator.parse(operatorBlock))
     })

     const db = fs.readFileSync('test/H8000_5_2.sbf', { encoding: 'utf-8' })
     it('will parse database', () => {
         console.log(SBFLang.Database.tryParse(db))
     })
})
