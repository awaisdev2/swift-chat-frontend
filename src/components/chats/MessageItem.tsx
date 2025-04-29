/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react"

interface MessageProps {
  message: any
  sender?: string
  self?: boolean
}

const MessageItem: FC<MessageProps> = ({ message }) => {
  console.log('message', message)
  return (
    <div className={`flex ${self ? "justify-end" : "justify-start"} px-4 py-2`}>
      <div className={`p-3 rounded-xl max-w-sm ${self ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
        <p className="text-sm">{message.content}</p>
        {/*<span className="text-xs block mt-1 text-right">{sender}</span>*/}
      </div>
    </div>
  )
}

export default MessageItem
