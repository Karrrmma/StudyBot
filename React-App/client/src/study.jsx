import { useEffect, useState } from "react";
import './study.css'

function StudyBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);  
    useEffect(()=>{
        const storeMessage = localStorage.getItem('chatMessages');
        if(storeMessage){
            setMessages(JSON.parse(storeMessage));
        }
    },[]);
     useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);
    const reset=(indexToDelete)=>{
        setMessages(messages.filter((_, index)=> index !== indexToDelete))
    }
   
    
    const handleSendMessages = async (e) => {

        e.preventDefault();
        if (input.trim() === "") return;  

        try{const response = await fetch('/api/ask',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                
            },
            body:JSON.stringify({
                question:input,
                conversation:messages
            }),
        });
            const data = await response.json();
            const reply = data.notes;
            
            setMessages([...messages,{role:'user', content:input}, {role:'bot',content:reply}]);  
            setInput("");  
        }
        catch(error){
            console.error("Error sending message:", error);


        }
       

    };
    const resetMessages = () => {
        setMessages([]);
        localStorage.removeItem('chatMessages');
    };

    

    return (
        <>
            <div className="chat-container">
                
                {/* Messages display */}
                <div>
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.role}`}>
                            <span>{message.content}</span>
                            <button
                            className="delete-button"
                            onClick={()=> reset(index)}>
                            


                            </button>
                        </div>
                    ))}
                </div>
 
                {/* Input form */}
                <form className="input-box" onSubmit={handleSendMessages}>
                    <input
                        className='chatbox'
                        placeholder="Ask any question"
                        value={input}  
                        onChange={(e) => setInput(e.target.value)} 
                    />
                    <button type='submit'>Send</button>
                </form>

            {/* Error Handling */}
            {error && <p className="error-message">{error}</p>}

            {/* Reset Button */}
            <button className="reset-button" onClick={resetMessages}>Reset Chat</button>


            </div>
        </>
    );
}

export default StudyBot;
