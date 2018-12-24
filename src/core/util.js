import moment from "moment/moment";

export const giveMeDateOneMoreTime = str => {
    let d;
    let date = moment(new Date());
    if (str === "6h") {
        d = date.subtract(6, "hours").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "24h") {
        d = date.subtract(24, "hours").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "1w") {
        d = date.subtract(7, "days").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "1M") {
        d = date.subtract(1, "months").format("YYYY-MM-DDTHH:mm:ss");
    } else if (str === "3M") {
        d = date.subtract(3, "months").format("YYYY-MM-DDTHH:mm:ss");
    } else {
        console.log("Не то время!");
    }
    return d;
};
