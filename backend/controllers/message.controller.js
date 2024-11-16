import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";

export const sendMessage = async (req, res) => {
  const senderId = req.user._id;
  const recieverId = req.params.id;
  const { message } = req.body;

  try {
    // find if they have already talked
    let convo = await Conversation.findOne({
      particpants: {
        $all: [senderId, recieverId],
      },
    });
    if (!convo) {
      convo = await Conversation({
        particpants: [senderId, recieverId],
        message: message,
      });
    }
    const newMessage = new Message({
      sender: senderId,
      receiver: recieverId,
      message: message,
    });
    if (newMessage) {
      convo.message.push(newMessage._id);
    }
    await Promise.all([convo.save(), newMessage.save()]);

    return res.status(200).json({ code: 1, msg: "success", newMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, msg: "error in sendingmessage" });
  }
};

export const getMessage = async(req,res)=>{
  const senderId = req.user._id;
  const recieverId = req.params.id;
  try {
    const conversation = await Conversation.find({particpants : {
      $all : [senderId, recieverId]
    }})
    if(!conversation){
      return res.status(200).json({code: 1, msg: "No conversation found",conversation: []});
    }
    return res.status(200).json({code:1,msg:"message fetched",conversation:conversation})
  } catch (error) {
    console.log(error);
    return res.status(500).json({code: 0, msg: "error in fetching message"})
  }
}