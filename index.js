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

let tracks = [];
let session = [];

const editSessions = () => {
    proposals.map(item => {
        let str = item.split(' ');
        let durance = str[str.length - 1].replace('min', '') * 1;
        if (isNaN(durance)) durance = 5;

        session.push({name: item, durance: durance});
    });
}
editSessions();

const addNewTrack = () => {
  tracks = [
    ...tracks,
    {
      day: tracks.length + 1,
      morningSession: [], 
      lunch: 'Lunch', 
      afternoonSession: [], 
      event: 'Networking Event',
      minutesAvaible: {
          morningSession: 180, 
          afternoonSession: 240
      }
    }
  ];
}



/***** program *****/
const createTrackList = (arrSessions) => {
    arrSessions.forEach(item => {
      addItemToList(item)
    });
    console.log('################### TRACKS #################');
    console.log(tracks);
    console.log('############################################');
    printList(createOutput(tracks));
}

const addItemToList = (sessionItem) => {
    let track = tracks.find(track => track.minutesAvaible.morningSession >= sessionItem.durance || track.minutesAvaible.afternoonSession >= sessionItem.durance)    
    if (!track) {
      addNewTrack();
      track = tracks[tracks.length-1];
    }
    addToSession(track, sessionItem);
}

const addToSession = (track, sessionItem) => {
    if (track.minutesAvaible.morningSession >= sessionItem.durance) {
      track.minutesAvaible.morningSession -= sessionItem.durance;
      track.morningSession = [...track.morningSession, sessionItem];
      return true;
    } 
    if (track.minutesAvaible.afternoonSession >= sessionItem.durance) {
      track.minutesAvaible.afternoonSession -= sessionItem.durance;
      track.afternoonSession = [...track.afternoonSession, sessionItem];
      return true;
    }
    console.log(`addToSession -> no Condition true: ${track.day}|${sessionItem.name}`)
    return false;
  }
  
  const createOutput = (tracks) => {
    let output = [];
    console.log('##### Output: #####');
    tracks.forEach(track => {
        output.push(`Track ${track.day}:`)
        track.morningSession.forEach(item => output.push(item.name));
        output.push('12:00PM Lunch');
        track.afternoonSession.forEach(item => output.push(item.name));
        output.push('Networking Event\n');
      }
    );
    return output;
  }

const printList = (tracks) => {
    tracks.forEach(item => console.log(item));
}
  
  addNewTrack();
  createTrackList(session);
  // console.log('tracks ->', session);
