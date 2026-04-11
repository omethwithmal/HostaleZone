const Notification = require("../Model/Notification.js");
const User = require("../Model/User.js");

exports.notifyUser = async ({
  recipientId,
  title,
  message,
  type = 'system',
  link = '',
}) => {
  if (!recipientId || !title || !message) {
    return null;
  }

  return Notification.create({
    recipientId,
    title,
    message,
    type,
    link,
  });
};

exports.notifyRoleUsers = async (role, payload) => {
  const users = await User.find({ role }).select('_id');

  if (!users.length) {
    return [];
  }

  return Notification.insertMany(
    users.map((user) => ({
      recipientId: user._id,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'system',
      link: payload.link || '',
    }))
  );
};
