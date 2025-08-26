import { getId } from "../controllers/main.js";
export default class Validation {
    checkEmpty(value, id, mess) {
        if (value === "") {
            getId(id).innerHTML = mess;
            getId(id).style.display = "block";
            return false;
        }
        getId(id).innerHTML = "";
        getId(id).style.display = "none";
        return true;
    }
    checkSelectOption(idSelect, id, mess) {
        const ele = getId(idSelect);
        if (ele.selectedIndex !== 0) {
            getId(id).innerHTML = "";
            getId(id).style.display = "none";
            return true;
        }
        getId(id).innerHTML = mess;
        getId(id).style.display = "block";
        return false;
    }
}