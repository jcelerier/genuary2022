function bullet(scenario) {
    if(scenario === null) 
      return;

    Score.startMacro();

    // Create a new box    
    const start_seconds = Math.floor(Math.random() * 10);
    const start_duration = `00:00:0${start_seconds}`;

    const len_seconds = Math.floor(1 + Math.random() * 2);
    const len_duration = `00:00:0${len_seconds}`;

    let itv = Score.createBox(scenario, start_duration, len_duration, Math.random() * 0.4 + 0.2);

    // Add an image process within
    {
      let img = Score.createProcess(itv, "Images", "");
  
      // Set the bullet image
      let files = Score.port(img, "Images");
      Score.setValue(files, ["/home/jcelerier/genuary/bullet.png"]);
  
      // Set the output address
      let outlet = Score.outlet(img, 0);
      Score.setAddress(outlet, "window:/");
  
      // Set a random position
      let pos = Score.port(img, "Position");
      Score.setValue(pos, [4*(Math.random()-0.5), 4*(Math.random()-0.5)]);

      // Set a random scale
      let scaleX = Score.port(img, "Scale X");
      let scaleY = Score.port(img, "Scale Y");
      let sc = 0.5 + Math.random() * 0.3;
      Score.setValue(scaleX, sc);
      Score.setValue(scaleY, sc);

      // Add an automation on the opacity
      {
        let opacity = Score.port(img, "Opacity");
        let autom = Score.automate(itv, opacity);
        Score.setCurvePoints(autom, [
            [0., 1.], [1., 0.]
        ]);
      }
    }

    // In the end state, add a small script, which will destroy that box 
    {
        let end = Score.endState(itv);
        const script = `import Score 1.0
Script { start: () => Device.exec("Score.remove(Score.find('${Score.metadata(itv).name}'))"); }
`
        Score.createProcess(end, "Javascript", script);
    }
    // Save as an undo-redo command
    Score.endMacro();

    // Play it
    Score.play(itv);
}

