import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function App() {
  const [boards, setBoards] = useState([
    {id: 1, title: 'Сделать', items:[]},
    {id: 2, title: 'В работе', items:[]},
    {id: 3, title: 'Завершено', items:[]},
    {id: 4, title: 'Отправить на доработку', items:[]}
  ])

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'))
    if (items){
      setBoards(items)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(boards))
  }, [boards])

  const [currentBoard, setCurrentBoard] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)
  const [card, setCard] = useState('')

  function dragOverHandler(e){
    e.preventDefault()
    if(e.target?.classList?.contains("item")){
      e.target.style.boxShadow = '0 2px 3px gray'
    }
  }

  function dragLeaveHandler(e){
    e.target.style.boxShadow = 'none'
  }

  function dragStartHandler(e, board, item){
    setCurrentBoard(board)
    setCurrentItem(item)
  }

  function dragEndHandler(e){
    e.target.style.boxShadow = 'none'
  }

  function dropHandler(e, board, item){
    e.stopPropagation()
    e.target.style.boxShadow = 'none'
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex,1)
    const dropIndex = board.items.indexOf(item)
    board.items.splice(dropIndex + 1, 0 ,currentItem)

    setBoards(boards.map(b => {
      if(b.id === board.id){
        return board
      }
      if(b.id === currentBoard.id){
        return currentBoard
      }
      return b
    }))
  }

  function dropCardHandler(e, board) {
    board.items.push(currentItem)
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex,1)

    setBoards(boards.map(b => {
      if(b.id === board.id){
        return board
      }
      if(b.id === currentBoard.id){
        return currentBoard
      }
      return b
    }))
  }

  function addHandler(e, board) {
    if (!card) return
    console.log(board)
    const newCard = {id: Date.now(), title: card}
    board.items.push(newCard)
    setBoards(boards.map(b => {
      if(b.id === board.id){
        return board
      }
      if(b.id === currentBoard?.id){
        return currentBoard
      }
      return b
    }))
    setCard('')
  }

  function deleteHandler(e, board, item) {
    const deleteIndex = board.items.indexOf(item)
    board.items.splice(deleteIndex, 1)

    setBoards(boards.map(b => {
      if(b.id === board.id){
        return board
      }
      if(b.id === currentBoard?.id){
        return currentBoard
      }
      return b
    }))
  }

  return (
    <div className="App w-[100vw] h-[100vh] overflow-hidden ">
      <Navbar/>
        <div 
          className='kanban_board items-center h-[100%] justify-center flex gap-8 p-2'
        >
          {boards.map(board => 
            <div 
              key={board.id} 
              className={board.id == 4 ? 'board border-[5px] rounded-xl border-solid border-[#23272A] p-3 w-[400px] h-[500px] overflow-auto' : 'board border-[5px] rounded-xl border-solid border-[#181b1d] p-3 w-[400px] h-[500px] overflow-auto'}
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropCardHandler(e, board)}
              >

              <div 
                className='text-3xl text-center p-2 text-[#F6F6F6] flex justify-between select-none'
                >
                <p className='inline-block'>{board.title}</p>
                <label htmlFor={board.id} className="btn modal-button"><AddIcon/></label>
              </div>
            
              <input type="checkbox" id={board.id} className="modal-toggle" />
              <div className="modal">
                <div className="modal-box relative">
                  <label htmlFor={board.id} className="btn btn-sm btn-circle absolute right-2 top-2" onClick={(e) => setCard('')}>✕</label>
                  <h3 className="text-lg font-bold text-center p-5 mb-7">Добавить новую задачу</h3>
                  <input type="text" placeholder="Задача" className="input input-bordered input-primary w-full max-w-xs" value={card} onChange={(e) => setCard(e.target.value)}/>
                  <button className="btn btn-active btn-primary ml-5" onClick={(e) => addHandler(e, board)}>Добавить</button>
                </div>
              </div>
              
              {board.items.map(item => 
                <div key={item.id} className="flex items-center m-2 break-all">
                  <div key={item.id}
                  onDragOver={(e) => dragOverHandler(e)}
                  onDragLeave={(e) => dragLeaveHandler(e)}
                  onDragStart={(e) => dragStartHandler(e, board, item)}
                  onDragEnd={(e) => dragEndHandler(e)}
                  onDrop={(e) => dropHandler(e, board, item)}
                  className='item text-xl rounded-xl mx-2 my-1 border-[#a991f7] border-[2px] p-2 w-[100%]'
                  draggable={true}
                  >
                    {item.title}
                  </div>

                  <label htmlFor={item.id} className="btn modal-button"><DeleteForeverIcon/></label>
                  <input type="checkbox" id={item.id} className="modal-toggle" />
                  <div className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Осторожно!</h3>
                      <p className="py-4">Вы действительно хотите удалить задачу?</p>
                      <div className="modal-action">
                        <label htmlFor={item.id} className="btn">Нет</label>
                        <label htmlFor={item.id} className="btn" onClick={(e) => deleteHandler(e, board, item)}>Да</label>
                      </div>
                    </div>
                  </div>

                </div>
                )}
            </div>
        )}
        </div>
    </div>
  );
}

export default App;