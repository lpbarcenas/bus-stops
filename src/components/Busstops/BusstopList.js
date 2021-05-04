import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { BUS_STOPS_URL } from '../../constants/urls'
import moment from 'moment'

const BusstopList = props => {

  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const [availableBuses, setAvailableBuses] = useState([]);
  
  useEffect(() => {
    if (selectedBusStop) {
      axios.get(BUS_STOPS_URL + selectedBusStop.id, {
        headers: {
        'Authorization': `Bearer ${props.token}`

      }}
    ).then(res => {
        if (res.data.results) {
          setAvailableBuses(res.data.results)
        } else {
          setAvailableBuses([])
        }
      }) 
    }
  }, [selectedBusStop]);

  const calculateTimeLeft = () => {
    const currentDate = moment().format("yyyy-MM-DD 00:00:00")
    const currentDateUnix = moment(currentDate, "yyyy-MM-DD hh:mm:ss").unix()
    const currentTimeUnix = moment().unix()

    if (selectedBusStop) {
      const nextArrival = selectedBusStop.next_arrival
      const nextArrivalUnix = currentDateUnix + nextArrival
      const fromTime = currentTimeUnix < nextArrivalUnix ? nextArrivalUnix : nextArrivalUnix + 86400;
      const difference = fromTime - currentTimeUnix;
      return {
        hours: Math.floor((difference / (60 * 60)) % 24),
        minutes: Math.floor((difference / 60) % 60),
        seconds: Math.floor(difference % 60),
      }
    }

    return null
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  return (
    <section className="busstop-list">
      <h2>Bus available at { selectedBusStop ? selectedBusStop.name : "" }:</h2>
      <ul>
        {availableBuses.map(bus => (
          <li key={bus.bus_id} >
            <span>{bus.bus_id}</span>
          </li>
        ))}
      </ul>
      <h2>Next arrival: {timeLeft ? timeLeft.hours + " hours " + timeLeft.minutes + " mins " + timeLeft.seconds + " seconds ": ``}</h2>
      <h2>Bus Stops (click on name):</h2>
      <ul>
        {props.busstops.map(bs => (
          <li key={bs.bus_stop_id}  onClick={() => setSelectedBusStop( { id: bs.bus_stop_id, next_arrival: bs.next_arrival, name: bs.name })} >
            <span>{bs.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BusstopList;
