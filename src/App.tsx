import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios'


export default function App() {

  // переменные и состояния
  const [inputTextName, setInputTextName] = useState("");
  const [inputTextDescription, setInputTextDiscription] = useState('');
  const [Start, setStart] = useState({
    mode: false,
    text: "start"
  });


  const [nowTime, setNowTime] = useState<Date>(new Date());
  const getPadTime = (time: any) => time.toString().padStart(2, "0")
  const [timeleft, setTimeLeft] = useState(0)

  const hours = getPadTime(Math.floor(timeleft / 3600))
  const minutes = getPadTime(Math.floor((timeleft - hours * 3600) / 60));
  const seconds = getPadTime(Math.floor((timeleft - minutes * 60 - hours * 3600)));


  const [isCounting, setIsCounting] = useState(false)
  const [pause, setPause] = useState({
    mode: true,
    pause: false,
    text: "Pause"
  })
  // const telegramData = (window as any).Telegram.WebApp
  // const chat_Id = telegramData.initDataUnsafe.user.id; 

  const userData = {
    Chat_Id: 253563525,//chat_Id,  // сделать аунтификацию в телеграмм
    Name: inputTextName,
    Description: inputTextDescription,
    StartTime: nowTime
  }


  const dateData = {
    Chat_Id: 444664,//chat_Id,
    Hours: hours,
    Minutes: minutes,
    Seconds: seconds,
    Name: inputTextName,
    Description: inputTextDescription,
    StartTime: nowTime

  }

  useEffect(() => {
    const interval = setInterval(() => {
      isCounting &&
        setTimeLeft((timeleft) => (timeleft + 1));
    }, 1000);
    return () => {
      clearInterval(interval)
    }
  }, [isCounting]);

  // обработчики

  const handleClick = () => {
    if (Start.text == "start") {

      const now = new Date()
      setStart({ text: "stop", mode: true });
      setNowTime(now);
      userData.StartTime = now
      axios.post("https://a96f-89-250-212-72.ngrok-free.app/Account/Post", userData).then((response) => {
      });
      setIsCounting(true);
      setPause({ mode: false, text: "Pause", pause: false });
    }

    else {
      setStart({ text: "start", mode: false });
      setPause({ mode: true, text: "Pause", pause: false });
      setIsCounting(false)
      setInputTextName("")
      setInputTextDiscription("")
      setTimeLeft(0)
      dateData.StartTime = nowTime
      axios.post("https://a96f-89-250-212-72.ngrok-free.app/Account/Date", dateData).then((response) => {
      });
    }
  };
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setInputTextName(e.target.value);
  };
  const handleChangeDiscription = (e: ChangeEvent<HTMLInputElement>) => {
    setInputTextDiscription(e.target.value);
  };

  const handlePause = () => {
    if (pause.pause === false) {
      setPause({ mode: false, text: "Peset", pause: true });
      setIsCounting(false)
    }
    else {
      setPause({ mode: false, text: "Pause", pause: false });
      setIsCounting(true)
    }

  };

  let mode = true;
  if (inputTextName.length > 1 && inputTextDescription.length > 1) {
    mode = false;
  }
  else {
    mode = true;
  }


  return (
    <div>
      <h2>Введите название задачи</h2>
      <input onChange={handleChangeName} disabled={Start.mode} value={inputTextName}></input>
      <h2>Введите описание задачи</h2>
      <input onChange={handleChangeDiscription} disabled={Start.mode} value={inputTextDescription}></input>
      {/* <div>{chat_Id}</div> */}

      <div>
        <div>Timer</div>
        <div>{hours}:{minutes}:{seconds}</div>
        <div>
          {pause.mode ? (
            <div>
              <button onClick={handleClick} className='StartTimer' disabled={mode}>{Start.text}</button>
            </div>
          ) : (
            <div>
              <button onClick={handleClick} className='StartTimer' disabled={mode}>{Start.text}</button>
              <button onClick={handlePause}>{pause.text}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}