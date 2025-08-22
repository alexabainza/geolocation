export const formatCoordinates = (location:string) =>{
    if(!location || typeof location !== "string"){
        return { latitude: 0, longitude:0}
    }
    const coordinates = location.split(",")
    if (coordinates.length !== 2) {
        return { latitude: 0, longitude: 0 };
    }
    const latitude = parseFloat(coordinates[0].trim());
    const longitude = parseFloat(coordinates[1].trim());
    if (isNaN(latitude) || isNaN(longitude)) {
        return { latitude: 0, longitude: 0 };
    }

    return { latitude, longitude };
}