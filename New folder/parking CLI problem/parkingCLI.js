
const prompt = require("prompt-sync")({ sigint: true })

class parkingSlot {
    constructor(floor, slot, reserved) {
        this.id = floor + "-" + slot
        this.reserved = reserved
        this.checkIn = []
        this.checkOut = []
        this.carId = []
        this.money = []
        this.isempty = true
    }
    
}

let parkingSlots = []
let floorNUM = Number(prompt("enter the number of floors"))
let floorARR = [...Array(floorNUM)].map((val, i) => String.fromCharCode(i + 65))
let slotNUM = Number(prompt("enter number of slots per floor"))
let slotARR = [...Array(slotNUM)].map((val, i) => Number(i + 1))
for (let i = 0; i < floorARR.length; i++) {
    const floor = floorARR[i];
    for (let j = 0; j < slotARR.length; j++) {
        const slot = slotARR[j];
        parkingSlots.push(new parkingSlot(floor, slot, false))
    }
}
let reservedSTR = prompt("enter the reserved string")

let reservedARR = []    
if (reservedSTR) {
    reservedARR = reservedSTR.split(" ")
}
for (let index = 0; index < reservedARR.length; index++) {
    const reservedOBJID = reservedARR[index];
    const obj = parkingSlots.find(obj => obj.id === reservedOBJID)
    obj.reserved = true
}
let totalARR = [...Array(floorNUM * slotNUM)].map((val, i) => parkingSlots[i].id)
let NONreservedARR = totalARR.filter(function (el) {
    return !reservedARR.includes(el);
});




while (true) {
    let IP = prompt("enter your input")
    let IParray = IP.split(" ")
    //check this logic at last wt console.log
    if (IP == "generate report") {
        for (let i = 0; i < parkingSlots.length; i++) {
            const element = parkingSlots[i];
            if (element.checkOut == []) {
                continue
            }
            else {
                // element.checkInsort()
                for (let j = 0; j < element.checkOut.length; j++) {
                    console.log(`${element.id} ${element.carId[j]} ${element.checkIn[j]} ${element.checkOut[j]} ${element.money[j]} ${(element.reserved == true) ? "R" : "NR"}`)
                }
            }
        }
        return 
    }
    else if (IParray[0] == "CHECKIN") {
        if (IParray[3] == "R") {
            if (isparkingfull()) {
                console.log("parking is full")
            }
            else {

                if (iscopy(IParray[1])) {
                    console.log("car already exists")
                }
                else {
                    if (isReservedParkingFull()) {
                        console.log("reserved parking is full so your car will be given nonreserved slot")
                        let slotobj = findemptySlot(false)
                        slotobj.isempty = false
                        slotobj.carId.push(IParray[1])
                        slotobj.checkIn.push(IParray[2])
                        console.log(slotobj.id);
                    }
                    else {
                        // console.log("hi2");
                        let slotobj = findemptySlot(true)
                        slotobj.isempty = false
                        slotobj.carId.push(IParray[1])
                        slotobj.checkIn.push(IParray[2])
                        console.log(slotobj.id);
                    }
                }
            }
        }
        else if (IParray[3] == "NR") {
            if (isparkingfull()) {
                console.log("parking is full");
            }
            else {
                // console.log("hi3");
                if (iscopy(IParray[1])) {
                    console.log("car already exists")
                } else {
                    let slotobj = findemptySlot(false)
                    slotobj.isempty = false
                    slotobj.carId.push(IParray[1])
                    slotobj.checkIn.push(IParray[2])
                    console.log(slotobj.id);
                }
            }


        }
    }
    else if (IParray[0] == "CHECKOUT") {



        if (!iscopy(IParray[1])) {
            console.log("car id not found");
        }
        else {
            let cheakoutobj = cheakout(IParray[1])
            
            cheakoutobj.isempty = true
            cheakoutobj.checkOut.push(IParray[2])

            cheakoutobj.money.push(countmoney(cheakoutobj))
            console.log(cheakoutobj.money[cheakoutobj.money.length - 1])
        }

    }

}
function findemptySlot(reserved) {
    if (reserved) {
        for (let i = 0; i < reservedARR.length; i++) {
            const reservedOBJID = reservedARR[i];
            const obj = parkingSlots.find(obj => obj.id === reservedOBJID)
            if (obj.isempty) {
                return obj
            }
        }
    }
    else {
        for (let i = 0; i < NONreservedARR.length; i++) {
            const nonreservedOBJID = NONreservedARR[i];
            const obj = parkingSlots.find(obj => obj.id === nonreservedOBJID)
            if (obj.isempty) {
                return obj
            }
        }
    }
}
function cheakout(carNum) {
    for (let i = 0; i < totalARR.length; i++) {
        const totalID = totalARR[i];
        const obj = parkingSlots.find(obj => obj.id === totalID)
        if (obj.carId[obj.carId.length - 1] == carNum) {
            return obj
        }
    }
}
function countmoney(obj) {
    let inp = obj.checkIn[obj.checkIn.length - 1]
    let out = obj.checkOut[obj.checkOut.length - 1]
    let hourInp = Number(inp.slice(0, 2)) // 
    let minInp = Number(inp.slice(3, 5))  //
    let ampmInp = inp.slice(5, 7)
    let hourOp = Number(out.slice(0, 2)) //
    let minOp = Number(out.slice(3, 5)) //
    let ampmOp = out.slice(5, 7)

    if (hourInp === 12) {
        hourInp = 00;
    }
    if (ampmInp == 'pm') {
        hourInp = parseInt(hourInp, 10) + 12;
    }
    if (hourOp === 12) {
        hourOp = 00;
    }
    if (ampmOp == 'pm') {
        hourOp = parseInt(hourOp, 10) + 12;
    }

    const indate = new Date(2000, 3, 25, hourInp, minInp, 0);
    const outdate = new Date(2000, 3, 25, hourOp, minOp, 0);
    if (outdate <= indate) {
        outdate.setFullYear(2000, 3, 26)
        // console.log(outdate)
    }

    let diff = Number(outdate - indate);
    //  console.log(Math.round(diff / 60000));
    diff = (Math.round(diff / 60000));

    if (diff <= 120) {
        return 50
    }
    else if (diff > 120 && diff <= 240) {
        return 80
    }
    else {
        return 100
    }
}
function iscopy(carNum) {

    const obj = parkingSlots.find(obj => obj.carId[obj.carId.length - 1] === carNum && obj.isempty === false)
    if (obj) {
        return true
    }
    else {
        return false
    }

}
function isparkingfull() {
    const obj = parkingSlots.find(obj => obj.isempty === true)
    if (obj) {
        return false
    }
    else {
        return true
    }


}
function isReservedParkingFull(){
    const obj = parkingSlots.find(obj => obj.isempty === true && obj.reserved === true)
    if (obj) {
        return false
    }
    else {
        return true
    }
}