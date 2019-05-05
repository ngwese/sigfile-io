import * as P from 'parsimmon'
import * as fs from 'fs'

import { SBFLang } from '../src/sbf-parser'
import { Parameter, Signal, Module } from '../src/sbf';

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
        let result: P.Result<Parameter> = SBFLang.Block.parse(paramBlock);
        expect(result.status).toBe(true)
        expect((result as P.Success<Parameter>).value.name).toBe('sina_iterator')
    })

    const signalBlock: string = `{
        TYPE:SIGNAL
        NAME:null
        CONNECT_TAG:null
        DESCRIPTION:null
        CONNECT_CLASS:MONO
        MINIMUM:-32768
        MAXIMUM:32767
        }`
    
    it('will marshal to correct parameter type', () => {
        let result: P.Result<Signal> = SBFLang.Block.parse(signalBlock);
        expect(result.status).toBe(true)
        expect((result as P.Success<Signal>).value.connectClass).toBe('MONO')
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

     it('will parse a module', () => {
        let result: P.Result<Module> = SBFLang.Module.parse(operatorBlock)
        expect(result.status).toBe(true)
        expect((result as P.Success<Module>).value.name).toBe('c_power')
     })

     const db = fs.readFileSync('test/H8000_5_2.sbf', { encoding: 'utf-8' })
     it('will parse database', () => {
        let result: P.Result<Module[]> = SBFLang.Database.parse(db)
        expect(result.status).toBe(true)
     })
})
