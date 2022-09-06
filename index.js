const moment = require('moment');

const proposals = [
  'Writing Fast Tests Against Enterprise Rails 60min',
  'Overdoing it in Python 45min',
  'Lua for the Masses 30min',
  'Ruby Errors from Mismatched Gem Versions 45min',
  'Common Ruby Errors 45min',
  'Rails for Python Developers lightning',
  'Communicating Over Distance 60min',
  'Accounting-Driven Development 45min',
  'Woah 30min',
  'Sit Down and Write 30min',
  'Pair Programming vs Noise 45min',
  'Rails Magic 60min',
  'Ruby on Rails: Why We Should Move On 60min',
  'Clojure Ate Scala (on my project) 45min',
  'Programming in the Boondocks of Seattle 30min',
  'Ruby vs. Clojure for Back-End Development 30min',
  'Ruby on Rails Legacy App Maintenance 60min',
  'A World Without HackerNews 30min',
  'User Interface CSS in Rails Apps 30min'
];
const MAX_MORNING_SESSION = 180;
const MAX_AFTERNOON_SESSION = 240;

let tracks = [];
let session = [];


// create Array of Objects -> {name: string, duration: number(in min)}
// -> later: { name: string, duration: number(in min), startAt: time }
const editSessions = () => {
    proposals.map(item => {
        session.push({name: item, duration: getDuration(item)});
    });
}

const getDuration = (sessionItem) => {
    let match = sessionItem.match(/(.*)\s+([0-9]+)min$/i);
    if (match) return match[2];   // = X [minutes:number]

    match = sessionItem.match(/(.*)\s+(lightning)$/i);
    if (match && match[2].toLowerCase() === 'lightning')
        return 5;
        
    return null;
}



const addNewTrack = () => tracks = [
    ...tracks,
    {
      day: tracks.length + 1,
      morningSessions: [], 
      afternoonSessions: [], 
      minutesAvaible: {
          morningSession: MAX_MORNING_SESSION, 
          afternoonSession: MAX_AFTERNOON_SESSION
      }
    }
];




const createTrackList = (arrSessions) => {
  arrSessions.forEach(item => {
    addItemToList(item)
  });
}

const addItemToList = (sessionItem) => {
    let track = tracks.find(track => isTimeAvailable(sessionItem.duration, track));
    if (!track) {
      addNewTrack();
      track = tracks[tracks.length-1];
    }
    addToSession(track, sessionItem);
}

const isTimeAvailable = (duration, track) => {
  return track.minutesAvaible.morningSession >= duration || 
         track.minutesAvaible.afternoonSession >= duration
}

const addToSession = (track, sessionItem) => {
    const dur = sessionItem.duration;
    const time = moment()
                  .utc()
                  .startOf('year')
                  .add(9, "hours");

    // (Clean Code) Code-Dopplung?:
    let minsSessionLeft = track.minutesAvaible.morningSession;
    if (minsSessionLeft >= dur  &&  dur % 30 === 0) {
      sessionItem.startAt = time.add(180-minsSessionLeft, "minutes").format("hh:mmA");
      track.minutesAvaible.morningSession -= dur;
      track.morningSessions = [...track.morningSessions, sessionItem];
      return true;
    } 
    minsSessionLeft = track.minutesAvaible.afternoonSession;
    time.hour(13);
    if (minsSessionLeft >= dur) {
      sessionItem.startAt = time.add(240-minsSessionLeft, "minutes").format("hh:mmA");
      track.minutesAvaible.afternoonSession -= dur;
      track.afternoonSessions = [...track.afternoonSessions, sessionItem];
      return true;
    }
    console.log(`addToSession -> no Condition true: ${track.day}|${sessionItem.name}`)
    return false;
}


  
const createOutputArray = (tracks) => {
    let output = [];
    tracks.forEach(track => {
        output.push(`Track ${track.day}:`)
        track.morningSessions.forEach(item => output.push(`${item.startAt} ${item.name}`));
        output.push('12:00PM Lunch');
        track.afternoonSessions.forEach(item => output.push(`${item.startAt} ${item.name}`));
        output.push(getNetworkEvent(track)+"\n");
      }
    );
    return output;
}

const getNetworkEvent = (track) => {
    const timeLeftAtAfternoon = track.minutesAvaible.afternoonSession;
    if (timeLeftAtAfternoon >= 60) 
      return '04:00PM Networking Event';
      
    const time = moment()
                  .utc()
                  .startOf('year')
                  .add(13, "hours");
    
    let startEventAt = time.add(MAX_AFTERNOON_SESSION - timeLeftAtAfternoon, "minutes")
                           .format("hh:mmA");
    // return 04:15PM Networking Event
    return `${startEventAt} Networking Event`;
}

const printList = (tracks) => {
    tracks.forEach(item => console.log(item));
}





editSessions();
addNewTrack();
createTrackList(session);
printList(createOutputArray(tracks));