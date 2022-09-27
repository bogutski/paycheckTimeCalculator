import { useState } from 'react';

// calculate time interval duration in minutes from start to end, 24h format
// start example '09:00'
// end example '18:00'
function calculateDuration(start, end) {
  const startHours = parseInt(start.split(':')[0]);
  const startMinutes = parseInt(start.split(':')[1]);
  const endHours = parseInt(end.split(':')[0]);
  const endMinutes = parseInt(end.split(':')[1]);

  const totalStartMinutes = startHours * 60 + startMinutes;
  const totalEndMinutes = endHours * 60 + endMinutes;

  return totalEndMinutes - totalStartMinutes;
}


// calculate cost for minutes and rate per hour
function calculateCost(min, rate) {
  return (min / 60) * rate;
}

// format hours and minutes from minutes
function formatHoursAndMinutes(min) {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;

  return `${hours} hours ${minutes} min`;
}

// app for calculation work time and earned money
function App() {


  // state for rate
  const [rate, setRate] = useState(15);

  // state for slot hours array
  // slot example
  // {
  //   id: 1,
  //   start: '09:00',
  //   end: '10:00',
  //   totalMin: 60,
  //   totalCost: 1,
  //  }

  const [slots, setSlots] = useState([]);

  // onSlotChange
  const onSlotChangeStart = (id, start) => {
    const newSlots = slots.map((slot) => {
        if (slot.id === id) {
          const totalMin = calculateDuration(start, slot.end);
          return {
            ...slot,
            start,
            totalMin,
            totalCost: calculateCost(totalMin, rate),
          };
        }
        return slot;
      }
    );

    setSlots(newSlots);
  };

  const onSlotChangeEnd = (id, end) => {
    const newSlots = slots.map((slot) => {
      if (slot.id === id) {
        const totalMin = calculateDuration(slot.start, end);
        return {
          ...slot,
          end,
          totalMin,
          totalCost: calculateCost(totalMin, rate),
        };
      }
      return slot;
    });

    setSlots(newSlots);
  };

  const onAddSlot = () => {
    const updatedSlots = [...slots, {
      id: slots.length + 1,
      start: '',
      end: '',
      totalMin: 0,
      totalCost: 0,
    }];

    setSlots(updatedSlots);
  };

  const onRemoveSlot = (id) => {
    const updatedSlots = slots.filter((slot) => slot.id !== id);
    setSlots(updatedSlots);
  };

  return (
    <div className="container pt-2">
      <h4 className="mb-3">Paycheck Calculation</h4>

      <div className="row mb-4">
        <div className="col-6">
          <div className="input-group">
            <span className="input-group-text">Rate per hour, $</span>

            <input type="number" className="form-control" value={rate}
                   onChange={(e) => setRate(e.target.value)} />
          </div>
        </div>

        <div className="col-6">
          <button className="btn btn-secondary"
                  onClick={() => setSlots([])}>Reset
          </button>
        </div>
      </div>

      <div>
        {slots.map((slot) => (
          <div key={slot.id}
               className="row row-cols-lg-auto g-3 align-items-center mb-2">

            <div className="col-4">
              <div className="input-group">
                <input type="time" value={slot.start} className="form-control"
                       onChange={(e) => onSlotChangeStart(slot.id, e.target.value)} />
              </div>
            </div>

            <div className="col-4">
              <div className="input-group">
                <input type="time" value={slot.end} className="form-control"
                       onChange={(e) => onSlotChangeEnd(slot.id, e.target.value)} />
              </div>
            </div>

            <div className="col-1">
              <button onClick={() => onRemoveSlot(slot.id)}
                      className="btn btn-danger">×
              </button>
            </div>

            <div className="col-3">
              <span
                className="me-3">{formatHoursAndMinutes(slot.totalMin)}</span>
              <span>${slot.totalCost}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 mb-4">
        <button onClick={onAddSlot} className="btn btn-primary">Add slot
        </button>
      </div>

      <div>
        <h6>Total
          time {formatHoursAndMinutes(slots.reduce((acc, slot) => acc + slot.totalMin, 0))}</h6>

        <h6>
          ${slots.reduce((acc, slot) => acc + slot.totalCost, 0)}
        </h6>

      </div>

    </div>
  );
}

export default App;
