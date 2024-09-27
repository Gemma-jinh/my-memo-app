import React, { useState, useEffect } from "react";

function App() {
  // useState는 컴포넌트에서 상태를 만들고, 그 상태를 업데이트 하는 역할
  // setNotes: 새 메모가 추가될 때 호출되어 notes 배열이 업데이트
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState(""); //제목 상태
  const [newContent, setNewContent] = useState(""); //내용 상태
  const [isEditing, setIsEditing] = useState(null); //수정 중인 메모 인덱스
  const [editTitle, setEditTitle] = useState(""); // 수정할 제목
  const [editContent, setEditContent] = useState(""); //수정할 내용

  //로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);
  //useEffect(() => {...}, []): 컴포넌트가 처음 렌더링될 때 한 번만 실행되어 localStorage에 저장된 메모를 불러옴.
  //useEffect(() => {...}, [notes]): notes 배열이 업데이트될 때마다 메모를 localStorage에 저장.

  // 메모가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  //메모 추가 기능
  const addNote = () => {
    if (newTitle.trim() && newContent.trim()) {
      const newNote = { title: newTitle, content: newContent };
      //새 메모에 공백만 들어가 있는 경우는 추가되지 않도록 함.
      setNotes([...notes, newNote]); //기존 notes 배열에 새로운 메모(newNote)를 추가
      //...notes는 기존의 메모 배열을 복사하는 스프레드 연산자
      setNewTitle(""); //메모 추가 후 입력 필드 비우기
      setNewContent("");
    }
  };

  //메모 삭제 기능
  const deleteNote = (indexToDelete) => {
    //notes 배열에서 특정 인덱스에 해당하는 메모를 삭제
    //filter()함수를 사용해 indexToDelete와 일치하지 않는 메모만 남겨 새 배열을 만들어 업데이트
    const updatedNotes = notes.filter((_, index) => index !== indexToDelete);
    setNotes(updatedNotes); //notes 상태를 방금 생성한 updatedNotes 배열로 업데이트
    //React는 상태가 변경되면 자동으로 화면을 다시 렌더링하므로, 화면에 수정된 메모가 즉시 반영됨
  };

  //메모 수정 시작
  const startEditing = (index) => {
    // 사용자가 Edit 버튼 클릭시 해당 메모를 수정할 수 있는 입력필드가 나오고, 메모 내용 수정가능
    setIsEditing(index);
    setEditTitle(notes[index].title);
    setEditContent(notes[index].content);
  };

  //메모 수정 완료
  //수정하고자 하는 메모만 editNote 대체, 나머지 메모들은 그대로 유지하는 새로운 배열 updatedNotes 생성
  const submitEdit = (index) => {
    // 수정완료되면 입력한 내용으로 해당 메모 업데이트
    const updatedNotes = notes.map(
      (
        note,
        i //notes 배열을 순회하며, 각 메모 처리
      ) => (i === index ? { title: editTitle, content: editContent } : note) // i는 현재 notes 배열의 인덱스, index는 수정하고자 하는 메모의 인덱스
    ); // i === index: 현재 반복 중인 메모의 인덱스(i)가 수정하고자 하는 메모의 인덱스(index)와 같다면, editNote 반환
    //다르면 기존의 메모 내용(note)을 그대로 반환
    setNotes(updatedNotes);
    setIsEditing(null); //현재 수정 중인 메모 인덱스 null로 설정. 수정 완료 후 초기화
    setEditTitle(""); //editNote 상태를 빈 문자열로 초기화하여, 수정이 완료된 후 입력 필드가 비워지도록 한다
    setEditContent("");
  };
  return (
    <div className="App">
      <h1>Simple Note App</h1>

      {/* 제목과 내용 입력 필드 */}
      <input
        type="text"
        placeholder="Note Title"
        value={newTitle} //newTitle 상태가 입력 필드 값으로 설정
        onChange={(e) => setNewTitle(e.target.value)} // 사용자가 입력할 때마다 그 값이 newTitle 상태로 업데이트
        style={{ display: "block", marginBottom: "10px" }}
      />
      <textarea
        placeholder="Note Content"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        style={{
          display: "block",
          marginBottom: "10px",
          width: "300px",
          height: "100px",
        }}
      />
      {/* 버튼 클릭시 addNote 함수가 호출되어 입력된 메모가 notes 배열에 추가 */}
      <button onClick={addNote}>Add Note</button>

      {/* 메모 목록 */}
      <ul>
        {/* notes 배열에 저장된 메모들을 화면에 표시하기 위해 map() 메서드 사용 */}
        {notes.map((note, index) => (
          // 각 메모를 <li> 요소로 표시 key={index}는 React에서 각 요소가 고유하다는 것을 식별하기 위한 값
          <li key={index} style={{ marginBottom: "20px" }}>
            {isEditing === index ? (
              <>
                {/* 수정 입력 필드 */}
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ display: "block", marginBottom: "10px" }}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    width: "300px",
                    height: "100px",
                  }}
                />
                <button onClick={() => submitEdit(index)}>Submit</button>
              </>
            ) : (
              <>
                {/* 제목과 내용 출력 */}
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => startEditing(index)}>Edit</button>
                <button onClick={() => deleteNote(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
