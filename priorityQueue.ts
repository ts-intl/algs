class PriorityQueue {
    static getChildIdx(idx) {
        return [(idx << 1) + 1, (idx << 1) + 2]
    }
    static getParentIdx(idx) {
        return (idx - 1) >> 1
    }
    constructor(compare = (a, b) => a - b) {
        this.compare = compare
        this.pipe = []
    }
    swap(i, j) {
        [this.pipe[i], this.pipe[j]] = [this.pipe[j], this.pipe[i]]
    }
    enqueue(element, priority = element) {
        this.pipe.push({
            element,
            priority
        })
        let curIdx = this.pipe.length - 1
        let parentIdx = PriorityQueue.getParentIdx(curIdx)
        while (parentIdx >= 0 && this.compare(this.pipe[curIdx].priority, this.pipe[parentIdx].priority) < 0) {
            this.swap(curIdx, parentIdx)
            curIdx = parentIdx
            parentIdx = PriorityQueue.getParentIdx(curIdx)
        }
    }
    dequeue() {
        this.swap(0, this.pipe.length - 1)
        const res = this.pipe.pop()
        let curIdx = 0
        let [l, r] = PriorityQueue.getChildIdx(curIdx)
        while (l < this.pipe.length) {
            let minIdx = curIdx
            if (this.compare(this.pipe[l].priority, this.pipe[minIdx].priority) < 0) {
                minIdx = l
            }
            if (r < this.pipe.length && this.compare(this.pipe[r].priority, this.pipe[minIdx].priority) < 0) {
                minIdx = r
            }
            if (minIdx === curIdx) break
            this.swap(curIdx, minIdx)
            curIdx = minIdx;
            [l, r] = PriorityQueue.getChildIdx(curIdx)
        }
        return res
    }
    front() {
        return this.pipe[0]
    }
    isEmpty() {
        return !this.pipe.length
    }
    size() {
        return this.pipe.length
    }
}

const mpq = new PriorityQueue()

mpq.enqueue(10)
mpq.enqueue(5)
mpq.enqueue(5)
mpq.enqueue(8)
console.log(mpq.dequeue())
console.log(mpq.dequeue())
console.log(mpq.dequeue())
console.log(mpq.dequeue())
