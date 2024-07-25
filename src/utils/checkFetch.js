
export function checkFetch( json, logout ) {
    if(json.status === 'UNAUTHORIZED')
        logout()
}