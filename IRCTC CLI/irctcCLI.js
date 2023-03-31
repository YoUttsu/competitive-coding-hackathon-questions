const prompt = require("prompt-sync")({ sigint: true }) //future devs disable this line when using JS in browser
//problems to remove:- program shows train based on city we have to implement if the train doesnt have perticular coach that customer is asking for then dont show that train
class day {
    constructor(date, creationInputArr) {
        this.date = date
        this.trains = [...Array(creationInputArr.length)].map((val, i) => {

            const element = creationInputArr[i];
            return new train(element[0], element[1])
        }) //this will have trains 
    }
}
class train {
    constructor(firstLine, secondLine) {
        this.trainId = firstLine.split(' ')[0]
        this.coaches = secondLine.split(' ')
        this.coaches.shift()
        this.routes = firstLine.split(' ')
        this.routes.shift()
        this.routearr = [...Array(this.routes.length)].map((val, i) => {
            let obj = new Object()
            obj.city = this.routes[i].split('-')[0]
            obj.value = Number(this.routes[i].split('-')[1])
            return obj
        })
        this.coacharr = [...Array(this.coaches.length)].map((val, i) => {
            return new coach(this.coaches[i].split('-')[0], Number(this.coaches[i].split('-')[1]))
        }) // this will be array of coach class
    }
}

class coach{
    constructor(coachClass, totalseats) {
        this.coachClass = coachClass
        this.totalseats = totalseats
        this.seatsarr = [...Array(this.totalseats)].map((val, i) => {
            return new seat(this.coachClass, (i + 1))
        })//array of seat class
    }
}

class seat {
    constructor(coachId, seat) {
        this.seatNo = coachId + '-' + seat
        this.isempty = true
    }
}
class PRN {
    constructor(trainnumber,prnid, From, To, date, TotalFare, seatsInCoach) {
        this.trainnumber = trainnumber
        this.PRNID = prnid
        this.from = From
        this.to = To
        this.date = date
        this.TotalFare = TotalFare
        this.seatsInCoach = seatsInCoach
    }   
}

function logPRN(prnid){
    let PRNToDisplay=PRNarr.find(obj=>obj.PRNID==prnid)
    // console.log(PRNToDisplay);
    if (!PRNToDisplay) {
        console.log("PRN not found");
        return
    }
    let str = ''
    for (i of PRNToDisplay.seatsInCoach){
        str += ` ${i.seatNo}`
    }
    console.log(`${PRNToDisplay.trainnumber} ${PRNToDisplay.from} ${PRNToDisplay.to} ${PRNToDisplay.date} ${PRNToDisplay.TotalFare}${str}`);
}
function report(){
    for (let index = 0; index < PRNarr.length; index++) {
        const PRNToDisplay = PRNarr[index];
        let str = ''
        for (i of PRNToDisplay.seatsInCoach){
            str += ` ${i.seatNo}`
        }
        console.log(`${PRNToDisplay.PRNID}, ${PRNToDisplay.date}, ${PRNToDisplay.trainnumber}, ${PRNToDisplay.from}, ${PRNToDisplay.to}, ${PRNToDisplay.TotalFare},${str}`);
    }
}

