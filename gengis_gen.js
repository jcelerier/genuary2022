// This function randomizes all the parameters of an LFO process
// (or any process with inlets)
function randomizeLFO(lfo) {
  // First count the number of inlets 
  const N = Score.inlets(lfo);

  // For each inlet:
  for (let i = 0; i < N; ++i) {
    // Get it
    const inl = Score.inlet(lfo, i);

    // Get what its type is ("Float", "Int", "String", etc)
    const val_type = Score.valueType(inl);

    if (val_type === "Float" || val_type === "Int") {
      // In that case check the range of the control
      const min = Score.min(inl);
      const max = Score.max(inl);

      // Generate a value in that range
      const val = min + Math.random() * (max - min);

      // Apply it to the control
      Score.setValue(inl, val);
    } else if (val_type === "String") {
      // If the input is a string it's likely an enumeration
      const values = Score.enumValues(inl); // ["Sin", "Square", ...]

      // Pick an enum value at random
      const val = Math.round(Math.random() * (N - 1));
      const N = values.length;

      // Apply it
      Score.setValue(inl, values[val]);
    }
  }
}

// This function creates a random automation.
// Automations are defined like this: 
//   [
//    [0, 0.2],
//    [0.5, 0.7],
//    [1., 0.4]
//   ]
// will make a curve that starts at 0.2, goes up to 0.7 at the half of the curve, 
// and reaches 0.4 at the end.
// The y values should be between 0 and 1, 
// the x values can go beyond 1 (to write past the default length of the automation).
function randomizeAutomation(autom) 
{
  let arr = [];
  for (let i = 0; i <= 10; i++) {
    let x = i / 10;
    let y = Math.random();

    arr.push([x, y]);
  }
  Score.setCurvePoints(autom, arr);
}

// This function creates a random series of steps for the step sequencer.
function randomizeStep(step) {
  let arr = [];
  for (let i = 0; i <= 10; i++) {
    arr.push(Math.random());
  }
  Score.setSteps(step, arr);
}

// Takes the name of a state and an address to set to each process's output.
function gengis_gen(startState, address) {
  // Look for our state object.
  let ss = Score.find(startState);
  if (ss === null) {
    console.log(`${startState} not found`);
    return;
  }

  // We'll create 16 processes.
  const num = 16;
  const y = ss.heightPercentage;
  var cur_state = ss;

  // Start recording undo / redo commands.
  Score.startMacro();

  for (let i = 0; i < num; i++) {
    const seconds = Math.floor(Math.random() * 10);
    const duration = `00:00:0${seconds}`;

    // Create an interval after the state
    let new_itv = Score.createIntervalAfter(cur_state, duration, 0.1);

    // Create processes by name.
    var p;
    switch (Math.floor(Math.random() * 3) % 3) {
      case 0: {
        p = Score.createProcess(new_itv, "LFO", "");
        randomizeLFO(p);
        break;
      }
      case 1: {
        p = Score.createProcess(new_itv, "Automation (float)", "");
        randomizeAutomation(p);
        break;
      }
      case 2: {
        p = Score.createProcess(new_itv, "Step sequencer", "");
        randomizeStep(p);
        break;
      }
    }

    if (p) {
      // Get the outlet of the process.
      let main_outlet = Score.outlet(p, 0);
      // Set its address.
      Score.setAddress(main_outlet, address);
    }

    // The next interval will start from the end state of the current interval.
    cur_state = Score.endState(new_itv);
  }

  // Apply the macro so that it can be un-done in one step.
  Score.endMacro();
}

// Call it like: 
// gengis_gen("my_state", "foo:/bar")