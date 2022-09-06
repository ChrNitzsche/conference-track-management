const moment = require('moment');

const PROPOSALS = [
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



const createSessionsObj = () => {
    PROPOSALS.map((item, i) => {
        session.push({id: i, name: item, duration: getDuration(item)});
    });
}

const getDuration = (sessionItem) => {
    if (!sessionItem) return null;

    let match = sessionItem.match(/(\S+)\s+([0-9]+)min$/i);
    if (match && match[2] > 0) 
        return match[2]*1;   // = X [minutes:number]

    match = sessionItem.match(/(.*)\s+(lightning)$/i);
    if (match && match[2].toLowerCase() === 'lightning')
        return 5;
        
    return null;
}



const addNewTrack = () => {
    return {
      day: tracks.length + 1,
      morningSessions: [], 
      afternoonSessions: [], 
      minutesAvaible: {
          morningSession: MAX_MORNING_SESSION, 
          afternoonSession: MAX_AFTERNOON_SESSION
      }
    }
}




const createTrackList = (arrSessions) => {
  arrSessions.forEach(item => {
    addItemToList(item)
  });
}

const addItemToList = (sessionItem) => {
    let track = tracks.find(track => isTimeAvailable(sessionItem.duration, track));
    if (!track) {
      tracks = [...tracks, addNewTrack()];
      track = tracks[tracks.length-1];
    }
    addToSession(track, sessionItem);
}

const isTimeAvailable = (duration, track) => {
  return track.minutesAvaible.morningSession >= duration || 
         track.minutesAvaible.afternoonSession >= duration
}

const is30Xmin = (dur) => {
    // because morningSession has to finish at 12 -> 
    //    only 30,60,90,...minutes-sessions are allowed (as my convention)
    if (!dur || dur <= 0) throw new Error('Invalid input!');
    return dur % 30 == 0 ? true : false
}


const addToSession = (track, sessionItem) => {
    const time = moment().utc().startOf('year')
                  .add(9, "hours");
    const dur = sessionItem.duration;

    // testing morning Session
    let minsSessionLeft = track.minutesAvaible.morningSession;
    if (minsSessionLeft >= dur && is30Xmin(dur)) {
      sessionItem.startAt = time.add(MAX_MORNING_SESSION - minsSessionLeft, "minutes").format("hh:mmA");
      track.minutesAvaible.morningSession -= dur;
      track.morningSessions = [...track.morningSessions, sessionItem];
      return true;
    } 

    // testing afternoon Session
    minsSessionLeft = track.minutesAvaible.afternoonSession;
    time.hour(13);
    if (minsSessionLeft >= dur) {
      sessionItem.startAt = time.add(MAX_AFTERNOON_SESSION - minsSessionLeft, "minutes").format("hh:mmA");
      track.minutesAvaible.afternoonSession -= dur;
      track.afternoonSessions = [...track.afternoonSessions, sessionItem];
      return true;
    }

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





createSessionsObj();
tracks = [addNewTrack()];
createTrackList(session);
printList(createOutputArray(tracks));



exports.getDuration = getDuration;
exports.is30Xmin = is30Xmin;