let numberOfLines = Number(prompt())
let creationInputArr = []
for (let index = 0; index < numberOfLines; index++) {
    creationInputArr.push([prompt(),prompt()])
}
// creationInputArr = [
//     ['17726 Rajkot-0 Ahmedabad-200 Vadodara-300 Surat-500 Mumbai-750', '17226 S1-72 S2-72 B1-72 A1-48 H1-24'],
//     ['37392 Ahmedabad-0 Anand-50 Vadodara-100 Bharuch-200 Surat-300', '37392 S1-15 S2-20 S3-50 B1-36 B2-48'],
//     ['29772 Vadodara-0 Dahod-150 Indore-350', '29772 S1-72 S2-72 B1-72 A1-48']
// ]
let datearr = []
let days = []
let currentPRNid = 100000001
let PRNarr = []
while (true) {

    let ip = prompt('enter your input ')
    if (ip == 'REPORT') {
        report()
        break
    }
    else if(ip.length == 9){
        logPRN(Number(ip))
    }
    else{
        let iparr = ip.split(" ")
        let from = iparr[0]
        let to = iparr[1]
        let date = iparr[2]
        let coachname = ''
        let INR = null
        if (iparr[3] == '1A') {
            coachname = 'H'
            INR=4
        }
        else if (iparr[3] == '2A') {
            coachname = 'A'
            INR=3
        }
        else if (iparr[3] == '3A') {
            coachname = 'B'
            INR=2
        }
        else if (iparr[3] == 'SL') {
            coachname = 'S'
            INR=1
        }
        let seatToBeBooked = Number(iparr[4])

        if (!datearr.includes(date)) {
            datearr.push(date)
            days.push(new day(date, creationInputArr))
        }
        const DayForTicket = days.find(obj => obj.date == date)
        // const trainsToBeUpdated = DayForTicket.trains.find(obj=>obj.routearr[from]-obj.routearr[to]>0)

        let trainsToBeUpdated = []
        for (let index = 0; index < DayForTicket.trains.length; index++) {
            const ithTrain = DayForTicket.trains[index];
            // console.log(from,to);
            // console.log(ithTrain.routearr);
            let fromCityDist = undefined
            let toCityDist = undefined
            for (let index = 0; index < ithTrain.routearr.length; index++) {
                const ithcity = ithTrain.routearr[index];
                if (ithcity.city == from) {
                    fromCityDist = ithcity.value
                }
                if (ithcity.city == to) {
                    toCityDist = ithcity.value
                }
            }
            if (toCityDist - fromCityDist > 0) {
                trainsToBeUpdated.push([ithTrain, toCityDist - fromCityDist])
            }

        }
        // console.log(trainsToBeUpdated);
        if (trainsToBeUpdated.length == 0) {
            console.log("train not found");
            continue
        }

        for (let index = 0; index < trainsToBeUpdated.length; index++) {

            const ithTrain = trainsToBeUpdated[index];
            console.log(ithTrain[0].trainId);
            // console.log(typeof ithTrain[0].trainId)
        }

        let nextip = prompt()
        let chosentrain = trainsToBeUpdated.find(ele => ele[0].trainId == nextip)
        // console.log(chosentrain);
        let coachToBeUpdated = []
        for (let index = 0; index < chosentrain[0].coaches.length; index++) {
            const ithcoach = chosentrain[0].coacharr[index];
            if (ithcoach.coachClass[0]==coachname) {
                coachToBeUpdated.push(ithcoach)
            }
            
        }
        let seatcounter = 0
        let labelToBreakTheLoop =false
        let seatArrToPutInPRNobj = []
        for (let index = 0; index < coachToBeUpdated.length; index++) {
            const ithcoach = coachToBeUpdated[index];
            for (let j = 0; j < ithcoach.totalseats; j++) {
                const ithseat = ithcoach.seatsarr[j];
                if (seatcounter==seatToBeBooked) {
                    labelToBreakTheLoop=true
                    break
                }
                if (ithseat.isempty == true) {
                    seatcounter++
                    seatArrToPutInPRNobj.push(ithseat)
                }
            }
            if (labelToBreakTheLoop) {
                break
            }        
        }
        if (seatArrToPutInPRNobj.length<seatToBeBooked) {
            console.log("seat not found")
            continue
        }
        PRNarr.push(new PRN(chosentrain[0].trainId,currentPRNid,from,to,date,chosentrain[1]*seatToBeBooked*INR,seatArrToPutInPRNobj))
        currentPRNid++
        console.log(PRNarr[PRNarr.length-1].PRNID,PRNarr[PRNarr.length-1].TotalFare);
        for(ithseat of seatArrToPutInPRNobj){
            ithseat.isempty =false
        }
    }
}
//to see this object structure properly use browser
// console.log(PRNarr);
// console.log(days);


