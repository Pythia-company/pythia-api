export const transformSortParams = (sortParams) => {
    Object.entries(sortParams).forEach(([parameter, value]) => {
        if(value === 'asc'){
            sortParams[parameter] = 1
        }else{
            sortParams[parameter] = - 1
        }
    });
    return sortParams
}