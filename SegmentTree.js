class SegmentNode {
    constructor(l, r, val) {
        this.l = l
        this.r = r
        this.val = val
        this.lazy = 0
    }
}

class SegmentTree {
    constructor(
        arr,
        mergeVal,
        updateValByLazy,
        mergeLazy,
    ) {
        this.arr = arr
        this.mergeVal = mergeVal
        this.updateValByLazy = updateValByLazy
        this.mergeLazy = mergeLazy
        this.build()
    }

    build (idx = 0, l = 0, r = this.arr.length - 1) {
        if (!this.tree) {
            this.tree = new Array((1 << (Math.ceil(Math.log2(this.arr.length)) + 1)) - 1).fill(null)
        }
        if (l === r) {
            this.tree[idx] = new SegmentNode(l, r, this.arr[l])
            return
        }
        this.build((idx << 1) + 1, l, (l + r) >> 1)
        this.build((idx << 1) + 2, ((l + r) >> 1) + 1, r)
        this.tree[idx] = new SegmentNode(l, r, this.mergeVal(
            this.tree[(idx << 1) + 1].val,
            this.tree[(idx << 1) + 2].val
        ))
    }

    pushDown (idx) {
        const cur = this.tree[idx]
        if (!cur) return
        [this.tree[(idx << 1) + 1], this.tree[(idx << 1) + 2]].forEach(c => {
            if (!c) return
            c.val = this.updateValByLazy(c, cur.lazy)
            c.lazy = this.mergeLazy(c, cur.lazy)
        })
        cur.lazy = 0
    }

    modify (lazy, l, r, idx = 0) {
        const cur = this.tree[idx]
        if (cur.l > r || cur.r < l) return
        this.pushDown(idx)
        if (cur.l >= l && cur.r <= r) {
            cur.val = this.updateValByLazy(cur, lazy)
            cur.lazy = lazy
            return
        }
        this.modify(lazy, l, r, (idx << 1) + 1)
        this.modify(lazy, l, r, (idx << 1) + 2)
        this.tree[idx].val = this.mergeVal(
            this.tree[(idx << 1) + 1].val,
            this.tree[(idx << 1) + 2].val
        )
    }

    query (l, r, idx = 0) {
        const cur = this.tree[idx]
        if (cur.l > r || cur.r < l) return
        this.pushDown(idx)
        if (cur.l >= l && cur.r <= r) return cur.val
        return this.mergeVal(
            this.query(l, r, (idx << 1) + 1),
            this.query(l, r, (idx << 1) + 2)
        )
    }
}

exports.SegmentTree = SegmentTree
