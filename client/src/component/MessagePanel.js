
const MessagePanel = ({ users, selectedUser }) => {
    if (selectedUser && users) {
        return (
            <div>
                <div>
                    <h3>{selectedUser.username}</h3>
                </div>
                <div className="py-2">
                    {users.map(user => user.userID === selectedUser.userID && user.messages.map((message, index) => (
                        <div key={index} className={message.fromSelf ? 'ml-auto text-wrap msg bg-warning' : 'text-wrap msg'} >
                            <p>{message.content}</p>
                            <p className="text-right m-1"><small><i> -- {message.fromSelf ? 'Yourself' : user.username}</i></small></p>
                        </div>
                    )))
                    }
                </div>
            </div>
        )
    }
    return null
}

export default MessagePanel