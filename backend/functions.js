export function stringMatch(source, target, cmp) {
    switch (cmp) {
        case 1: return source.split(" ")[0] == target;
        case 2: return source.slice(source.length - target.length) == target;
        case 3: return source.includes(target);
        default: return source == target;
    }
}
export function numberMatch(source, target, cmp) {
    if (!source)
        return false;
    switch (cmp) {
        case 1: return source > target;
        case 2: return source < target;
        default: return source == target;
    }
}
