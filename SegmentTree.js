class SegmentNode {
    constructor(startIdx, endIdx, val) {
        this.startIdx = startIdx
        this.endIdx = endIdx
        this.val = val
        this.lazy = 0
    }
}

class SegmentTree {
    static getPipeLength(leaveCount) {
        return (1 << (Math.ceil(Math.log2(leaveCount)) + 1)) - 1
    }
    static getChildRange(startIdx, endIdx) {
        const mid = (startIdx + endIdx) >> 1
        return [
            [startIdx, mid],
            [mid + 1, endIdx]
        ]
    }
    static getChildIdx(curIdx) {
        return [
            (curIdx << 1) + 1,
            (curIdx << 1) + 2
        ]
    }

    constructor (arr, mergeFunc, mergeLazyByRange) {
        this.mergeFunc = mergeFunc
        this.mergeLazyByRange = mergeLazyByRange
        this.pipe = new Array(SegmentTree.getPipeLength(arr.length)).fill(null)
        this.build(arr)
    }

    mergeLazy(cur, lazy) {
        cur.val = this.mergeFunc(cur.val, this.mergeLazyByRange(lazy, cur.endIdx - cur.startIdx + 1))
        cur.lazy = this.mergeFunc(cur.lazy, lazy)
    }

    build(arr, pipeIdx = 0, arrIdx = 0, startIdx = 0, endIdx = arr.length - 1) {
        if (startIdx === endIdx) {
            if (arrIdx >= arr.length) return arrIdx
            this.pipe[pipeIdx] = new SegmentNode(startIdx, endIdx, arr[arrIdx])
            return arrIdx + 1
        }
        const [l, r] = SegmentTree.getChildIdx(pipeIdx)
        const ranges = SegmentTree.getChildRange(startIdx, endIdx)
        arrIdx = this.build(arr, l, arrIdx, ...ranges[0])
        arrIdx = this.build(arr, r, arrIdx, ...ranges[1])
        this.pipe[pipeIdx] = new SegmentNode(
            startIdx,
            endIdx,
            this.mergeFunc(this.pipe[l].val, this.pipe[r].val)
        )
        return arrIdx
    }

    query(startIdx, endIdx, pipeIdx = 0, lazy = 0) {
        const cur = this.pipe[pipeIdx]
        this.mergeLazy(cur, lazy)
        if (startIdx > cur.endIdx || endIdx < cur.startIdx) return null
        if (startIdx <= cur.startIdx && endIdx >= cur.endIdx) {
            return cur.val
        }
        const [l, r] = SegmentTree.getChildIdx(pipeIdx)
        const lRes =  this.query(startIdx, endIdx, l, cur.lazy)
        const rRes = this.query(startIdx, endIdx, r, cur.lazy)
        cur.lazy = 0
        if (lRes !== null && rRes !== null) return this.mergeFunc(lRes, rRes)
        else if (lRes !== null) return lRes
        else if (rRes !== null) return rRes
        return null
    }

    modify(val, startIdx, endIdx, pipeIdx = 0) {
        const cur = this.pipe[pipeIdx]
        if (startIdx > cur.endIdx || endIdx < cur.startIdx) return
        if (startIdx <= cur.startIdx && endIdx >= cur.endIdx) {
            this.mergeLazy(cur, val)
            return
        }
        const [l, r] = SegmentTree.getChildIdx(pipeIdx)
        this.modify(val, startIdx, endIdx, l)
        this.modify(val, startIdx, endIdx, r)
        cur.val = this.mergeFunc(this.pipe[l].val, this.pipe[r].val)
    }
}

const st = new SegmentTree(
    new Array(8).fill(0).map((_, i) => i + 1),
    (...args) => args.reduce((a, b) => a + b, 0),
    (lazy, range) => lazy * range
)

console.log(st.query(2, 7))
st.modify(1, 2, 7)
console.log(st.query(2, 7))
st.modify(1, 0, 7)
// console.dir(st.pipe, { depth: 10 })
console.log(st.query(2, 7))
console.log(st.query(1, 7))
st.modify(-1, 0, 7)
console.log(st.query(2, 7))
st.modify(-1, 2, 7)
console.log(st.query(2, 7))
