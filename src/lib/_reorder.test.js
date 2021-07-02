import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { reorder } from './reorder.js'

test('reorder a single item', () => {
    const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const from = [1]
    const to = 4
    // ['A', 'C', 'D', 'E', 'B', 'F', 'G']
    assert.equal(reorder(array, from, to), ['A', 'C', 'D', 'E', 'B', 'F', 'G'])
})

test('reorder multiple items', () => {
    const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const from = [1, 2]
    const to = 4
    // ['A', 'D', 'E', 'F', 'B', 'C', 'G']
    assert.equal(reorder(array, from, to), ['A', 'D', 'E', 'F', 'B', 'C', 'G'])
})

test('reorder multiple items with backward orders', () => {
    const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const from = [3, 1, 5]
    const to = 4
    assert.equal(reorder(array, from, to), ['A', 'C', 'E', 'G', 'D', 'B', 'F'])
})

test('reorder multiple items with random orders > 10', () => {
    const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    const from = [3, 1, 10]
    const to = 4
    // ['A', 'C', 'E', 'F', 'D', 'B', 'K', 'G', 'H', 'I', 'J', 'L']
    assert.equal(reorder(array, from, to), [
        'A',
        'C',
        'E',
        'F',
        'D',
        'B',
        'K',
        'G',
        'H',
        'I',
        'J',
        'L',
    ])
})

test('reorder faulty items', () => {
    const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const from = [3, 100]
    const to = 4
    // ['A', 'B', 'C', 'E', 'F', 'G']
    assert.equal(reorder(array, from, to), ['A', 'B', 'C', 'E', 'D', 'F', 'G'])
})

test.run()
