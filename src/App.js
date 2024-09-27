import React, { useState } from "react";

function App() {
  // useState는 컴포넌트에서 상태를 만들고, 그 상태를 업데이트 하는 역할
  // setNotes: 새 메모가 추가될 때 호출되어 notes 배열이 업데이트
  const [notes, setNotes] = useState([]);
  // setNewNote: 사용자가 메모를 입력할 때마다 newNote 변수 업데이트
  const [newNote, setNewNote] = useState("");

  //메모 추가 기능
  const addNote = () => {
    if (newNote.trim()) {
      //새 메모에 공백만 들어가 있는 경우는 추가되지 않도록 함.
      setNotes([...notes, newNote]); //기존 notes 배열에 새로운 메모(newNote)를 추가
      //...notes는 기존의 메모 배열을 복사하는 스프레드 연산자
      setNewNote(""); //메모 추가 후 입력 필드 비우기
    }
  };

  //메모 삭제 기능
  const deleteNote = (indexToDelete) => {
    //notes 배열에서 특정 인덱스에 해당하는 메모를 삭제
    //filter()함수를 사용해 indexToDelete와 일치하지 않는 메모만 남겨 새 배열을 만들어 업데이트
    const updatedNotes = notes.filter((_, index) => index !== indexToDelete);
    setNotes(updatedNotes);
  };
  return (
    <div className="App">
      <h1>Simple Note App</h1>

      {/* 메모 입력 필드 */}
      <input
        type="text"
        placeholder="Write a note..."
        value={newNote} //newNote 상태가 입력 필드 값으로 설정
        onChange={(e) => setNewNote(e.target.value)} // 사용자가 입력할 때마다 그 값이 newNote 상태로 업데이트
      />
      {/* 버튼 클릭시 addNote 함수가 호출되어 입력된 메모가 notes 배열에 추가 */}
      <button onClick={addNote}>Add Note</button>

      {/* 메모 목록 */}
      <ul>
        {/* notes 배열에 저장된 메모들을 화면에 표시하기 위해 map() 메서드 사용 */}
        {notes.map((note, index) => (
          // 각 메모를 <li> 요소로 표시 key={index}는 React에서 각 요소가 고유하다는 것을 식별하기 위한 값
          <li key={index}>
            {note}
            <button onClick={() => deleteNote(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
