function kClosest(points, k) {   
    if (k > points.length) return points;    
    const heap = new MaxHeap();    
    for (let i = 0; i < points.length; i++) {        
        const currentPoint = points[i];        
        if (heap.size < k) {            
            heap.add(currentPoint);            
            continue;        }        
            const maxDistance = distance(heap.peek());        
            if (maxDistance > distance(currentPoint)) {            
                heap.pop();            
                heap.add(currentPoint);        
            }    
        }    
        return heap.toArray();
    };
    function distance(point) {    
        return point[0] * point[0] + point[1] * point[1];
    }
    class MaxHeap {    
        constructor() {        
            this.heap = [];        
            this.size = 0;    
        }    
        pop() {        
            if (this.size === 0) 
                return null;    
                this.size--;        
                this.swap(0, this.heap.length - 1);         
                const result = this.heap.pop();        
                this.heapifyDown(0);        
                return result;    
            }    
        add(point) {        
            this.size++;        
            this.heap.push(point);        
            this.heapifyUp(this.heap.length - 1);    
        }    
        swap(i, j) {        
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];   
        }    
        peek() {        
            if (this.size === 0) 
                return null;        
            return this.heap[0];    
        }    
        heapifyUp(index) {        
            let parentIndex = Math.floor((index - 1) / 2);        
            while (parentIndex >= 0 && distance(this.heap[index]) > distance(this.heap[parentIndex])) {            
                this.swap(index, parentIndex);            
                index = parentIndex;            
                parentIndex = Math.floor((index - 1) / 2);        
            }    
        }    
        heapifyDown(index) {        
            let largestIndex = index;        
            const leftChildIndex = 2 * index + 1;        
            const rightChildIndex = 2 * index + 2;        
            if (leftChildIndex < this.heap.length && distance(this.heap[leftChildIndex]) > distance(this.heap[largestIndex])) {            
                largestIndex = leftChildIndex;        
            }        
            if (rightChildIndex < this.heap.length && distance(this.heap[rightChildIndex]) > distance(this.heap[largestIndex])) {            
                largestIndex = rightChildIndex;        
            }        
            if (largestIndex !== index) {            
                this.swap(index, largestIndex);            
                this.heapifyDown(largestIndex);        
            }    
        }    
        toArray() {        
            return [...this.heap];     
        }}