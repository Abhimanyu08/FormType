function getOrderedEntries<V>(obj: { [key: number]: V }): Array<[number, V]> {

    return Object.keys(obj).map(k => parseInt(k)).sort((a, b) => a < b ? -1 : 1).map(
        (k) => ([k, obj[k]])
    )

}
export default getOrderedEntries 
