export function isObjEmpty(obj) {
    return Object.keys(obj).length === 0
}

export function binarySearch(arr, target) {
    let left = 0
    let right = arr.length - 1
    while (left <= right) {
        let mid = Math.floor((left + right) / 2)
        if (arr[mid].tempId2 === target.tempId2) {
            return mid
        } else if (arr[mid].tempId2 < target.tempId2) {
            left = mid + 1 // Search in the right half
        } else {
            right = mid - 1 // Search in the left half
        }
    }

    return -1
}
