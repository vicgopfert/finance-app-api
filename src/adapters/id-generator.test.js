import { IdGeneratorAdapter } from './id-generator'

describe('Id Generator Adapter', () => {
    it('should generate a random id', () => {
        const sut = new IdGeneratorAdapter()

        const result = sut.execute()
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

        expect(uuidRegex.test(result)).toBe(true)
        expect(typeof result).toBe('string')
    })
})
