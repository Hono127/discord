import { useState } from "react";
import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  AddCircleOutline,
  CardGiftcardOutlined,
  EmojiEmotionsOutlined,
} from "@mui/icons-material";
import GifIcon from "@mui/icons-material/Gif";

import ChatHeader from "../ChatHeader/ChatHeader";
import Message from "../Message/Message";
import useSubCollection from "../../hooks/useSubCollection";
import { useAppSelector } from "../../app/hooks";
import { db } from "../../firebase";
import "./Chat.scss";

interface Messages {
  timestamp: Timestamp;
  message: string;
  user: {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
}

const Chat = () => {
  const user = useAppSelector((state) => state.user.user);
  const channelId = useAppSelector((state) => state.app.channelId);
  const channelName = useAppSelector((state) => state.app.channelName);

  const [inputText, setInputText] = useState<string>("");
  const { subDocuments: messages } = useSubCollection("channels", "messages");
  const sendMessage = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const collectionRef = collection(
      db,
      "channels",
      String(channelId),
      "messages"
    );
    const docRef: DocumentReference<DocumentData> = await addDoc(
      collectionRef,
      {
        timestamp: serverTimestamp(),
        message: inputText,
        user: user,
      }
    );
    console.log(docRef);

    setInputText("");
  };

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />

      <div className="chatMessages">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            timestamp={message.timestamp}
            user={message.user}
          />
        ))}
      </div>

      <div className="chatInput">
        <AddCircleOutline fontSize="large" />
        <form>
          <input
            type="text"
            placeholder={`#${channelName}へメッセージを送信`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
            value={inputText}
            disabled={Boolean(!channelId)}
          />
          <button
            type="submit"
            className="chatInputButton"
            disabled={Boolean(!channelId)}
            onClick={(e: React.MouseEvent<HTMLElement>) => sendMessage(e)}
          >
            送信
          </button>
        </form>

        <div className="chatInputIcons">
          <CardGiftcardOutlined />
          <GifIcon />
          <EmojiEmotionsOutlined />
        </div>
      </div>
    </div>
  );
};

export default Chat;
